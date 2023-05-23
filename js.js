let body = document.querySelector('body');
let toDoBlock = document.querySelector('#currentTasks');
let completedBlock = document.querySelector('#completedTasks');
let form = document.querySelector('#form');
let sortBtns = document.querySelector("#sortBtns");
let addBtn = document.querySelector('#addBtn');
let themeBtns = document.querySelector('#themeBtns');
let mainBlock = document.querySelector('#mainBlock');

let sortDirection;

let isEdit;
let editObj;

let taskObjList = [];
let theme;

init();
taskNumCounter();

// ========================================================
addBtn.addEventListener('click', () => {

  isEdit = false;

  formReset();
  changeInscriptionsInModalTo('Add');
})

form.addEventListener('submit', (e) => {
  e.preventDefault(); 

  let formData = new FormData(form);

  if (isEdit === true) {

    setDataFromForm(editObj, formData);
  } else {

    let taskObj = {
      "isCompleted": false,
      "time": new Date().getTime(),
    }

    setDataFromForm(taskObj, formData);
    taskObjList.push(taskObj);
  }

  printSection('current');
  saveStorageElements();
  taskNumCounter();
  $('#exampleModal').modal('hide');
})

sortBtns.addEventListener('click', (e) => {

  let targetBtn = e.target.closest('button');

  if (!targetBtn) return;
  targetBtn.classList.contains('up') ? taskSorter('up') : taskSorter('down');
})

themeBtns.addEventListener('click', (e) => {

  let targetBtn = e.target.closest('button');

  if (!targetBtn) return;
  if (targetBtn.classList.contains('btn-light') && theme !== 'light') setTheme('light');
  if (targetBtn.classList.contains('btn-dark') && theme !== 'dark') setTheme('dark');
})

mainBlock.addEventListener('click', (e) => {
  let target = e.target;
  let task = target.closest(".task");

  let targetObj = taskObjList.find(obj => obj.time === +task.getAttribute('data-time'));

  if (target.classList.contains('complete')) {
    taskCompleter(task, targetObj);
  } else if (target.classList.contains('edit')) {
    taskEditor(targetObj);
  } else if (target.classList.contains('delete')) {
    taskDeleter(task, targetObj);
  }
})

// ========================================================
function init() {
  taskObjList = localStorage.getItem('pageStorage') ? JSON.parse(localStorage.getItem('pageStorage')) : [];
  theme = localStorage.getItem('theme') || 'light';
  if (theme === 'dark') setTheme('dark');

  printAllSections();
}

function setTheme(clickedTheme) {

  theme = clickedTheme;

  body.style.setProperty('--main-bc', `var(--main-bc-${theme})`);
  body.style.setProperty('--main-color', `var(--main-color-${theme})`);
  body.style.setProperty('--menu-bc', `var(--menu-bc-${theme})`);
  body.style.setProperty('--secondary-bc', `var(--secondary-bc-${theme})`);
  body.style.setProperty('--modal-bc', `var(--modal-bc-${theme})`);
  body.style.setProperty('--modal-x', `var(--modal-x-${theme})`);
  body.style.setProperty('--modal-field', `var(--modal-field-${theme})`);

  body.style.setProperty('--bc-red', `var(--bc-red-${theme})`);
  body.style.setProperty('--bc-orange', `var(--bc-orange-${theme})`);
  body.style.setProperty('--bc-green', `var(--bc-green-${theme})`);
  body.style.setProperty('--bc-turquoise', `var(--bc-turquoise-${theme})`);
  body.style.setProperty('--bc-blue', `var(--bc-blue-${theme})`);
  body.style.setProperty('--bc-transparent', `var(--bc-transparent-${theme})`);
  body.style.setProperty('--transparent', `var(--transparent-${theme})`);

  saveThemeColor();
}

function printAllSections() {

  if (!taskObjList.length) return;

  printSection('current');
  printSection('completed');
}

