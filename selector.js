"use strict";
const ARR = ["1","2","3","4","5","6","7","8","9"];


// for debugging
const msg = document.getElementById('msg');
const msg2 = document.getElementById('msg2');
const msg3 = document.getElementById('msg3');
const div =  document.getElementById('div');
const sudoku_dumper = document.getElementById('sudoku_dumper');
sudoku_dumper.addEventListener('click', dumpSudokuTable);
// ------------

// select number to insert into sudoku
const selector = document.getElementById('selector');
selector.addEventListener('click', selectorClicked);
selector.addEventListener('mouseover', selectorMouseOver);
selector.addEventListener('mouseout', selectorMouseOut);

// 0 index is a dummy and will not be unused. 9 following entries will be used for
// storing objects of the form { counter: 0, cell: dom_element }
// all entries will by pushed by createSelector()
const selector_table = [0];
let currentNumber = 0; // modified by selectorClicked
createSelector();


const sudoku = document.getElementById('sudoku');
sudoku.addEventListener('click', sudokuClicked);

const sTable = [];

const dump = document.getElementById('dump');
const dump_counters = document.getElementById('dump_counters');

let helperOn = false;
const helper = document.getElementById('helper');
createHelper();

let cleanerOn = false;
const cleaner = document.getElementById('cleaner');
cleaner.addEventListener('click', cleanerClicked);

let sudoku_table = generateSudoku();
createSudoku();



