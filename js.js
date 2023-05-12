let body = document.querySelector('body');
let navbar = document.querySelector('.navbar');
let toDoBlock = document.querySelector('#currentTasks');
let completedBlock = document.querySelector('#completedTasks');
let form = document.querySelector('#form');
let sortBtns = document.querySelector("#sortBtns");
let addBtn = document.querySelector('#addBtn');
let themeBtns = document.querySelector('#themeBtns');

let sortDirection;

let taskObjList = localStorage.getItem('pageStorage') ? JSON.parse(localStorage.getItem('pageStorage')) : [];

let isEdit;
let editObj;
let editTask;
let editTaskColor;

let theme = localStorage.getItem('theme') || 'light';

if (theme === 'dark') setTheme('dark');

printAllElements(taskObjList);
addTaskBtnListener();
taskNumCounter();

// ========================================================

form.addEventListener('submit', (e) => {
  e.preventDefault(); 

  let formData = new FormData(form);
  let date = new Date();

  // ответвление для редактирования таска =================
  if (isEdit === true) {

    editObj.title = formData.get('inputTitle');
    editObj.text = formData.get('inputText');
    editObj.color = formData.get('colors');
    editObj.priority = formData.get('priority');

    printElement(editObj);
    toDoBlock.replaceChild(toDoBlock.lastChild, editTask);

  } else {

    // создания нового таска ================================
    let taskObj = {
      "isCompleted": false,
      "title": formData.get('inputTitle'),
      "text": formData.get('inputText'),
      "color": formData.get('colors') || "transparent",
      "priority": formData.get('priority'),
      "time": date,
    }

    printElement(taskObj);
    taskObjList.push(taskObj);
  }

  saveStorageElements();
  taskNumCounter();
  $('#exampleModal').modal('hide');
});

// ========================================================

sortBtns.addEventListener('click', (e) => {

  let targetBtn = e.target.closest('button');

  if (!targetBtn) return;

  targetBtn.classList.contains('up-button') ? taskSorter('up') : taskSorter('down');
})

addBtn.addEventListener('click', () => {

    isEdit = false;

    formReset();
    changeInscriptionsInModalTo('Add');
})

themeBtns.addEventListener('click', (e) => {

  let targetBtn = e.target.closest('button');

  if (!targetBtn) return;

  if (targetBtn.classList.contains('btn-light') && theme !== 'light') setTheme('light');
  if (targetBtn.classList.contains('btn-dark') && theme !== 'dark') setTheme('dark');
})

//=========================================================

function setTheme(clickedTheme) {

  theme = clickedTheme;
  
  if (theme === 'light') {
    body.style.setProperty('--main-bc', '#fff');
    body.style.setProperty('--main-color', 'black');
    body.style.setProperty('--secondary-bc', '#f8f9fa');
    body.style.setProperty('--modal-bc', '#fff');
    body.style.setProperty('--modal-field', '#fff');

    body.style.setProperty('--bc-red', 'rgb(255, 200, 200)');
    body.style.setProperty('--bc-orange', 'rgb(255, 225, 150)');
    body.style.setProperty('--bc-green', 'rgb(220, 255, 200)');
    body.style.setProperty('--bc-turquoise', 'rgb(210, 255, 240)');
    body.style.setProperty('--bc-blue', 'rgb(190, 230, 255)');
    body.style.setProperty('--transparent', 'rgba(0,0,0,.125)');
    body.style.setProperty('--bc-transparent', 'rgb(255, 255, 255)');
  } else {
    body.style.setProperty('--main-bc', '#111111');
    body.style.setProperty('--main-color', '#e5e5e5');
    body.style.setProperty('--secondary-bc', 'rgb(53, 53, 53)');
    body.style.setProperty('--modal-bc', 'rgb(53, 53, 53)');
    body.style.setProperty('--modal-field', '#6c757d');

    body.style.setProperty('--bc-red', 'rgb(100, 50, 50)');
    body.style.setProperty('--bc-orange', 'rgb(100, 70, 50)');
    body.style.setProperty('--bc-green', 'rgb(50, 80, 50)');
    body.style.setProperty('--bc-turquoise', 'rgb(50, 80, 75)');
    body.style.setProperty('--bc-blue', 'rgb(35, 50, 100)');
    body.style.setProperty('--transparent', '#6c757d');
    body.style.setProperty('--bc-transparent', 'rgb(53, 53, 53)');
  } 

  
  // oppositeTheme = (theme === 'light') ? 'dark' : 'light';

  // // блок основного окна ==================================
  // document.body.style.setProperty("--main-color", "#e5e5e5");
  // document.body.style.setProperty("--main-bc", "#111111");

  // document.body.classList.add(theme + '-main');
  // document.body.classList.remove(oppositeTheme + '-main');

  // container.classList.add(theme + '-main');
  // container.classList.remove(oppositeTheme + '-main');

  // navbar.classList.add(theme + '-nav');
  // navbar.classList.remove(oppositeTheme + '-nav');

  // let tasks = document.querySelectorAll('.task');
  // tasks.forEach(task => taskColoring(task));

  // let taskBtnsMenu = document.querySelectorAll('.dropdown-menu');
  // taskBtnsMenu.forEach(menu => menu.classList.toggle('dark-btnMenu'));

  // // блок модального окна ==================================
  // let modalContent = document.querySelector('.modal-content');
  // modalContent.classList.add(theme + '-modal');
  // modalContent.classList.remove(oppositeTheme + '-modal');

  // let textFields = document.querySelectorAll('.form-control');

  // textFields.forEach(field => field.classList.toggle('dark-field'));

  // let closeX = modalContent.querySelector('.closeX');
  // closeX.classList.toggle('dark-x');

  // let colorBtns = form.querySelectorAll('.color-label');
  // colorBtns.forEach((btn) => {

  //   let color = btn.getAttribute('for');

  //   btn.classList.toggle(color);
  //   btn.classList.toggle(`dark-${color}`);
  // });

  saveThemeColor();
}

