export function ungroupSingleLayerGroup (layer) {
  if (shouldUngroupLayer(layer) === true) {
    const index = layer.parent.children.indexOf(layer)
    layer.parent.insertChild(index, layer.children[0])
    return true
  }
  return false
}

function shouldUngroupLayer (layer) {
  return (
    layer.type === 'GROUP' &&
    layer.children.length === 1 &&
    layer.backgrounds.length === 0 &&
    layer.blendMode === 'PASS_THROUGH' &&
    typeof layer.constraints === 'undefined' &&
    layer.effects.length === 0 &&
    layer.exportSettings.length === 0
  )
}