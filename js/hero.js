'use strict'

const LASER_SPEED = 40
var gHero = { pos: { i: 12, j: 5 }, isShoot: false }
var gPoints = 0

function createHero(board) {
  board[gHero.pos.i][gHero.pos.j].gameObject = HERO
}

function onKeyDown(event) {
  if (!gGame.isOn) return
  const i = gHero.pos.i
  const j = gHero.pos.j

  switch (event.key) {
    case 'ArrowLeft':
      moveHero(i, j - 1)
      break
    case 'ArrowRight':
      moveHero(i, j + 1)
      break
    case 'ArrowUp':
      if (!gHero.isShoot) shoot()

      break
  }
}

function moveHero(i, j) {
  const lastRowIdx = gBoard.length - 1
  const lastColIdx = gBoard[0].length - 1

  if (j === -1) j = lastColIdx
  if (j === lastColIdx + 1) j = 0
  if (i === -1) i = lastRowIdx
  if (i === lastRowIdx + 1) i = 0

  const targetCell = gBoard[i][j]

  const iAbsDiff = Math.abs(i - gHero.pos.i)
  const jAbsDiff = Math.abs(j - gHero.pos.j)
  if (iAbsDiff > 0) return

  if (jAbsDiff > 1) return

  if (
    (iAbsDiff === 1 && jAbsDiff === 0) ||
    (jAbsDiff === 1 && iAbsDiff === 0) ||
    jAbsDiff === lastColIdx ||
    iAbsDiff === lastRowIdx
  )
    if (targetCell.gameObject === null) {
      targetCell.gameObject = null
    }

  renderCell(gHero.pos, '')
  gBoard[gHero.pos.i][gHero.pos.j].gameObject = null

  gHero.pos.i = i
  gHero.pos.j = j
  gBoard[i][j].gameObject = HERO

  renderCell(gHero.pos, HERO)
}

function shoot() {
  gHero.isShoot = true

  var laserPos = { i: gHero.pos.i - 1, j: gHero.pos.j }

  var shootInterval = setInterval(function () {
    if (laserPos.i + 1 < gBoard.length) {
      var prevCell = gBoard[laserPos.i + 1][laserPos.j]
      if (prevCell.gameObject === LASER) {
        prevCell.gameObject = null
        renderCell({ i: laserPos.i + 1, j: laserPos.j }, '')
      }
    }

    if (laserPos.i < 0) {
      clearInterval(shootInterval)
      gHero.isShoot = false
      return
    }

    var currCell = gBoard[laserPos.i][laserPos.j]

    if (currCell.gameObject === ALIEN) {
      currCell.gameObject = null
      renderCell({ i: laserPos.i, j: laserPos.j }, '')
      gPoints += 10
      renderScore()
      gAliensOnBoard--
      isVictory()
      clearInterval(shootInterval)
      gHero.isShoot = false
      return
    }

    if (laserPos.i === 0) {
      currCell.gameObject = LASER
      renderCell({ i: laserPos.i, j: laserPos.j }, LASER)
      setTimeout(function () {
        currCell.gameObject = null
        renderCell({ i: laserPos.i, j: laserPos.j }, '')
      }, LASER_SPEED)
      clearInterval(shootInterval)
      gHero.isShoot = false
      return
    }

    currCell.gameObject = LASER
    renderCell({ i: laserPos.i, j: laserPos.j }, LASER)

    laserPos.i--
  }, LASER_SPEED)
}
