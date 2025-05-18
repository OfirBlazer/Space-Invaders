'use strict'

const BOARD_SIZE = 14
const ALIEN_ROW_LENGTH = 8
const ALIEN_ROW_COUNT = 3

const HERO = '♆'
const ALIEN = '👽'
const LASER = '⤊'

var gBoard
var gHeroPos
var gGame = {
  isOn: false,
  alienCount: 0,
}
function updateCell(pos, gameObject = null) {
  gBoard[pos.i][pos.j].gameObject = gameObject
  var elCell = getElCell(pos)
  elCell.innerHTML = gameObject || ''
}

// onInit()

function onInit() {
  gBoard = createBoard()
  createHero(gBoard)
  createAliens(gBoard)
  console.log(gBoard)

  renderBoard(gBoard)
}

function createBoard() {
  var mat = []

  for (var i = 0; i < BOARD_SIZE; i++) {
    mat.push([])

    for (var j = 0; j < BOARD_SIZE; j++) {
      var cell = createCell()
      // console.log(cell)
      // מייצר שורה של aliens
      if (i === 1 && j <= ALIEN_ROW_LENGTH) {
        // console.log('hi')

        cell.gameObject = ALIEN
      }
      mat[i][j] = cell
    }
  }
  // console.log(cell)

  // mat[13][5] = cell
  mat[2][4].gameObject = LASER
  return mat
}

function renderBoard(board) {
  var strHTML = '<table>'

  // console.log(createCell())
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      const currCell = board[i][j]
      // console.log(currCell)

      var cellClass = getClassName({ i, j })

      if (currCell.gameObject === ALIEN) {
        cellClass += ' alien'
        // console.log(cellClass)
      }
      if (currCell.gameObject === HERO) {
        cellClass += ' hero'
      }
      if (currCell.gameObject === LASER) {
        cellClass += ' laser'
      }
      strHTML += '<td class="cell ' + cellClass + '"onclick="moveTo(' + i + ',' + j + ')" >'

      if (currCell.gameObject === ALIEN || currCell.gameObject === HERO || currCell.gameObject === LASER) {
        strHTML += currCell.gameObject
      }
      strHTML += '</td>'
    }
    strHTML += '</tr>'
  }
  strHTML += '</table>'
  var elBoard = document.querySelector('.board')

  elBoard.innerHTML = strHTML
}

function moveTo(i, j) {
  console.log('i, j:', i, j)
  const lastRowIdx = gBoard.length - 1
  const lastColIdx = gBoard[0].length - 1
  // console.log(j)

  // if (j === -1) j = lastColIdx
  // if (j === lastColIdx + 1) j = 0
  // if (i === -1) i = lastRowIdx
  // if (i === lastRowIdx + 1) i = 0

  // console.log(i)

  const targetCell = gBoard[i][j]

  // Calculate distance to make sure we are moving to a neighbor cell
  const iAbsDiff = Math.abs(i - gHero.pos.i)
  console.log(iAbsDiff)

  const jAbsDiff = Math.abs(j - gHero.pos.j)
  console.log('jAbsDiff:', jAbsDiff)
  console.log(jAbsDiff)

  // if (
  //   (iAbsDiff === 1 && jAbsDiff === 0) ||
  //   (jAbsDiff === 1 && iAbsDiff === 0) ||
  //   jAbsDiff === lastColIdx ||
  //   iAbsDiff === lastRowIdx
  // // )
  // if (targetCell.gameObject === null) {
  //   targetCell.gameObject = null
  // }

  renderCell(gHero.pos, '')
  gBoard[gHero.pos.i][gHero.pos.j].gameObject = null

  gHero.pos.i = i
  gHero.pos.j = j
  gBoard[i][j].gameObject = HERO
  console.log(gBoard)

  renderCell(gHero.pos, HERO)
}
function renderCell(location, value) {
  const cellSelector = '.' + getClassName(location)
  const elCell = document.querySelector(cellSelector)
  elCell.innerHTML = value
}

function onHandleKey(event) {
  console.log('event:', event)

  // console.log('event.key:', event.key)
  const i = gHero.pos.i
  const j = gHero.pos.j
  console.log(i)
  console.log(j)

  switch (event.key) {
    case 'ArrowLeft':
      moveTo(i, j - 1)
      break
    case 'ArrowRight':
      moveTo(i, j + 1)
      break
  }
}

function getClassName(location) {
  // {i,j}
  const cellClass = `cell-${location.i}-${location.j}`
  return cellClass
}
