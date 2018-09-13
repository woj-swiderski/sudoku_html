"use strict";

const bgSelected = "rgb(111, 243, 252)";
const bgLocked = "rgb(252, 219, 111)";
const bgLockedSelected = "rgb(0, 106, 206)";
const bgBackground = "rgb(255, 255, 255)";
const bgBorder = "rgb(0, 0, 0)";
const bgGrayed = "rgb(224, 224, 224)";

let currentLevel = 2;
// modified by selectorClick
let currentClicked = 0;
// will be filled later
let sudokuTable = document.getElementById("sudoku");

let msg = document.getElementById("msg");
let msg2 = document.getElementById("msg2");
let msg3 = document.getElementById("msg3");

let selectorTable = document.getElementById("selector");
// generateSelector returns array to ease manipulation of selectorTable elements
let selector = generateSelector();

// create sudoku table by backtracking algorithm implemented in generateSudoku()
let sudoku = generateSudoku();
// sudokuBase should ease manipulation of sudokuTable elements
let sudokuBase = [];

// filling up sudokuTable and clearing non-locked sudoku cells for further reusing by
// sudokuClick
// for (let i = 0; i < 9; i++){
//     let r = document.createElement("tr");
//     sudokuTable.appendChild(r);
//     for (let j = 0; j < 9; j++){
//         let c = document.createElement("td");
//         c.id = i + "" + j;
//         // false if cell is modifiable, true otherwise
//         c.locked = Math.random() < 0.6-currentLevel/18 ? true : false;
//         c.value = sudoku[i][j];
//         // now sudoku is modified for reuse by eventHandlers
//         sudoku[i][j] = c.locked ? sudoku[i][j] : 0;
//         c.addEventListener("click", sudokuClick);
//         c.innerHTML = c.locked ? String(sudoku[i][j]) : "";
//         if (c.locked) {
//             c.style.backgroundColor = bgLocked;
//         }
//         r.appendChild(c);
//         sudokuBase.push(c);
//     }
// }

for (let i = 0; i < 9; i++){
    let r = document.createElement("tr");
    sudokuTable.appendChild(r);
    for (let j = 0; j < 9; j++){
        let c = document.createElement("td");
        c.id = i + "" + j;
        // false if cell is modifiable, true otherwise
        c.locked = Math.random() < 0.6-currentLevel/18 ? true : false;
        c.value = sudoku[i][j];
        // now sudoku is modified for reuse by eventHandlers
        sudoku[i][j] = c.locked ? sudoku[i][j] : 0;
        c.addEventListener("click", sudokuClick);
        c.innerHTML = c.locked ? String(sudoku[i][j]) : "";
        if (c.locked) {
            c.style.backgroundColor = bgLocked;
            selector[c.value - 1].counter++;
        }
        r.appendChild(c);
        sudokuBase.push(c);
    }
}


// =======================================

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

function isPossible(table, i, j, w){
    // checks if value w can be soundly inserted in table on position (i,j) 
    // check for row
    var temp = [];
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
    // randomly selects an elemet from the table
    let a = table.length;
    return table[Math.floor(a*Math.random())];
}

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

function generateSelector(){
    let temp = [];
    let row = document.createElement("tr");
    selectorTable.appendChild(row);
    for (let j = 1; j < 10; j++){
        let cell = document.createElement("td");
        cell.id = String(j);
        cell.value = j;
        cell.innerHTML = String(j);
        cell.clicked = false;
        cell.counter = 0;   // if counter == 9 gray the cell
        cell.addEventListener("click", selectorClick);
        cell.addEventListener("mouseover", selectorMouseEnter);
        cell.addEventListener("mouseout", selectorMouseOut);
        row.appendChild(cell);
        temp.push(cell);
    }
    return temp;
}

function selectorClick(){
    if (this.counter == 9) { 
        return
    }
    currentClicked = parseInt(this.innerHTML);
    for (let c of selector){
        if (c.clicked){
            c.style.backgroundColor = bgBackground;
            c.clicked = false;
        }
    }
    this.clicked = true;
    this.style.backgroundColor = bgSelected;

    for (let c of sudokuBase){
        if (c.innerHTML === this.innerHTML){
            if (c.locked){
                c.style.backgroundColor = bgLockedSelected;
            }
            else {
                c.style.backgroundColor = bgSelected;
            }
        }
        else {
            if (c.locked){
                c.style.backgroundColor = bgLocked;
            }
            else {
                c.style.backgroundColor = bgBackground;
            }
        }
    }
}

function selectorMouseEnter(){
    if (this.counter == 9) {
        return
    }
    this.style.backgroundColor = bgSelected;
}

function selectorMouseOut(){
    if (! this.clicked) {


        this.style.backgroundColor = bgBackground;
    }
}

function sudokuClick(){
    if (this.locked) {
        return
    }
    else if (isPossible(sudoku, parseInt(this.id[0]), parseInt(this.id[1]), currentClicked)){
        this.innerHTML = String(currentClicked);
        sudoku[parseInt(this.id[0])][parseInt(this.id[1])] = parseInt(this.innerHTML);
        this.style.backgroundColor = bgSelected;
        selector[currentClicked - 1].counter++;
        msg.innerHTML = selector[currentClicked - 1].counter;
        if (selector[currentClicked - 1].counter == 9){

            selector[currentClicked - 1].style.color = bgGrayed;
            selector[currentClicked - 1].style.borderColor = bgBorder;
            selector[currentClicked - 1].style.backgroundColor = bgBackground;
        }
    }
    else {
        return
    }
}

function lockCells(table){
    // table: sudokuBase - locks cells by selecting them from 3x3 subtables 
    for (let i of [10, 13, 16, 37, 40, 43, 64, 67, 70]){
        let temp = [];
        for (let j of [-10, -9, -8, -1, 0, 1, 8, 9, 10]){
            temp.push(i + j);
        }
        temp = temp.sort(function(x,y){return 0.5 - Math.random()});
        for (let t of temp.slice(0,3)){
            table[t].locked = true;
        }
    }

}