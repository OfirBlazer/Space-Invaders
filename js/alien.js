'use strict'
const ALIEN_SPEED = 1000

var gIntervalAliens
var gAliensDirection = 'right'
var isShiftDown = false

var gAliensOnBoard = 0

var gAliensTopRowIdx = 1

var gAliensBottomRowIdx = 3

var gIsAlienFreeze = true

function createAliens(board) {
  gAliensOnBoard = 0
  for (var i = gAliensTopRowIdx; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      if (i <= ALIEN_ROW_COUNT) {
        if (j < gAliensBottomRowIdx) continue
        if (j < board[0].length - gAliensBottomRowIdx) {
          board[i][j].gameObject = ALIEN
          gAliensOnBoard++
        }
      }
    }
  }
}

function shiftBoardRight(board, fromI = gAliensTopRowIdx, toI = gAliensBottomRowIdx) {
  for (var i = fromI; i <= toI; i++) {
    for (var j = gBoard[0].length - 2; j >= 0; j--) {
      if (board[i][j].gameObject === ALIEN) {
        board[i][j].gameObject = null
        board[i][j + 1].gameObject = ALIEN
      }
    }
    renderBoard(board)
  }
}

function shiftBoardLeft(board, fromI = gAliensTopRowIdx, toI = gAliensBottomRowIdx) {
  for (var i = fromI; i <= toI; i++) {
    for (var j = 1; j < board[0].length; j++) {
      if (board[i][j].gameObject === ALIEN) {
        board[i][j].gameObject = null
        board[i][j - 1].gameObject = ALIEN
      }
    }
  }
  renderBoard(board)
}

function shiftBoardDown(board) {
  for (var i = board.length - 2; i >= 0; i--) {
    for (var j = 0; j < board[0].length; j++) {
      if (board[i][j].gameObject === ALIEN) {
        board[i][j].gameObject = null

        board[i + 1][j].gameObject = ALIEN
      }
    }
  }
  gAliensTopRowIdx++
  gAliensBottomRowIdx++

  renderBoard(board)
}

function moveAliens() {
  if (!gGame.isOn) return
  var isCorner = isAlienHitCorner(gBoard)

  if (isCorner && !isShiftDown) {
    shiftBoardDown(gBoard)
    // console.log('down')

    isShiftDown = true
    gAliensDirection = gAliensDirection === 'right' ? 'left' : 'right'
  } else {
    isShiftDown = false
    if (gAliensDirection === 'right') {
      shiftBoardRight(gBoard)
      // console.log('right')
    } else {
      shiftBoardLeft(gBoard)
      // console.log('left')
    }
  }
  checkAlienReachedHero()
  renderBoard(gBoard)
}

function checkAlienReachedHero() {
  var heroI = gHero.pos.i
  var heroJ = gHero.pos.j

  if (gBoard[heroI][heroJ].gameObject === ALIEN) {
    gGame.isOn = false
    clearInterval(gIntervalAliens)
    isVictory()
    var elVictory = document.querySelector('.victory')
    elVictory.style.display = 'block'
    elVictory.querySelector('span').innerText = 'Game Over 😞'
  }
}

function isAlienHitCorner(board) {
  for (var i = gAliensTopRowIdx; i <= gAliensBottomRowIdx; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (board[i][j].gameObject === ALIEN) {
        if (j === 0 || j === board[0].length - 1) {
          if (gAliensTopRowIdx === board.length - 1) isVictory()
          return true
        }
      }
    }
  }
  return false
}
