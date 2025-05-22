'use strict'

const LASER_SPEED = 50
var gHero = { pos: { i: 12, j: 5 }, isShoot: false }
var gPoints = 0
// creates the hero and place it on board
function createHero(board) {
  board[gHero.pos.i][gHero.pos.j].gameObject = HERO
}
// Handle game keys

function onKeyDown(event) {
  // console.log('event:', event)

  // console.log('event.key:', event.key)

  const i = gHero.pos.i
  const j = gHero.pos.j
  console.log(i)
  console.log(j)

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

// Move the hero right (1) or left (-1)

function moveHero(i, j) {
  console.log('i, j:', i, j)
  const lastRowIdx = gBoard.length - 1
  const lastColIdx = gBoard[0].length - 1

  if (j === -1) j = lastColIdx
  if (j === lastColIdx + 1) j = 0
  if (i === -1) i = lastRowIdx
  if (i === lastRowIdx + 1) i = 0

  const targetCell = gBoard[i][j]

  // Calculate distance to make sure we are moving to a neighbor cell

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

  const shootInterval = setInterval(() => {
    if (laserPos.i < 0) {
      if (laserPos.i + 1 < gBoard.length) {
        var lastCell = gBoard[laserPos.i + 1][laserPos.j]

        if (lastCell.gameObject === LASER && (laserPos.i + 1 !== gHero.pos.i || laserPos.j !== gHero.pos.j)) {
          lastCell.gameObject = null
          renderCell({ i: laserPos.i + 1, j: laserPos.j }, '')
        }
      }

      clearInterval(shootInterval)
      gHero.isShoot = false
      return
    }

    const cell = gBoard[laserPos.i][laserPos.j]

    if (cell.gameObject === ALIEN) {
      cell.gameObject = null
      renderCell(laserPos, '')
      gPoints += 10
      renderScore()
      isVictory()
      console.log(gPoints)

      clearInterval(shootInterval)
      gHero.isShoot = false

      if (laserPos.i < gBoard.length - 1) {
        if (laserPos.i + 1 !== gHero.pos.i || laserPos.j !== gHero.pos.j) {
          gBoard[laserPos.i + 1][laserPos.j].gameObject = null
          renderCell({ i: laserPos.i + 1, j: laserPos.j }, '')
        }
      }

      return
    }

    if (laserPos.i < gBoard.length - 1) {
      if (laserPos.i + 1 !== gHero.pos.i || laserPos.j !== gHero.pos.j) {
        gBoard[laserPos.i + 1][laserPos.j].gameObject = null
        renderCell({ i: laserPos.i + 1, j: laserPos.j }, '')
      }
    }

    gBoard[laserPos.i][laserPos.j].gameObject = LASER
    renderCell(laserPos, LASER)

    laserPos.i--

    renderCell(gHero.pos, HERO)
  }, LASER_SPEED)
}
