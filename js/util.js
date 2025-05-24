'use strict'

const SKY = 'SKY'

function createCell(gameObject = null) {
  return {
    type: SKY,
    gameObject: gameObject,
  }
}

function getClassName(location) {
  const cellClass = `cell-${location.i}-${location.j}`
  return cellClass
}
