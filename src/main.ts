import * as core from '@actions/core'
import { parseToolVersions } from './asdf'
import path from 'node:path'

async function run(): Promise<void> {
  try {
    const file = path.join(process.cwd(), '.tool-versions')
    core.debug(file)
    const tools = await parseToolVersions(file)

    core.warning('All found versions are exported to env variables')
    core.startGroup('.tool-versions')
    for (const [key, value] of tools) {
      core.info(`Gathered '${key}' version ${value}`)
      const envVarName = toEnvVarName(key)
      core.info(`Exported as ${envVarName}`)
      core.exportVariable(`${envVarName}`, value)
    }
    core.endGroup()

    core.setOutput('tools', JSON.stringify(Object.fromEntries(tools)))
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

export function toEnvVarName(name: string): string {
  return `${name.toUpperCase().replace(/-/g, '_')}_VERSION`
}

run()
