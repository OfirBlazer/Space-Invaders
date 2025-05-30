'use strict'

const BOARD_SIZE = 14
const ALIEN_ROW_LENGTH = 8
const ALIEN_ROW_COUNT = 3
var elVictoryText = ''
const HERO = '🐓'
const ALIEN = '👽'
const LASER = '🥚'
var gBoard

var gGame = {
  isOn: false,
  alienCount: 0,
}

function onInit() {
  reset()
  gGame.isOn = true
  gBoard = createBoard()
  renderScore()
  createHero(gBoard)
  createAliens(gBoard)
  renderBoard(gBoard)
}

function createBoard() {
  var mat = []

  for (var i = 0; i < BOARD_SIZE; i++) {
    mat.push([])

    for (var j = 0; j < BOARD_SIZE; j++) {
      var cell = createCell()

      mat[i][j] = cell
    }
  }

  return mat
}

function renderBoard(board) {
  var strHTML = '<table>'

  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      const currCell = board[i][j]

      var cellClass = getClassName({ i, j })

      strHTML += '<td class="cell ' + cellClass + '"onclick="moveHero(' + i + ',' + j + ')" >'

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

function renderCell(location, value) {
  const cellSelector = '.' + getClassName(location)
  const elCell = document.querySelector(cellSelector)

  elCell.innerHTML = value
}
function renderScore() {
  var elScore = document.querySelector('.score span ')
  elScore.innerText = gPoints
}

function isVictory() {
  if (gPoints === 240) {
    gGame.isOn = false
    document.body.onkeydown = null
    clearInterval(gIntervalAliens)

    const elVictory = document.querySelector('.victory')
    elVictory.style.display = 'block'

    const elVictoryText = elVictory.querySelector('span')
    elVictoryText.innerText = 'You Win! 🎉'
    var elStartGame = document.querySelector('.start-game')
    elStartGame.style.display = 'block'
  }
}
function reset() {
  clearInterval(gIntervalAliens)
  gPoints = 0
  gHero = { pos: { i: 12, j: 5 }, isShoot: false }
  var elVictory = document.querySelector('.victory')
  // var isFirstMove = 0
  elVictory.style.display = 'none'

  gAliensTopRowIdx = 1
  gAliensBottomRowIdx = 3
  gAliensDirection = 'right'
}
function startGame() {
  isFirstShoot++
  gGame.isOn = true
  var elStartGame = document.querySelector('.start-game')
  elStartGame.style.display = 'none'

  reset()
  clearInterval(gIntervalAliens)
  gGame.isOn = true
  gBoard = createBoard()
  renderScore()
  createHero(gBoard)
  createAliens(gBoard)
  gIntervalAliens = setInterval(moveAliens, ALIEN_SPEED)
  renderBoard(gBoard)
  document.body.onkeydown = onKeyDown
}
