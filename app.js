const form = document.getElementById('form');
let input = document.getElementById('input');
let todos = document.getElementById('todos');
let listItems = document.querySelectorAll('list-item');
let area = null;

form.addEventListener('submit',(e) => {
    e.preventDefault();
    let todoText = input.value;

    if(todoText) {
        let todoElem = document.createElement('li');
        todoElem.classList.add('list-item');
        todoElem.draggable = 'true';

        let elemToggle = document.createElement('div');
        elemToggle.innerText = '✔';
        elemToggle.classList.add('toggle');

        let elemText = document.createElement('span');
        elemText.innerText = todoText;
        elemText.classList.add('todoText');
        
        let elemClose = document.createElement('div');
        elemClose.innerText = '✖';
        elemClose.classList.add('close');

        todoElem.append(elemToggle);
        todoElem.append(elemText);
        todoElem.append(elemClose);
        todos.appendChild(todoElem); 
    }
    input.value = '';
});

todos.addEventListener('click', (e) => {

    let elemToggle = e.target.closest('.toggle');
    if(elemToggle) completeTodo(elemToggle);
    
    let elemClose = e.target.closest('.close');
    if(elemClose) closeTodo(elemClose); 
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
    elem.innerText = area.value;
    area.replaceWith(elem);
    if(area.value == '') closeTodo(elem);
}

function closeTodo(elem) {
    elem.parentNode.remove();
}