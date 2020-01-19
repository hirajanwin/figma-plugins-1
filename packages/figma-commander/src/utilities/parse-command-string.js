import { plugins } from '../plugins/plugins'

export const shorthands = Object.keys(plugins)
  .reduce(function (result, key) {
    result.push(plugins[key].shorthand)
    return result
  }, [])
  .sort(function (a, b) {
    if (a.length !== b.length) {
      return b.length - a.length
    }
    return a.localeCompare(b)
  })

const whitespaceRegex = /\s+/

export function parseCommandString (commandString) {
  const trimmed = commandString.trim()
  if (trimmed !== '') {
    for (const shorthand of shorthands) {
      if (trimmed.indexOf(shorthand) === 0) {
        const values = commandString.substring(shorthand.length).trim()
        return {
          shorthand,
          values: values === '' ? [] : values.split(whitespaceRegex)
        }
      }
    }
  }
  return {
    shorthand: null,
    values: []
  }
}