function taskSorter(direction) {

  taskObjList.sort((a, b) => direction === 'up' ? new Date(b.time) - new Date(a.time) : new Date(a.time) - new Date(b.time));

  printAllElements(taskObjList);
  saveStorageElements();
}

//=========================================================

// function taskColoring(task) {
//   let color = task.getAttribute('data-color');

//   if (theme === 'dark') {
//     task.classList.add('dark-' + color);
//     task.classList.remove(color);
//   } else {
//     task.classList.add(color);
//     task.classList.remove('dark-' + color);
//   }
// }

function changeInscriptionsInModalTo(value) {

  let modalTitle = document.querySelector('#exampleModalLabel');
  modalTitle.textContent = value + ' task';

  let modalButton = document.querySelector('#submit');
  modalButton.textContent = value + ' task';

}

//=========================================================

function addTaskBtnListener() {

  let mainBlock = document.querySelector('.main-block');
  mainBlock.addEventListener('click', (e) => {
    let target = e.target;
    let task = target.closest(".task");

    let targetObj = taskObjList.find(obj => JSON.parse(JSON.stringify(obj.time)) === task.getAttribute('data-time'));

    if (target.classList.contains('complete')) {
      taskCompleter(task, targetObj);
    } else if (target.classList.contains('edit')) {
      taskEditor(task, targetObj);
    } else if (target.classList.contains('delete')) {
      taskDeleter(task, targetObj);
    }
  })
}

function taskCompleter(task, targetObj) {

  targetObj.isCompleted = true;
  completedBlock.append(task);

  taskSorter(sortDirection);

  saveStorageElements();
  taskNumCounter();
}

function taskEditor(task, targetObj) {

  editTask = task;
  editObj = targetObj;

  formReset();
  
  form.querySelector('#inputTitle').setAttribute('value', targetObj.title);
  form.querySelector('#inputText').setAttribute('value', targetObj.text);

  form.querySelector(`#${targetObj.color}`).setAttribute('checked','');
  form.querySelector(`#${targetObj.priority}`).setAttribute('checked','');

  editTaskColor = targetObj.color;

  isEdit = true;

  changeInscriptionsInModalTo('Edit');
}


function taskDeleter(task, targetObj) {

  taskObjList = taskObjList.filter(obj => obj !== targetObj);
  task.remove();
  
  saveStorageElements();
  taskNumCounter();
}

//=========================================================

function taskNumCounter() {

  if (taskObjList === undefined) return;

  let toDoTasksAmount = taskObjList.filter(task => task.isCompleted === false).length;
  let toDoTitle = document.querySelector('#toDoTitle');

  toDoTitle.textContent = `ToDo (${toDoTasksAmount})`;

  let compTasksAmount = taskObjList.length - toDoTasksAmount;
  let completedTitle = document.querySelector('#completedTitle');

  completedTitle.textContent = `Completed (${compTasksAmount})`;
}

function formReset() {

  form.reset();

  let formText = form.querySelectorAll('.form-control');
  formText.forEach(elem => elem.removeAttribute('value'));

  let formBtns = form.querySelectorAll('.switch');
  formBtns.forEach(btn => btn.removeAttribute('checked'));
}

//=========================================================

function printAllElements(taskObjList) {

  toDoBlock.innerHTML = '';
  completedBlock.innerHTML = '';

  if (!taskObjList || !taskObjList.length) return;

  for (let i = 0; i < taskObjList.length; i++) {
    printElement(taskObjList[i]);
  }
}

function printElement(obj) {

  let newTask = document.createElement('li');

  if (obj['isCompleted'] === false) {
    toDoBlock.append(newTask);

  } else if (obj['isCompleted'] === true) {
    completedBlock.append(newTask);
  }

  newTask.classList.add('task', 'list-group-item', 'd-flex', 'w-100', 'mb-2', obj.color);
  newTask.setAttribute('data-time', JSON.parse(JSON.stringify(obj.time)));
  newTask.setAttribute('data-color', obj.color);

  // taskColoring(newTask);

  newTask.innerHTML = `
  <div class="w-100 mr-2">
    <div class="d-flex w-100 justify-content-between">
        <h5 class="title mb-1">${obj.title}</h5>
        <div>
            <small class="priority mr-2">${obj.priority} priority</small>
            <small class="time">${dateString(new Date(obj.time))}</small>
        </div>
    </div>
    <p class="text mb-1 w-100">${obj.text}</p>
  </div>
  <div class="dropdown m-2 dropleft">
    <button class="btn btn-secondary h-100" type="button" id="dropdownMenuItem1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i class="fas fa-ellipsis-v"></i>
    </button>
    <div class="dropdown-menu p-2 flex-column btn-block ${theme === 'dark' ? 'dark-btnMenu' : ''}" aria-labelledby="dropdownMenuItem1">
        ${obj['isCompleted'] === false ? `<button type="button" class="btn btn-success w-100 complete">Complete</button>\n
        <button type="button" class="btn btn-info w-100 my-2 edit" data-toggle="modal" data-target="#exampleModal">Edit</button>\n` 
        : ''} 
        <button type="button" class="btn btn-danger w-100 delete">Delete</button>
    </div>
  </div>`;
}

function dateString(date) {
  let str = '';

  str = date.toLocaleTimeString().slice(0,-3) + ' ' + date.toLocaleDateString();

  return str;
}

//=========================================================

function saveStorageElements() {
  localStorage.setItem('pageStorage', JSON.stringify(taskObjList));
}

function saveThemeColor() {
  localStorage.setItem('theme', theme);
}