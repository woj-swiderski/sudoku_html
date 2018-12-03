"use strict";
const ARR = ["1","2","3","4","5","6","7","8","9"];
const msg = document.getElementById('msg');
const msg3 = document.getElementById('msg3');
const msg2 = document.getElementById('msg2');

const selector = document.getElementById('selector');
selector.addEventListener('click', selectorClicked);
selector.addEventListener('mouseover', selectorMouseOver);
selector.addEventListener('mouseout', selectorMouseOut);

const sudoku = document.getElementById('sudoku');
sudoku.addEventListener('click', sudokuClicked);

const sTable = [];

let table = generateSudoku();
createSudoku(table);
createSelector();


// for 81 cells we remember: ...
function setupMemory(){
    // creates memory table for generateSudoku algorithm
    let temp = {};
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            temp[i + "" + j] = [[], 0, [1,2,3,4,5,6,7,8,9]];
        }
    }
    return temp;
}

// checks if at table is valid sudoku
function isSudoku(table){
    // checks if a table is valid sudoku
    // check for rows
    for (let row of table){
        for (let i = 1; i < 10; i++){
            if (!(row.indexOf(i) >= 0)){
                return false;
            }
        }
    }

    // check for columns
    let temp = [];
    for (let j = 0; j < 9; j++){
        temp = [];
        for (let i = 0; i < 9; i++){
            temp.push(table[i][j]);
        }
        for (let i = 1; i < 10; i++){
            if (!(temp.indexOf(i) >= 0)){
                return false;
            }
        }
    }

    // check for 3x3 subtables
    for (let i = 0; i < 9; i += 3){
        for (let j = 0; j < 9; j += 3){
            temp = [];
            for (let k = 0; k < 3; k++){
                for (let l = 0; l < 3; l++){
                    temp.push(table[i+k][j+l]);
                }
            }
            for (let m = 1; m < 10; m++){
                if (!(temp.indexOf(m) >= 0)){
                    return false;
                }
            }
        }
    }
    return true;
}

// checks if value w can be inserted in table on position (i,j)
function isPossible(table, i, j, w){
    // checks if value w can be soundly inserted in table on position (i,j)
    // check for row
    // i, j, w MUST be integers
    let temp = [];
    for (let k = 0; k < 9; k++){
        temp.push(table[i][k]);
    }
    if (temp.indexOf(w) >= 0){
        return false;
    }

    // check for column
    temp = [];
    for (let k = 0; k < 9; k++){
        temp.push(table[k][j]);
    }
    if (temp.indexOf(w) >= 0){
        return false;
    }

    // check for 3x3 subtables
    let p = i - i%3;
    let q = j - j%3;
    temp = [];
    for (let k = 0; k < 3; k++){
        for (let l = 0; l < 3; l++){
            temp.push(table[p + k][q + l]);
        }
    }
    if (temp.indexOf(w) >= 0){
        return false;
    }
    return true;
}

function takeNext(i, j){
    if (j < 8){
        return [i, j+1];
    }
    if (i < 8){
        return [i+1, 0];
    }
    throw new RangeError("Stop");
}

function takePrev(i, j){
    if (j > 0){
        return [i, j-1];
    }
    if (i > 0){
        return [i-1, 8];
    }
    throw new RangeError("Stop");   // <- this will never happen
}


function choice(table){
    // randomly selects an elemet from 1-dim table
    let a = table.length;
    return table[Math.floor(a*Math.random())];
}

function randomSample(table, n){
    // randomly selects n elements from 1-dim table; n <= table.length
    // selection goes by randomly selecting indices of elements
    const range = (start, stop, step) => Array.from({ length: (stop - start) / step }, (_, i) => start + (i * step));
    let res = [];
    let a = range(0, table.length, 1);
    let i = 0;
    for (let j = 0; j < n; j++){
        i = Math.floor(a.length*Math.random());
        res.push(table[a[i]]);
        a.splice(a.indexOf(a[i]), 1);
    }
    return res;
}

// generates 9x9 valid sudoku
function generateSudoku(){
    // after filling this table is returned by our function
    // this is stupid - there must be a better way to generate this table
    let table =
    [[0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0]];

    // remember previous states
    let memory = setupMemory();
    let i = 0;
    let j = 0;
    let w = 0;
    let key = i + "" + j;

    // the loop will be broken by break
    while (true) {
        if (memory[key][2].length){
            w = choice(memory[key][2]);
            memory[key][2].splice(memory[key][2].indexOf(w), 1);

            if (isPossible(table, i, j, w)){
                memory[key][1] = w;
                table[i][j] = w;

                try {
                    [i, j] = takeNext(i, j);
                    key = i + "" + j;
                }
                catch (e) {
                    if (e instanceof RangeError) {
                        break;  // must be settled !
                    }
                }
            }
            else {
                memory[key][0].push(w);
                continue;
            }
        }
        else {
            memory[key][0] = [];
            memory[key][1] = 0;
            memory[key][2] = [1,2,3,4,5,6,7,8,9];
            table[i][j] = 0;
            [i, j] = takePrev(i, j);
            key = i + "" + j;
        }
    }
    return table;
}


// takes 9x9 sudoku passed as table and ...
function createSudoku(table, level){
    let arr = [[], [], [], [], [], [], [], [], []];


    for (let j = 0; j < 9; j++){
        let row = document.createElement('tr');
        //~ row.classList.add('sudokuRow');
        sudoku.appendChild(row);
        for (let i = 0; i < 9; i++){
            let el = document.createElement('td');
            el.id = j + "" + i;
            el.textContent = table[j][i];
            el.locked = false;
            el.value = parseInt(table[j][i]);
            // add el to corresponding list in arr
            arr[el.value-1].push(el);
            el.classList.add('sudokuCell');
            row.appendChild(el);
            sTable.push(el);
        }
    }

    // this is important - different methods of locking lead to
    // difficulties in solving

    let lockedCells;

    for (let a of arr){
        lockedCells = randomSample(a, 3); // 3 should be changed depending on difficulty level
        for (let l of lockedCells){
            l.locked = true;
            l.classList.replace('sudokuCell', 'sudokuCellLocked');
        }
    }

}

function createSelector(){
    for (let j=1; j < 10; j++){
        let item = document.createElement('div');
        item.classList.add('selectorItem');
        item.textContent = j;
        item.counter = 0;   // how many times item occured in the table so far
        selector.appendChild(item);
    }
}

function sudokuClicked(e){
    e.preventDefault();
    msg.textContent = e.target.id + ' '+ e.target.textContent;
}

function selectorClicked(e){
    e.preventDefault();
    if (ARR.includes(e.target.textContent)) {
        msg.textContent = e.target.textContent;
        return e.target.textContent;
    }
    return 0; // just to be on the safe side
}

function selectorMouseOver(e){
    e.preventDefault();
    if (ARR.includes(e.target.textContent)) {
        e.target.style.background = '#98F1FF';
    }
}

function selectorMouseOut(e){
    e.preventDefault();
    if (ARR.includes(e.target.textContent)) {
        e.target.style.background = 'silver';
    }
}