function printSection(section) {

  let isDone = section === 'current' ? false : true;
  let taskBlock = section === 'current' ? toDoBlock : completedBlock;

  taskBlock.innerHTML = taskObjList.filter(task => task.isCompleted === isDone).map(task => `
    <li class="task list-group-item d-flex w-100 mb-2 ${task.color}" data-time="${task.time}" data-color="${task.color}">
      <div class="w-100 mr-2">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="title mb-1">${task.title}</h5>
          <div>
            <small class="priority mr-2">${task.priority} priority</small>
            <small class="time">${dateString(task.time)}</small>
          </div>
        </div>
        <p class="text mb-1 w-100">${task.text}</p>
      </div>
      <div class="dropdown m-2 dropleft">
        <button class="btn btn-secondary h-100" type="button" id="dropdownMenuItem1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fas fa-ellipsis-v"></i>
        </button>
        <div class="dropdown-menu p-2 flex-column btn-block" aria-labelledby="dropdownMenuItem1">
          ${task['isCompleted'] === false ? `<button type="button" class="btn btn-success w-100 complete">Complete</button>\n
          <button type="button" class="btn btn-info w-100 my-2 edit" data-toggle="modal" data-target="#exampleModal">Edit</button>\n` 
          : ''} 
          <button type="button" class="btn btn-danger w-100 delete">Delete</button>
        </div>
      </div>  
    </li>`).join('');
}

function dateString(date) {
  return new Date(date).toLocaleTimeString().slice(0,-3) + " " + new Date(date).toLocaleDateString()
}

// ========================================================
function taskNumCounter() {

  if (taskObjList === undefined) return;

  let toDoTasksAmount = taskObjList.filter(task => task.isCompleted === false).length;
  let toDoTitleCounter = document.querySelector('#toDoTitleCounter');

  toDoTitleCounter.textContent = `(${toDoTasksAmount})`;

  let compTasksAmount = taskObjList.length - toDoTasksAmount;
  let completedTitleCounter = document.querySelector('#completedTitleCounter');

  completedTitleCounter.textContent = `(${compTasksAmount})`;
}

// ========================================================
function formReset() {

  form.reset();

  let formText = form.querySelectorAll('.form-control');
  formText.forEach(elem => elem.removeAttribute('value'));

  let formBtns = form.querySelectorAll('.switch');
  formBtns.forEach(btn => btn.removeAttribute('checked'));
}

function changeInscriptionsInModalTo(value) {

  let modalTitle = document.querySelector('#exampleModalLabel');
  modalTitle.textContent = value + ' task';

  let modalButton = document.querySelector('#submit');
  modalButton.textContent = value + ' task';

}

function setDataFromForm(obj, formData) {
  obj.title = formData.get('inputTitle');
  obj.text = formData.get('inputText');
  obj.color = isEdit ? formData.get('colors') : formData.get('colors') || "transparent";
  obj.priority = formData.get('priority');
}

function saveStorageElements() {
  localStorage.setItem('pageStorage', JSON.stringify(taskObjList));
}

function saveThemeColor() {
  localStorage.setItem('theme', theme);
}

// ========================================================
function taskSorter(direction) {

  taskObjList.sort((a, b) => direction === 'up' ? new Date(b.time) - new Date(a.time) : new Date(a.time) - new Date(b.time));

  printAllSections();
  saveStorageElements();
}

function taskCompleter(task, targetObj) {

  targetObj.isCompleted = true;
  completedBlock.append(task);

  taskSorter(sortDirection);

  saveStorageElements();
  taskNumCounter();
}

function taskEditor(targetObj) {

  editObj = targetObj;

  formReset();
  
  form.querySelector('#inputTitle').setAttribute('value', targetObj.title);
  form.querySelector('#inputText').setAttribute('value', targetObj.text);

  form.querySelector(`#${targetObj.color}`).setAttribute('checked','');
  form.querySelector(`#${targetObj.priority}`).setAttribute('checked','');

  isEdit = true;

  changeInscriptionsInModalTo('Edit');
}

function taskDeleter(task, targetObj) {

  taskObjList = taskObjList.filter(obj => obj !== targetObj);
  task.remove();
  
  saveStorageElements();
  taskNumCounter();
}