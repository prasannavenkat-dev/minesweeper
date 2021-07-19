import { createBox, markCell, revealCell, checkWinLose, startTimer, reset } from "./minesweeper.js";

let sizeOfBox = 10;
let numberOfMines = 7;


document.body.onload = loadGame(sizeOfBox, numberOfMines)

var minesLeft;
var board;
var mineCount;


//GAME RESET
let btn = document.getElementById("rest");

btn.addEventListener('click', () => {

    reset()

    document.querySelector('.board').innerHTML = ""
    loadGame(sizeOfBox, numberOfMines)
})


//LOAD GAME

function loadGame(sizeOfBox, numberOfMines) {



    //ONLOAD AUDIO

    var GameloadAudio = new Audio("./audios/Gameload.wav");
    GameloadAudio.play()

    //TIMER

    startTimer(1)



   //MINES LEFT

    document.querySelector('.subtext').innerHTML = ` Mines Left: <span data-mine-count></span>`


    mineCount = document.querySelector('[data-mine-count]')
    mineCount.textContent = numberOfMines

    let box = createBox(sizeOfBox, numberOfMines)
    board = document.querySelector('.board');
    board.style.setProperty("--size", sizeOfBox)

    minesLeft = document.querySelector(".subtext")

   
    //CREATING BOX-CELLS

    box.map(rows => {
        rows.map(cell => {
            board.append(cell.div)

            //LEFT CLICK 

            cell.div.addEventListener('click', () => {

                revealCell(box, cell)
                checkWinLose(box, cell)
            });

            //RIGHT CLICK

            cell.div.addEventListener('contextmenu', (e) => {
                e.preventDefault()
                console.log(cell);
                markCell(box, cell, numberOfMines)
                box.map(rows => {
                    rows.filter(cell => {
                        cell.status === "marked"
                    })
                })
            })

        })
    })

}


export { minesLeft, board, mineCount }
