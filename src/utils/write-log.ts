'use server'

import { promisify } from 'util'
import fs from 'fs'

const writeFile = promisify(fs.writeFile)

export async function writeLogToFile(
  data: any,
  filePath: string
): Promise<void> {
  try {
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
    console.log('Graph data successfully written to', filePath)
  } catch (err) {
    console.error('Error writing to file', err)
  }
}
