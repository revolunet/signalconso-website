import fs from 'fs'
import yaml from 'js-yaml'
import mapValues from 'lodash/mapValues'
import sortBy from 'lodash/sortBy'
import path from 'path'
import {checkAnomaliesYaml} from '../anomalies/checks/checkAnomaliesJson'

const rootDir = path.resolve('./src/anomalies/hierarchical')
const jsonOutputFile = path.resolve(rootDir, '..', 'anomalies-from-hierarchical.json')
const INDEX_YAML = '__index.yaml'

// Attempt to read the new file tree structure from 'hierarchical' folder
// and resolve imports
function readNewHierarchicalAnomalies() {
  const anomalyDirs = dirContentSorted(rootDir, {excludedFileName: '__imports'})
  const anomalies = anomalyDirs.map(_ => {
    return resolveImportsRecursively(buildSubcategoryFromFileOrFolder(_))
  })
  checkAnomaliesYaml(anomalies)
  console.log(`The YAML is valid`)
  addUniqueId(anomalies)
  console.log(`Generating JSON file ${jsonOutputFile}`)
  fs.writeFileSync(jsonOutputFile, JSON.stringify(anomalies, null, 2))
}

// Read a file or a folder
// Returns a Subcategory
// except it can use 'customimport', so it's not exactly the correct type
function buildSubcategoryFromFileOrFolder(_path: string): any {
  console.log('Reading ', _path)
  throwIfNotExists(_path)
  if (isFile(_path)) {
    return readFileYaml(_path)
  }
  // It's a directory
  // Read __index.yaml
  const indexFile = path.join(_path, INDEX_YAML)
  throwIfNotExists(indexFile, `Missing file ${INDEX_YAML} in ${_path}`)
  if (!isFile(indexFile)) {
    throw new Error(`${indexFile} is supposed to be a file, not a directory`)
  }
  const indexYaml: any = readFileYaml(indexFile)
  // Read the rest (each file or folder turns into a subcat of this subcat)
  const otherFilesOrSubdirs = dirContentSorted(_path, {excludedFileName: INDEX_YAML})
  const subSubcats = otherFilesOrSubdirs.map(subpath => {
    return buildSubcategoryFromFileOrFolder(subpath)
  })
  // Then merge
  const subcat = {
    ...indexYaml,
    subcategories: subSubcats,
  }
  return subcat
}

// Read a file or folder (within __imports)
// Build the object or array that we're supposed to import
//
// The logic is slightly different from the main method, if it's a folder :
//  - we don't expect an __index.yaml
//  - we build an array of subcategories for each file/subdir
//    (instead of building the subcategory above)
function buildImportableFromFileOrFolder(_path: string): any {
  console.log('Reading ', _path)
  if (!exists(_path)) {
    throw new Error(`Nothing at path ${_path}`)
  }
  if (isFile(_path)) {
    return readFileYaml(_path)
  } else {
    // Read the rest (each file or folder turns into a subcat of this subcat)
    const filesOrSubdirs = dirContentSorted(_path)
    const subcats = filesOrSubdirs.map(subpath => {
      // recurse with the other method
      return buildSubcategoryFromFileOrFolder(subpath)
    })
    return subcats
  }
}

function resolveImportsRecursively(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(resolveImportsRecursively)
  }
  if (typeof obj === 'object' && obj !== null) {
    // It's an object
    // Resolve imports
    const {customimport, ...rest} = obj
    let imported = {}
    if (customimport) {
      checkCustomImportIsValid(customimport)
      console.log('Resolving import of ', customimport)
      const fullImportPath = path.join(rootDir, customimport)
      imported = buildImportableFromFileOrFolder(fullImportPath)
    }
    if (Array.isArray(imported)) {
      return imported.map(resolveImportsRecursively)
    } else {
      const obj2 = Array.isArray(imported) ? imported : {...rest, ...imported}
      // Then recurse
      const obj3 = mapValues(obj2, v => {
        return resolveImportsRecursively(v)
      })
      return obj3
    }
  }
  return obj
}

function checkCustomImportIsValid(customimport: string) {
  // make sure that there is not funny import path
  const validPaths = ['__imports/subcategories/', '__imports/blockingInfo/', '__imports/detailInputs/']
  if (!validPaths.some(_ => customimport.startsWith(_))) {
    throw new Error(`Import of "${customimport}" is invalid, it should start with one of these ${validPaths.join(', ')}`)
  }
}

function addUniqueId(obj: any, depth = 0, prefix?: string): void {
  let index = 1
  obj.forEach((entry: any) => {
    const id = `${prefix ? prefix + '.' : ''}${entry.id || index++}`
    entry.id = id
    if (entry.subcategories) {
      addUniqueId(entry.subcategories, depth + 1, id)
    }
  })
}

// List both files and subfolders
// Sort them by name
function dirContentSorted<A>(dirPath: string, {excludedFileName}: {excludedFileName?: string} = {}) {
  return sortBy(fs.readdirSync(dirPath), _ => _)
    .filter(_ => _ !== excludedFileName)
    .map(_ => path.join(dirPath, _))
}

function readFileYaml(filePath: string): any {
  return yaml.load(fs.readFileSync(filePath, 'utf-8'))
}

function exists(_path: string) {
  return fs.existsSync(_path)
}
function isFile(_path: string) {
  return exists(_path) && fs.statSync(_path).isFile()
}
function throwIfNotExists(_path: string, message?: string) {
  if (!exists(_path)) {
    throw new Error(message ?? `Nothing at path ${_path}`)
  }
}

readNewHierarchicalAnomalies()