// for 81 cells we remember: ...
function setupMemory(){
    // creates memory table for generateSudoku algorithm
    let temp = {};
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            temp[i + '' + j] = [[], 0, [1,2,3,4,5,6,7,8,9]];
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


// uses 9x9 sudoku_table generated by generateSudoku, builds html-table
// and partially zeroes sudoku_table - using locked elements
// also: modifies selector_table.counters taking into account locked cells

function createSudoku(level){
    let arr = [[], [], [], [], [], [], [], [], []];


    for (let i = 0; i < 9; i++){
        let row = document.createElement('tr');
        sudoku.appendChild(row);
        for (let j = 0; j < 9; j++){
            let el = document.createElement('td');
            el.id = i + "" + j;
            el.textContent = ''; // sudoku_table[i][j];
            el.locked = false;
            el.hasChildren = false;
            el.value = parseInt(sudoku_table[i][j]);
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
        lockedCells = randomSample(a, 4); // 4 should be changed depending on difficulty level
        for (let l of lockedCells){
            l.locked = true;
            selector_table[l.value].counter += 1;
            l.textContent = l.value;
            l.classList.replace('sudokuCell', 'sudokuCellLocked');
        }
    }

    let i, j;
    for (let s of sTable){
        i = parseInt(s.id[0]);
        j = parseInt(s.id[1]);
        if (! s.locked) {
            sudoku_table[i][j] = 0;
        }
    }
}


function createSelector(){
    let row = document.createElement('tr');
    selector.appendChild(row);
    for (let j=1; j < 10; j++){
        let item = document.createElement('td');
        item.classList.add('selectorCell');
        item.textContent = j;
        row.appendChild(item);
        selector_table.push({counter: 0, cell: item});
    }
}


function sudokuClicked(e){
    e.preventDefault();

    if (e.target.locked){
        return  // no operation on locked cell allowed
    }

    let id = e.target.id;
    let i, j;


    if (cleanerOn) {
        if (id != ''){      // e.target is a cell
            i = parseInt(id[0]), j = parseInt(id[1]);
            let x = parseInt(e.target.textContent);
            selector_table[x].counter -= 1;     // should never be < 0; maybe
            if (selector_table[x].counter == 8) {
                selectorEnableItem(x);
            }

            e.target.textContent = '';
            e.target.classList.remove('sudokuCellHighlight');
            sudoku_table[i][j] = 0;

            dumpCounters();

        }
        else {  // innherHelper table in the cell
            let iid = e.target.getAttribute('parent_id');
            let el = document.getElementById(iid);
            el.innerHTML = '';
            el.hasChildren = false;
        }

        return // work done
    }



    if (!currentNumber){
        return  // nothing to insert or clean
    }

    // FROM NOW ON: currentNumber =/= 0


    if (helperOn){
        // id === '' means that e.target = innerHelper table and we should display
        // currentNumber in an innerHelper cell

        if (id === '') {
            let iid = e.target.getAttribute('parent_id');
            let el = document.getElementById(iid);
            el.hasChildren = true;
            let x = el.querySelector(`[a${currentNumber}]`);
            x.textContent = currentNumber;

            return
        }

        // now id =/= ''  i.e.  id = xy

        i = parseInt(id[0]), j = parseInt(id[1]);

        if (sudoku_table[i][j]) {
            return  // cell not empty
        }

        let f = displayInnerHelper(e.target.id, currentNumber);
        e.target.appendChild(f);
        e.target.hasChildren = true;

    }   // <------ end of helperOn = true

    else {  // helperOn = false

        if (id === '') {
            let iid = e.target.getAttribute('parent_id');
            let el = document.getElementById(iid);
            i = parseInt(iid[0]), j = parseInt(iid[1]);
            if (isPossible(sudoku_table, i, j, currentNumber) && (sudoku_table[i][j] == 0)){
                el.innerHTML = '';      // in particular, all children of el are annihilated
                el.hasChildren = false;
                selector_table[currentNumber].counter += 1;
                el.classList.add('sudokuCellHighlight');
                el.textContent = currentNumber;
                sudoku_table[i][j] = currentNumber;
                if (selector_table[currentNumber].counter == 9){
                    selectorDisableItem(currentNumber);
                }
            }
        }
        else { // e.target is a cell

            i = parseInt(id[0]), j = parseInt(id[1]);
            if (isPossible(sudoku_table, i, j, currentNumber) && (sudoku_table[i][j] == 0)){
                selector_table[currentNumber].counter += 1;
                e.target.classList.add('sudokuCellHighlight');
                e.target.textContent = currentNumber;
                sudoku_table[i][j] = currentNumber;
                if (selector_table[currentNumber].counter == 9){
                    selectorDisableItem(currentNumber);
                }
            }
        }
        dumpCounters();
    }
}


function selectorClicked(e){
    e.preventDefault();

    //~ helperOn = false;
    //~ helper.setAttribute('on', helperOn);
    cleanerOn = false;
    cleaner.setAttribute('on', cleanerOn);

    if (ARR.includes(e.target.textContent)) {
        currentNumber = parseInt(e.target.textContent);
        highlightAll(currentNumber);
        for (let i = 1; i < 10; i++){
            selector_table[i].cell.classList.remove('selectorCellHighlight');;
        }
        e.target.classList.add('selectorCellHighlight');
    }
}


function selectorMouseOver(e){
    e.preventDefault();
    if (ARR.includes(e.target.textContent)) {
        if (e.target.classList.contains('selectorCellHighlight')){
            return
        }
        e.target.classList.add('selectorCellHighlight');
    }
}


function selectorMouseOut(e){
    e.preventDefault();
    if (ARR.includes(e.target.textContent)) {
        if (e.target.textContent == currentNumber){
            return
        }
        e.target.classList.remove('selectorCellHighlight');
    }
}


function selectorOff(){
    for (let i = 1; i < 10; i++){
        selector_table[i].cell.classList.remove('selectorCellHighlight');
    }
}



function selectorDisableItem(x){
    selector_table[x].cell.classList.add('selectorCellDisabled');
}


function selectorEnableItem(x){
    selector_table[x].cell.classList.remove('selectorCellDisabled');
}


function highlightAll(x){
    for (let s of sTable){
        s.classList.remove('sudokuCellHighlight');
        if ((!s.hasChildren) && (s.textContent == x)){    // alas, s.textContent == x does not work
            s.classList.add('sudokuCellHighlight');
        }
    }
}


function switchOffAll(){
    for (let s of sTable){
        s.classList.remove('sudokuCellHighlight');
    }
}


function createHelper(){
    const t = document.createElement('table');
    for (let i = 0; i < 3; i++){
        let row = document.createElement('tr');
        for (let j = 0; j < 3; j++){
            let td = document.createElement('td');
            td.textContent = i*3 + (j+1);
            row.appendChild(td);
        }
        t.appendChild(row);
    }
    helper.appendChild(t);
    helper.addEventListener('click', helperClicked);
}


function displayInnerHelper(id, x){
    const t = document.createElement('table');
    t.setAttribute('parent_id', id);    // remember id in parent_id attribute
    for (let i = 0; i < 3; i++){
        let row = document.createElement('tr');
        row.setAttribute('parent_id', id);      // remember id in parent_id attribute
        for (let j = 0; j < 3; j++){
            let td = document.createElement('td');
            //~ td.textContent = i*3 + (j+1);
            td.setAttribute('parent_id', id);   // remember id in parent_id attribute
            td.setAttribute(`a${i*3 + (j+1)}`, '');
            td.textContent = (x == i*3 + (j+1)? x : ' ');
            row.appendChild(td);
        }
        t.appendChild(row);
    }
    t.classList.add('innerHelper');
    return t
}


function helperClicked(){
    helperOn = !helperOn;
    helper.setAttribute('on', helperOn);
    if (helperOn) {
        cleanerOn = false;
        cleaner.setAttribute('on', false);
    }
}


function cleanerClicked(){
    cleanerOn = !cleanerOn;
    cleaner.setAttribute('on', cleanerOn);
    if (cleanerOn) {
        helperOn = false;
        helper.setAttribute('on', false);

        switchOffAll();
        currentNumber = 0;  // switch off selector and sudoku
        selectorOff();
    }
}


// ---------- FOR DEBUGGING -----------

function dumpSudokuTable(){
    dump.innerHTML = '';
    for (let i = 0; i < 9; i++){
        let row = document.createElement('tr');
        for (let j = 0; j < 9; j++){
            let td = document.createElement('td');
            td.textContent = sudoku_table[i][j]
            row.appendChild(td);
        }
        dump.appendChild(row);
    }
}


function dumpCounters(){
    dump_counters.innerHTML = '';
    let r = document.createElement('tr');
    for (let i=1; i<10; i++){
        let td = document.createElement('td');
        td.textContent = selector_table[i].counter;
        r.appendChild(td);
    }
    dump_counters.appendChild(r);
}
