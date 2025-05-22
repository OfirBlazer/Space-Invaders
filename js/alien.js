'use strict'
const ALIEN_SPEED = 500

var gIntervalAliens
var gAliensDirection = 'right'
var isShiftDown = false
// The following two variables represent the part of the matrix (some rows)
// that we should shift (left, right, and bottom)
// We need to update those when:
// (1) shifting down and (2) last alien was cleared from row
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

function handleAlienHit(pos) {}

function shiftBoardRight(board, fromI = gAliensTopRowIdx, toI = gAliensBottomRowIdx) {
  for (var i = fromI; i <= toI; i++) {
    // console.log('from i', i)

    for (var j = gBoard[0].length - 2; j >= 0; j--) {
      // console.log(j)

      if (board[i][j].gameObject === ALIEN) {
        board[i][j].gameObject = null
        board[i][j + 1].gameObject = ALIEN
      }
    }
    renderBoard(board)
  }
}

function shiftBoardLeft(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
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
    // console.log(i)
    for (var j = 0; j < board[0].length; j++) {
      // console.log(board[i][j])
      if (board[i][j].gameObject === ALIEN) {
        board[i][j].gameObject = null

        board[i + 1][j].gameObject = ALIEN
      }
    }
  }
  gAliensTopRowIdx++
  gAliensBottomRowIdx++
  console.log(gAliensBottomRowIdx)

  if (gAliensBottomRowIdx === 12) {
    clearInterval(gIntervalAliens)
    isVictory()
  }
  renderBoard(board)
}

// runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops
function moveAliens() {
  var isCorner = isAlienHitCorner(gBoard)
  console.log(isCorner, 'iscorner')

  if (isAlienHitCorner(gBoard) && !isShiftDown) {
    shiftBoardDown(gBoard)
    isShiftDown = true
    gAliensDirection = gAliensDirection === 'right' ? 'left' : 'right'
  } else {
    isShiftDown = false
    if (gAliensDirection === 'right') {
      shiftBoardRight(gBoard)
      console.log('Moving right')
    } else {
      shiftBoardLeft(gBoard)
      console.log('Moving left')
    }
  }
  // console.log(gBoard)

  renderBoard(gBoard)
}

function isAlienHitCorner(board) {
  for (var i = gAliensTopRowIdx; i <= gAliensBottomRowIdx; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (board[i][j].gameObject === ALIEN) {
        if (j === 0 || j === board[0].length - 1) {
          return true
        }
      }
    }
  }
  return false
}
