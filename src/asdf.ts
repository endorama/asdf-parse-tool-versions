import fs from 'node:fs'
import readline from 'node:readline'

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
    const tool = line.split(' ')
    if (tool[0].length !== 0) {
      tools.set(sanitizeName(tool[0]), tool[1])
    }
  }

  return tools
}

function sanitizeName(name: string): string {
  return name.replace(/-/g, '_')
}
