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
    gGame.shownCount = 0
}

function buildBoard() {
    const size = gLevel.SIZE
    var board = []

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

function setMines(board, firstClickedRowIdx, firstClickedColIdx) {
    const mines = gLevel.MINES
    var placedMines = 0

    while (placedMines < mines) {
        var randomRowIdx = getRandomInt(0, board.length)
        var randomColIdx = getRandomInt(0, board.length)

        if ((randomRowIdx != firstClickedRowIdx || randomColIdx != firstClickedColIdx)
            && !board[randomRowIdx][randomColIdx].isMine) {
            board[randomRowIdx][randomColIdx].isMine = true
            placedMines++
            console.log('Mine placed');
        }
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

function startGame(firstClickedRowIdx, firstClickedColIdx) {
    gGame.isOn = true
    setMines(gBoard, firstClickedRowIdx, firstClickedColIdx)
    setMinesNegsCount(gBoard)
}

function onCellClicked(elCell, i, j) {
    const currCell = gBoard[i][j]

    if (!gGame.shownCount) {
        startGame(i, j)
        console.log('Start the game!')
    }

    if (currCell.isShown || currCell.isMarked) return

    if (currCell.isMine) {
        currCell.isShown = true
        gameOver()
        
        elCell.classList.add('mine')
        elCell.innerHTML = MINE_IMG
    }
    
    else if (currCell.minesAroundCount) {
        currCell.isShown = true
        gGame.shownCount++
        checkGameOver()
        
        elCell.classList.add('shown')
        elCell.innerHTML = currCell.minesAroundCount
    }

    else if (currCell.minesAroundCount === 0) {
        expandShown(gBoard, elCell, i, j)
        console.log('Third case');
        
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
            elCurrCell.classList.add('shown')
            
            if (!currCell.minesAroundCount) continue
            elCurrCell.innerHTML = currCell.minesAroundCount
        }                
    } 
}

function onCellMarked(elCell, i, j) {
    const currCell = gBoard[i][j]

    if (!gGame.isOn) return
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

function gameLevel(difficulty) {
    switch (difficulty) {
        case 'Begginer':
            gLevel.SIZE = 4
            gLevel.MINES = 2
            onInit()
            console.log('Begginer!')
            break;
        case 'Medium':
            gLevel.SIZE = 8
            gLevel.MINES = 14
            onInit()
            console.log('Medium!')
            break
        case 'Expert':
            gLevel.SIZE = 12
            gLevel.MINES = 32
            onInit()
            console.log('Expert!')
            break
    }
}