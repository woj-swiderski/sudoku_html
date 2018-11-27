"use strict";
const ARR = ["1","2","3","4","5","6","7","8","9"];
const msg = document.getElementById('msg');
const msg2 = document.getElementById('msg2');

const selector = document.getElementById('selector');
selector.addEventListener('click', selectorClicked);
selector.addEventListener('mouseover', selectorMouseOver);
selector.addEventListener('mouseout', selectorMouseOut);

const sudoku = document.getElementById('sudoku');
sudoku.addEventListener('click', sudokuClicked);

const sTable = [];

createSudoku();
createSelector();


function createSudoku(){
    for (let j = 0; j < 9; j++){
        let row = document.createElement('div');
        row.classList.add('sudokuRow');
        sudoku.appendChild(row);
        for (let i = 0; i < 9; i++){
            let el = document.createElement('div');
            el.id = j + "" + i;
            el.innerHTML = i;
            el.locked = false;
            el.value = 0;
            el.classList.add('sudokuCell');
            row.appendChild(el);
            sTable.push(el);
        }
        
    }
    msg2.innerHTML = sTable.map(x=>x.id);
}

function createSelector(){
    for (let j=1; j < 10; j++){
        let item = document.createElement('div');
        item.classList.add('selectorItem');
        item.innerHTML = j;
        item.counter = 0;   // how many times item occured in the table so far
        selector.appendChild(item);
    }
}

function sudokuClicked(e){
    e.preventDefault();
    msg.innerHTML = e.target.id;
}

function selectorClicked(e){
    e.preventDefault();
    if (ARR.includes(e.target.innerHTML)) {
        msg.innerHTML = e.target.innerHTML;
        return e.target.innerHTML;
    }
    return 0; // just to be on the safe side
}

function selectorMouseOver(e){
    e.preventDefault();
    if (ARR.includes(e.target.innerHTML)) {
        e.target.style.background = '#98F1FF';
    }
}

function selectorMouseOut(e){
    e.preventDefault();
    if (ARR.includes(e.target.innerHTML)) {
        e.target.style.background = 'silver';
    }
}
