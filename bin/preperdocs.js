/* eslint-disable spellcheck/spell-checker */

const { resolve, basename } = require('path')
const { existsSync } = require('fs')
const { readdir, readFile, writeFile, mkdir } = require('fs/promises')
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
    if ('.' === dirent.name[0] || exclude.find(dir => dir === dirent.name)) { return 0 }
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
 * @returns {Promise<Array<{file: string, markdown: string}>>} return file its markdown.
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

  return await Promise.all(wpcliFiles.map(async file => ({
    file: basename(file, '.js'),
    markdown: await readFile(file)
      .then(fileContent => fileContent.toLocaleString().replace(/import\(.*\/(.+)'\)/g, replaceImport))
      .then(fileContent => jsdoc2md.render({ source: fileContent })),
  })))
}

/**
 * excract all the type links
 *
 * @param {Array<{file: string, markdown: string}>} markdownFiles nulinked markdown files
 * @returns {object} object of links
 */
function extractLinks (markdownFiles) {
  const links = markdownFiles.map(files => {
    const types = {}

    files.markdown.match(/<a name="(.*)"><\/a>/g)
      .forEach((match) => {
        match = match.substring(9, match.length - 6)

        types[match] = `./${files.file}.md#${match}`
      })

    return types
  })

  return Object.assign({}, ...links)
}

/**
 * the main function of the cli.
 */
async function preperdocs () {
  const markdownFiles = []

  markdownFiles.push({ file: 'types', markdown: await preperTypeFile() })

  markdownFiles.push.apply(markdownFiles, await preperWpcliFiles())

  const links = extractLinks(markdownFiles)

  const docsDir = resolve(process.cwd(), 'docs')

  if (!existsSync(docsDir)) { await mkdir(docsDir) }

  const regexPromise = new RegExp(`&lt;(${Object.keys(links).join('|')})&gt;`, 'g')
  const regexType = new RegExp(`(?<!\\[)<code>(${Object.keys(links).join('|')})<\\/code>`, 'g')

  markdownFiles.forEach(file => {
    const setLink = (code, type) => `[${code}](${links[type]})`

    file.markdown = file.markdown.replace(regexPromise, setLink)
    file.markdown = file.markdown.replace(regexType, setLink)

    writeFile(resolve(docsDir, `${file.file}.md`), file.markdown)
  })
}

preperdocs()
  .catch(console.error)
