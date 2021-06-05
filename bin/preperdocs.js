#!/usr/bin/env node
/* eslint-disable spellcheck/spell-checker */

const { resolve, basename } = require('path')
const { readdir, readFile, writeFile } = require('fs').promises
const jsdoc2md = require('jsdoc-to-markdown')

/**
 * @param {string} dir - base dir to read files from.
 * @param {string[]} exclude - what directories to exclude.
 * @returns {Promise<Array<string>>} array with all the file name in a directory.
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
 * render markdown for types files
 *
 * @returns {Promise<string>} rendered markdown for types.
 */
async function preperTypeFile () {
  const allFiles = await getFiles(process.cwd(), ['node_modules', 'test', 'coverage'])
  const typsFiles = allFiles.filter(file => 'types' === basename(file, '.js'))

  return jsdoc2md.render({ files: typsFiles })
}

/**
 * @returns {Array<{file: string, markdown: Promise<string>}>}
 */
async function preperWpcliFiles () {
  const wpcliFiles = await getFiles(resolve(process.cwd(), 'src/wp-cli'), ['index.js', 'util.js', 'types.js'])

  /**
   * expect to get type import path and return the only file name capitalize.
   *
   * @param {string} importPath the regex match im import type. ig "import('./class')"
   * @param {string} className only the name of the import class
   * @returns {string} import file name capitalize.
   */
  const replaceImport = (importPath, className) => className[0].toUpperCase() + className.slice(1)

  return wpcliFiles.map(file => ({
    file: basename(file, '.js'),
    markdown: readFile(file)
      .then(fileContent => fileContent.toLocaleString().replace(/import\(.*\/(.+)'\)/g, replaceImport))
      .then(fileContent => jsdoc2md.render({ source: fileContent })),
  }))
}

/**
 * the main function of the cli.
 */
async function preperdocs () {
  const markdownFiles = []

  const typeMarkdownPromise = preperTypeFile()

  markdownFiles.push({ file: 'types', markdown: typeMarkdownPromise })

  markdownFiles.push.apply(markdownFiles, await preperWpcliFiles())

  const links = await Promise.all(markdownFiles.map(async files => {
    const markdown = await files.markdown
    const types = markdown.match(/<a name="(.*)"><\/a>/g)
      .map(match => match.substring(9, match.length - 6))

    return {
      file: files.file,
      types: types,
    }
  }))

  console.log(links)
}

preperdocs()
