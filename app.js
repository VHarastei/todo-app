const form = document.getElementById('form');
let input = document.getElementById('input');
let todos = document.getElementById('todos');
let listItems = document.querySelectorAll('.list-item');
let area = null;
let listsNumber = 0;
let footer = document.createElement('div');
footer.className = 'footer';
let index = 0;

let itemsArray = localStorage.getItem('items') ?
JSON.parse(localStorage.getItem('items') ) : [];

localStorage.setItem('items', JSON.stringify(itemsArray) );
const data = JSON.parse(localStorage.getItem('items') );

form.addEventListener('submit',(e) => {
    e.preventDefault();
    let todoText = input.value;

    if(todoText) {
        itemsArray.push(todoText);
        localStorage.setItem('items', JSON.stringify(itemsArray));
        liMaker(todoText);
    }
    input.value = '';
});

data.forEach(item => {
    liMaker(item);
})

todos.addEventListener('click', (e) => {
    let footerText = footer.querySelector('.footer-text');
    let textForFooter = (listsNumber == 1) ? ' item': ' items';
    let elemToggle = e.target.closest('.toggle');
    if(elemToggle) {
        completeTodo(elemToggle);
    }
    
    let elemClose = e.target.closest('.close');
    if(elemClose) {
        localStorage.clear();
        let arrayIndex = elemClose.parentNode.getAttribute('index');
        console.log(arrayIndex);
        itemsArray.splice(arrayIndex, 1);
        localStorage.setItem('items', JSON.stringify(itemsArray));

        footerText.innerText = --listsNumber + textForFooter;
        closeTodo(elemClose);
    } 

    let elemCloseAll = e.target.closest('.footer-clear');
    if(elemCloseAll) {
        let listItems = document.querySelectorAll('.list-item');
        localStorage.clear();
        listItems.forEach(item => {
            item.remove();
        })
    }

    listItems = document.querySelectorAll('.list-item');
    if(listItems.length == 0) {
        footer.lastChild.remove();
        footer.remove();
    }
});

todos.addEventListener('dblclick', (e) => {
    let target = e.target.closest('span');
    if(!target) return;

    editStart(target);
 });

 todos.addEventListener('dragstart', (e) => {
    e.target.classList.add('selected');
 });

 todos.addEventListener('dragend', (e) => {
    e.target.classList.remove('selected');
 });

 todos.addEventListener('dragover' , (e) => {
    e.preventDefault();

    let activeElement = todos.querySelector('.selected');
    let currentElement = e.target;
    let isMovable = activeElement !== currentElement &&
    currentElement.classList.contains('list-item');
    if(!isMovable) return;

    const nextElement = (currentElement === activeElement.nextElementSibling) ?
		currentElement.nextElementSibling :
		currentElement;

    todos.insertBefore(activeElement, nextElement);
 });

function liMaker(text) {

    let todoElem = document.createElement('li');
    todoElem.classList.add('list-item');
    todoElem.draggable = 'true';
    todoElem.setAttribute('index', index);
    index++;

    let elemToggle = document.createElement('div');
    elemToggle.innerText = '✔';
    elemToggle.classList.add('toggle');

    let elemText = document.createElement('span');
    elemText.innerText = text;
    elemText.classList.add('todoText');
        
    let elemClose = document.createElement('div');
    elemClose.innerText = '✖';
    elemClose.classList.add('close');

    todoElem.append(elemToggle);
    todoElem.append(elemText);
    todoElem.append(elemClose);
    todos.prepend(todoElem); 

    footerMaker();
}

function footerMaker() {
    let footerText = document.createElement('span');
    footerText.classList.add('footer-text');
    let footerClear = document.createElement('span');
    footerClear.classList.add('footer-clear');
    footerClear.innerText = 'clear all';

    if(todos.lastChild.className != 'footer') {
        footer.append(footerText);
        footer.append(footerClear);
         
        todos.append(footer);
    }
        
    let footerTextForm = footer.querySelector('.footer-text');
    listsNumber = todos.querySelectorAll('.list-item').length;

    let textForFooter = (listsNumber == 1) ? ' item': ' items';
    footerTextForm.innerText = listsNumber + textForFooter; 
}

function completeTodo(elem) {
    if(!elem ||!elem.classList.contains('toggle') ) return;

    if(elem.classList.contains('after') ) {
        elem.classList.remove('after');
        elem.nextSibling.classList.remove('completed');
    }
    else {
    elem.classList.add('after');
    elem.nextSibling.classList.add('completed');
    }
}

function closeTodo(elem) {
    elem.parentNode.remove();
}

function editStart(elem) {
    area = document.createElement('textarea');
    area.className = 'edit';
    area.value = elem.innerText;

    area.onkeydown = function(e) {
        if(e.key =='Enter') this.blur();
    };
    
    area.onblur = function() {
        editEnd(elem);
    };
    elem.replaceWith(area);
    area.focus();
}

function editEnd(elem) {
    let footerText = footer.querySelector('.footer-text');
    elem.innerText = area.value;
    area.replaceWith(elem);

    let arrayIndex = elem.parentNode.getAttribute('index');
    itemsArray.splice(arrayIndex, 1, area.value);

    if(area.value == '') {
        itemsArray.splice(arrayIndex, 1);
        closeTodo(elem);
        footerText.innerText = --listsNumber + ' items';
    }
    
    localStorage.setItem('items', JSON.stringify(itemsArray));

    listItems = document.querySelectorAll('.list-item');
    if(listItems.length == 0) {
        footer.lastChild.remove();
        footer.remove();
    }
}