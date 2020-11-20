const form = document.getElementById('form');
let input = document.getElementById('input');
let todos = document.getElementById('todos');
let area = null;

form.addEventListener('submit',(e) => {
    e.preventDefault();
    let todoText = input.value;

    if(todoText) {
        let todoElem = document.createElement('li');

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