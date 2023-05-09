import toml from '@iarna/toml'
import fs from 'fs'
import fsExtra from 'fs-extra'
import yaml from 'js-yaml'
import sortBy from 'lodash/sortBy'
import path from 'path'
import {rimrafSync} from 'rimraf'
const rootDir = path.resolve('./src/anomalies/hierarchical')

// Attempt to read the new file tree structure from 'hierarchical' folder
// and resolve imports
function readNewHierarchicalAnomalies() {
  const subcatBuildDemarchageAbusif = buildSubcatFromFileOrFolder(path.join(rootDir, '17_Demarchage_abusif'))

  console.log(subcatBuildDemarchageAbusif)
}

// Returns a Subcategory
// except it can use 'customimport', so it's not exactly the correct type
function buildSubcatFromFileOrFolder(_path: string): any {
  console.log('Reading ', _path)
  const type = checkPathType(_path)
  if (type === 'missing') {
    throw new Error(`Nothing at path ${_path}`)
  } else if (type === 'file') {
    const subcat = readFileYaml(_path)
    return subcat
  } else {
    // Read __index.yaml
    const indexFile = path.join(_path, '__index.yaml')
    const indexType = checkPathType(indexFile)
    if (indexType === 'missing') {
      throw new Error(`Missing file __index.yaml in ${_path}`)
    }
    if (indexType === 'dir') {
      throw new Error(`${indexFile} is supposed to be a file, not a directory`)
    }
    const indexYaml = readFileYaml(indexFile)
    // Read the rest (each file or folder turns into a subcat of this subcat)
    const otherFilesOrSubdirs =
      // force the order based on filenames
      sortBy(fs.readdirSync(_path), _ => _)
        .map(_ => path.join(_path, _))
        .filter(_ => _ !== indexFile)
    const subSubcats = otherFilesOrSubdirs.map(subpath => {
      return buildSubcatFromFileOrFolder(subpath)
    })
    // Then merge
    const subcat = {
      ...indexYaml,
      subcategories: subSubcats,
    }
    return subcat
  }
}

function resetDir(path: string): void {
  console.log('Resetting directory', path)
  const exists = fs.existsSync(path)
  if (exists) {
    rimrafSync(path)
  }
  fs.mkdirSync(path, {recursive: true})
}

function removeWholeDir(path: string): void {
  console.log('Removing if it exists', path)
  const exists = fs.existsSync(path)
  if (exists) {
    rimrafSync(path)
  }
}

function removeFile(filePath: string): void {
  fs.unlinkSync(filePath)
}

function createDir(path: string): void {
  fs.mkdirSync(path, {recursive: true})
}

function padTo2(num: number): string {
  return num.toString().padStart(2, '0')
}

function copyWholeDir(source: string, destination: string) {
  console.log(`Copying dir ${source} to ${destination}`)
  fsExtra.copySync(source, destination)
}

function readFileRaw(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8')
}

function readFileYaml(filePath: string): any {
  return yaml.load(fs.readFileSync(filePath, 'utf-8'))
}

function forEachFileInDirectoryRecursive(directory: string, callback: (filePath: string) => void) {
  const files = fs.readdirSync(directory)
  for (const file of files) {
    const filePath = path.join(directory, file)
    const stats = fs.statSync(filePath)
    if (stats.isFile()) {
      callback(filePath)
    } else if (stats.isDirectory()) {
      forEachFileInDirectoryRecursive(filePath, callback)
    }
  }
}

// iterate over the files directly in that directory
// ignores the subdirectories
function forEachFileInDirectory(directory: string, callback: (filePath: string) => void) {
  const files = fs.readdirSync(directory)
  for (const file of files) {
    const filePath = path.join(directory, file)
    const stats = fs.statSync(filePath)
    if (stats.isFile()) {
      callback(filePath)
    }
  }
}

function mapEachFileOrSubdirInDirectoryExceptIndex<A>(directory: string, callback: (filePath: string) => A): A[] {
  const res: A[] = []
  const files = fs.readdirSync(directory)
  // force the order based on filenames
  const filesSorted = sortBy(files, _ => _)
  for (const file of filesSorted) {
    const filePath = path.join(directory, file)
    res.push(callback(filePath))
  }
  return res
}

function extractFileName(path: string): string {
  const fileNameWithExtension = path.split('/').pop()!
  const fileNameWithoutExtension = fileNameWithExtension.replace(/\.[^/.]+$/, '')
  return fileNameWithoutExtension
}

function removePrefix(text: string, prefix: string): string {
  if (text.startsWith(prefix)) {
    return text.slice(prefix.length)
  } else {
    return text
  }
}

function replacePrefix(text: string, prefix: string, replacement: string): string {
  if (text.startsWith(prefix)) {
    return replacement + text.slice(prefix.length)
  } else {
    return text
  }
}

function checkPathType(path: string): 'file' | 'dir' | 'missing' {
  const stats = fs.statSync(path)
  if (stats.isFile()) {
    return 'file'
  } else if (stats.isDirectory()) {
    return 'dir'
  } else {
    return 'missing'
  }
}

readNewHierarchicalAnomalies()
