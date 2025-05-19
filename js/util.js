'use strict'

// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN}
const SKY = 'SKY'

function createCell(gameObject = null) {
  return {
    type: SKY,
    gameObject: gameObject,
  }
}

function getClassName(location) {
  // {i,j}
  const cellClass = `cell-${location.i}-${location.j}`
  return cellClass
}
