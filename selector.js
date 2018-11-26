"use strict";
const ARR = ["1","2","3","4","5","6","7","8","9"];
const msg = document.getElementById('msg');

const selector = document.getElementById('selector');
selector.addEventListener('click', selectorClicked);
selector.addEventListener('mouseover', selectorMouseOver);
selector.addEventListener('mouseout', selectorMouseOut);


for (let j=1; j < 10; j++){
    let item = document.createElement('div');
    item.classList.add('selectorItem');
    item.innerHTML = j;
    item.counter = 0;   // how many times item occured in the table so far
    selector.appendChild(item);
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
