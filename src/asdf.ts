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
    const simplifiedLine = line.replace(/ +/g, ' ')
    const tool = simplifiedLine.split(' ')
    if (tool[0].length !== 0) {
      tools.set(tool[0], tool[1])
    }
  }

  return tools
}
