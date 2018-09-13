const bgBlue = "rgb(111, 243, 252)";
const bgYellow = "rgb(252, 219, 111)";
const bgIntenseBlue = "rgb(0, 106, 206)";
const bgWhite = "rgb(255, 255, 255)";

var sudoku = document.getElementById("sudoku");
var msg = document.getElementById("msg");
var msg2 = document.getElementById("msg2");
var msg3 = document.getElementById("msg3");

 // row for selecting numbers to insert
var selector = document.getElementById("selector");
var selectorRow = document.createElement("tr");
selector.appendChild(selectorRow);
// array for easier manipulation of selector cells
var selectorCells = [];

// 81 sudoku cells array for easier manipulation
var sudokuCells = [];
// currently selected number from selector
var currentSelected = 0;

// selectorRow
for (let i = 1; i < 10; i++) {
  let s = document.createElement("td");
  selectorCells.push(s);
  s.id = i;
  s.innerHTML = i;
  s.clicked = false; // unnecessary
  s.addEventListener("click", selectNumber);
  s.addEventListener("mouseover", function(){this.style.backgroundColor = bgBlue;})
  s.addEventListener("mouseout", function(){this.innerHTML == currentSelected ? this.style.backgroundColor = bgBlue : this.style.backgroundColor = bgWhite;})
  selectorRow.appendChild(s);
}
// end selectorRow

// sudoku
for (let j = 1; j < 10; j++){
  row = document.createElement("tr");
  sudoku.appendChild(row);
  let k = 1 + Math.floor(9*Math.random());
  for (let i = 1; i < 10; i++) {
    cell = document.createElement("td");
    cell.addEventListener("click", enterNumber);
    cell.id = "" + j + i;   // this is a string; eg. 37
    // this is for testing - in general locked cells are chosen randomly
    if (i == k) {
      cell.locked = true;
      cell.style.backgroundColor = bgYellow;
      cell.innerHTML = "" + j;
    } // --------
    row.appendChild(cell);
    sudokuCells.push(cell);
  }
}

// select number from selector
function selectNumber(){
    currentSelected = this.innerHTML;
    // update colors for selector
    for (let a of selectorCells) {
        a.style.backgroundColor = bgWhite;
    }
    this.style.backgroundColor = bgBlue;
    // update colors for sudoku 
    for (let c of sudokuCells) {
      if (c.innerHTML == currentSelected) {
        if (c.locked) {
          c.style.backgroundColor = bgIntenseBlue;
        }
        else {
          c.style.backgroundColor = bgBlue;
        }
      }
      else {
        if (c.locked) {
          c.style.backgroundColor = bgYellow;
        }
        else {
          c.style.backgroundColor = bgWhite;
        }
      }
        msg.innerHTML = currentSelected;
    };
}

function enterNumber(){
  if (! isPossible(this, currentSelected)){
    return
  }

  if ((this.style.backgroundColor != bgYellow) && (currentSelected != "0")) {
    this.innerHTML = currentSelected;
    this.style.backgroundColor = bgBlue;
  }
  msg.innerHTML = this.id;
}

function isPossible(obj, aNumber){
  // in fact obj is an element of sudoku array
  // checks if aNumber can be placed at position (i,j) without damaging validity
  let i = parseInt(obj.id[0]);
  let j = parseInt(obj.id[1]);

  msg.innerHTML = sudokuCells[(i-1)*9 + (j-1)].innerHTML + " X " + aNumber;
  // check for verse
  for (let k = 0; k < 9; k++) {
    if (sudokuCells[9*(i-1) + k].innerHTML == aNumber){
      return false
    }
  }
  // check for column
  for (let k = 0; k < 9; k++) {
    if (sudokuCells[9*k + j-1].innerHTML == aNumber){
      return false
    }
  }
  // check for 3x3 cell
  let center = getCenter(i, j);
  let temp = [sudokuCells[center], sudokuCells[center-1], sudokuCells[center+1],
           sudokuCells[center-9], sudokuCells[center-10], sudokuCells[center-8],
           sudokuCells[center+9], sudokuCells[center+10], sudokuCells[center+8]];
  for (let c of temp){
    if (c.innerHTML == aNumber){
      return false
    }
  }
  return true
}

function getCenter(x,y){
  let res = 40;
  // central column of 3x3 grid
  if (x < 4){
    res -= 27;
  }
  else if (x > 6){
    res += 27;
  }
  else { };
  
  if (y < 4){
    res -= 3;
  }
  else if (y > 6) {
    res += 3
  }
  else {};
  return res;
}

function generateSudoku(){
  let sudoku = [];
  let j = 0;
  do {
    sudoku.push(0);
    j++;
  } while (j < 81);
  

  
}

function selectRandomNumber(){
  return 1 + Math.floor(9*Math.random());
}