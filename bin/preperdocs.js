#!/usr/bin/env node
/* eslint-disable spellcheck/spell-checker */

const { resolve, basename } = require('path')
const { readdir, readFile, writeFile } = require('fs').promises
const jsdoc2md = require('jsdoc-to-markdown')

/**
 * @param {string} dir - base dir to read files from.
 * @param {string[]} exclude - what directories to exclude.
 * @returns {Promise<Array>} array with all the file name in a directory.
 */
async function getFiles (dir, exclude = []) {
  const dirents = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(dirents.map((dirent) => {
    const res = resolve(dir, dirent.name)
    if ('.' === dirent.name[0] || exclude.find(dir => dir === dirent.name)) { return }
    return dirent.isDirectory() ? getFiles(res, exclude) : res
  }))
    .then(files => files.filter(file => file))
  return Array.prototype.concat(...files)
}

/**
 * the main function of the cli.
 */
async function preperdocs () {
  const allFiles = await getFiles(process.cwd(), ['node_modules', 'test', 'coverage'])
  const typsFiles = allFiles.filter(file => 'types' === basename(file, '.js'))

  await jsdoc2md.render({ files: typsFiles })
    .then(markdown => writeFile(resolve(process.cwd(), 'docs-tmp/types.md'), markdown))

  const rawWpcliFiles = await getFiles(resolve(process.cwd(), 'src/wp-cli'), ['node_modules', 'test', 'coverage'])

  const wpcliFiles = await rawWpcliFiles.filter(file => !['index', 'util', 'types'].find(exclude => exclude === basename(file, '.js')))

  const wpcliFilesContent = await Promise.all(wpcliFiles.map(async file => ({
    file: basename(file, '.js'),
    content: (await readFile(file)).toLocaleString()
      .replace(/import\(.*\/(.+)'\)/g, (importPath, className) => className[0].toUpperCase() + className.slice(1)),
  })))

  wpcliFilesContent.map(content => jsdoc2md.render({ source: content.content })
    .then(render => writeFile(`docs-tmp/${content.file}.md`, render)))
}

preperdocs()
