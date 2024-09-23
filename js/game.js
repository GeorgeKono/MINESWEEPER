'use strict'

const MINE_IMG = '<img src="img/police4.png">'
const FLAG_IMG = '<img src="img/key.png">'

const gLevel = {
    SIZE: 4,
    MINES: 2,
}

const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}

var gBoard

function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)
}

function buildBoard() {
    const size = gLevel.SIZE
    const mines = gLevel.MINES
    var board = []
    var placedMines = 0

    for (var i = 0; i < size; i++) {
        board.push([])
        
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }            
        }
    }

    while (placedMines < mines) {
        var randomRowIdx = getRandomInt(0, board.length)
        var randomColIdx = getRandomInt(0, board.length)
        
        if (!board[randomRowIdx][randomColIdx].isMine) {
            board[randomRowIdx][randomColIdx].isMine = true
            placedMines++
        }

    }

    setMinesNegsCount(board)

    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(this, ${i}, ${j})"></td>`
        }
        strHTML += '</tr>'

        const elContainer = document.querySelector('.board')
        elContainer.innerHTML = strHTML
    }
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]
            const currRowIdx = i
            const currColIdx = j
            currCell.minesAroundCount = countMinesAround(board, currRowIdx, currColIdx)
        }
    }
}

function onCellClicked(elCell, i, j) {
    const currCell = gBoard[i][j]

    if (currCell.isShown || currCell.isMarked) return

    if (currCell.isMine) {
        currCell.isShown = true
        gameOver()
        
        elCell.style.cursor = 'default'
        elCell.style.backgroundColor = 'lightcoral'
        elCell.innerHTML = MINE_IMG
    }
    
    else if (currCell.minesAroundCount) {
        currCell.isShown = true
        gGame.shownCount++
        checkGameOver()
        
        elCell.style.cursor = 'default'
        elCell.style.backgroundColor = 'white'
        elCell.innerHTML = currCell.minesAroundCount
    }

    else if (currCell.minesAroundCount === 0) {
        expandShown(gBoard, elCell, i, j)
    }
}

function expandShown(board, elCell, i, j) {
    const currRowIdx = i
    const currColIdx = j
    for (var i = currRowIdx - 1; i <= currRowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = currColIdx - 1; j <= currColIdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            
            var currCell = board[i][j]

            if (currCell.isShown || currCell.isMarked) continue
            currCell.isShown = true
            gGame.shownCount++
            
            var elCurrCell = document.querySelector(`.cell-${i}-${j}`)
            elCurrCell.style.cursor = 'default'
            elCurrCell.style.backgroundColor = 'white'
            
            if (!currCell.minesAroundCount) continue
            elCurrCell.innerHTML = currCell.minesAroundCount
        }                
    } 
}

function onCellMarked(elCell, i, j) {
    const currCell = gBoard[i][j]

    if (currCell.isShown) return
    
    if (currCell.isMarked) {
        currCell.isMarked = false
        gGame.markedCount--
        checkGameOver()

        elCell.style.cursor = 'pointer'
        elCell.innerHTML = ''
        return
    }

    currCell.isMarked = true
    gGame.markedCount++
    checkGameOver()

    elCell.style.cursor = 'default'
    elCell.innerHTML = FLAG_IMG
}

function checkGameOver() {
    const boardSize = Math.pow(gLevel.SIZE, 2) 
    if (gGame.shownCount + gGame.markedCount != boardSize) return
    
    gameOver()
}

function gameOver() {
    gGame.isOn = false
    console.log('Game over!')
}
