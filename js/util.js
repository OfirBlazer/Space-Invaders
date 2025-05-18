'use strict'

// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN}
const SKY = 'SKY'

function createCell(gameObject = null) {
  return {
    type: SKY,
    gameObject: gameObject,
  }
}
function getElCell(pos) {
  return document.querySelector(`[data-i='${pos.i}'][data-j='${pos.j}']`)
}
