import { Layer } from '../types'
import { MIXED } from './constants'

type Dimensions = {
  width: number | string
  height: number | string
}

export function computeDimensions(nodes: Array<Layer>): Dimensions {
  if (nodes.length === 0) {
    return { height: '', width: '' }
  }
  if (nodes.length === 1) {
    const { width, height } = nodes[0]
    return { height, width }
  }
  const [firstNode, ...rest] = nodes
  const result: Dimensions = {
    height: firstNode.height,
    width: firstNode.width
  }
  for (const { width, height } of rest) {
    if (result.width !== MIXED && result.width !== width) {
      result.width = MIXED
    }
    if (result.height !== MIXED && result.height !== height) {
      result.height = MIXED
    }
  }
  return result
}
