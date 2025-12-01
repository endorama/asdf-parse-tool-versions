import fs from 'node:fs'
import readline from 'node:readline'
import path from 'node:path'

export function getPathToFile(working_directory_path: string): string {
  let path_to_file
  if (working_directory_path === '') {
    path_to_file = path.join(process.cwd(), '.tool-versions')
    // console.info('The working_directory input is empty; use default directory.');
  } else {
    path_to_file = path.join(working_directory_path, '.tool-versions')
    // console.info('working_directory_path: ' + file_path)
  }

  return path_to_file
}

export async function parseToolVersions(
  file: string
): Promise<Map<string, string>> {
  // const content = fs.readFileSync(file, 'utf8')

  const readInterface = readline.createInterface({
    input: fs.createReadStream(file),
    crlfDelay: Infinity
  })

  const tools = new Map<string, string>()
  for await (const line of readInterface) {
    const simplifiedLine = line.replace(/ +/g, ' ')
    const tool = simplifiedLine.split(' ')
    if (tool[0].length !== 0) {
      tools.set(sanitizeName(tool[0]), tool[1])
    }
  }

  return tools
}

function sanitizeName(name: string): string {
  return name.replace(/-/g, '_')
}
