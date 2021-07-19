
import { board, minesLeft, mineCount } from "./script.js"




//AUDIO
var audioWin = new Audio('./audios/Win.wav')

var audioMarked = new Audio('./audios/Marked.wav');

var audioLose = new Audio('./audios/Lose.wav')

var audioNumber = new Audio("./audios/Number.wav")
//GAME LOGIC



//CREATING BOX


export function createBox(sizeOfBox, numberOfMines) {

    let box = []
    let mineLocations = minePosition(sizeOfBox, numberOfMines)
    //ROWS
    for (let x = 0; x < sizeOfBox; x++) {
        let rows = [];
        //CELLS             
        for (let y = 0; y < sizeOfBox; y++) {
            let div = document.createElement('div');
            div.dataset.status = "hidden";
            div.setAttribute("class", "cellIndividual")
            let cell = {
                div,
                x,
                y,
                mine: mineLocations.some(p => p.x === x && p.y === y),
                get status() {
                    return this.div.dataset.status
                },
                set status(value) {
                    this.div.dataset.status = value
                }
            }
            rows.push(cell)

        }
        box.push(rows)

    }

    return box

}

//CREATING MINE POSITION  

function minePosition(sizeOfBox, numberOfMines) {


    let positions = []

    while (positions.length < numberOfMines) {

        let position = {
            x: Math.floor(Math.random() * sizeOfBox),
            y: Math.floor(Math.random() * sizeOfBox)
        }

        if (!positions.some(p => matchPositions(p, position))) {
            positions.push(position)

        }



    }

    return positions

}

//CHECKING FOR DUPLICATE MINE POSITIONS

function matchPositions(a, b) {
    return (a.x === b.x && a.y === b.y)
}



//MARKING CELL

export function markCell(box, element, numberOfMines) {

    if (element.status !== "hidden" && element.status !== "marked") {
        return
    }

    if (element.status === "marked") {
        element.status = "hidden"
        element.div.textContent = ""

        markCount(box, numberOfMines)
        audioMarked.play();

        return
    }

    else {
        element.status = "marked"
        markCount(box, numberOfMines)
        element.div.textContent = "🚩";
        audioMarked.play();

        return
    }

}

//REVEALING CELL


export function revealCell(box, cell) {
    if (cell.status !== "hidden") {
        return
    }
    //REVEAL ALL MINES
    if (cell.mine) {

        cell.status = "mine";
        cell.div.textContent = "💣";
        box.map(rows => {
            rows.map(cell => {
                if (cell.mine) {
                    revealCell(box, cell)

                }
            })
        })
        return
    }

    if (cell.status === "hidden") {
        audioNumber.play()
    }

    cell.status = "number";

    let adjacentCells = nearByCells(box, cell)
    let mines = adjacentCells.filter(p => p.mine === true)
    if (mines.length === 0) {
      
         //REVEAL ALL EMPTY CELLS

        adjacentCells.forEach(p => revealCell(box, p))

    }
    else {
        cell.div.textContent = mines.length

    }


}



//NEARBY MINES 

function nearByCells(box, { x, y }) {
    let cells = [];

    for (let xOff = -1; xOff <= 1; xOff++) {
        for (let yOff = -1; yOff <= 1; yOff++) {
            let mineCell = box[x + xOff]?.[y + yOff]
            if (mineCell) cells.push(mineCell)
        }
    }
    return cells

}



//CHECK WIN OR LOSE 



export function checkWinLose(box) {

    let win = checkWin(box);
    let lose = checkLose(box);


    if (win || lose) {

        var elem = document.querySelector('.board');
        elem.replaceWith(elem.cloneNode(true));

        board.classList.add("disabled");

        //PAUSE TIMER
        startTimer(-1)


    }

    if (win) {
        minesLeft.textContent = "You Win  😎";
        audioWin.play()
    }
    else if (lose) {
        minesLeft.textContent = "You Lost 💀";
        audioLose.play()
    }

}


//WIN OR LOSE 

function checkWin(box) {


    return box.every(rows => {
        return rows.every(cell => {
            return cell.status === "number" || (cell.mine && (cell.status === "hidden" || cell.status === "marked"))
        }
        )
    })

}



function checkLose(box) {
    return box.some(rows => {
        return rows.some(cell => {
            return cell.status === "mine"
        })
    })



}



//CHECK MARK COUNT 


function markCount(box, numberOfMines) {
    let hi = []
    box.map(rows => {
        rows.filter(cell => {
            if (cell.status === "marked")
                hi.push(cell)
        })
    })
    mineCount.textContent = numberOfMines - hi.length
}



//TIMER

let timer = document.getElementById('stopwatch')
let interval;
export function startTimer(flag) {

    if (flag === 1) {
        let min = 0;
        let sec = 0;

        interval = window.setInterval(() => {

            sec++;
            if (sec === 60) {
                min++;
                sec = 0;
            }

            if (sec < 10) {
                sec = "0" + sec
            }

            if (min < 10) {
                timer.innerHTML = `0${min}:${sec}`

            }
            else if (min >= 10) {

                timer.innerHTML = `${min}:${sec}`

            }
        }, 1000)

    }

    else if (flag === -1) {
       
            window.clearInterval(interval)

    }




}


//GAME RESET 

export function reset() {
    window.clearInterval(interval)
    timer.innerHTML = "00:00"
}

