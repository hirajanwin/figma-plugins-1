import {
  formatErrorMessage,
  formatSuccessMessage,
  pluralize
} from '@create-figma-plugin/utilities'

import { getTextNodes } from '../utilities/get-text-nodes'
import { resetTextLayerNames } from './utilities/reset-text-layer-names'

export default async function (): Promise<void> {
  if (figma.currentPage.selection.length === 0) {
    figma.closePlugin(formatErrorMessage('Select one or more text layers'))
    return
  }
  const nodes = getTextNodes()
  if (nodes.length === 0) {
    figma.closePlugin(formatErrorMessage('No text layers in selection'))
    return
  }
  resetTextLayerNames(nodes)
  figma.closePlugin(
    formatSuccessMessage(
      `Reset ${nodes.length} text layer ${pluralize(nodes.length, 'name')}`
    )
  )
}
