import {cp, mkdir, rm} from 'node:fs/promises'
import {createRequire} from 'node:module'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const require = createRequire(import.meta.url)
const cesiumRoot = path.dirname(require.resolve('cesium/package.json'))
const sourceRoot = path.join(cesiumRoot, 'Build', 'Cesium')
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const targetRoot = path.resolve(scriptDirectory, '..', 'public', 'cesium')
const runtimeDirectories = ['Assets', 'ThirdParty', 'Widgets', 'Workers']

// These files are generated from the installed Cesium package, never hand-edited
// or committed. Removing the target first prevents stale workers after upgrades.
await rm(targetRoot, {recursive: true, force: true})
await mkdir(targetRoot, {recursive: true})

await Promise.all(
  runtimeDirectories.map((directory) =>
    cp(path.join(sourceRoot, directory), path.join(targetRoot, directory), {
      recursive: true,
      force: true,
    })
  )
)

console.log(`Prepared Cesium runtime assets in ${targetRoot}`)
