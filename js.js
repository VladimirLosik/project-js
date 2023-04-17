let toDoBlock = document.querySelector('#currentTasks');
let completedBlock = document.querySelector('#completedTasks');
let form = document.querySelector('#form1');

let navbar = document.querySelector('.navbar');

let sortDirection;

let taskObjList = [];

let editToggle = false;
let editTask;
let editTaskIndex;
let editTaskColor;

if (localStorage.getItem('pageStorage')) {
  getElements();
} else {
  let taskObj = {
    "isCompleted": false,
    "title": "Title",
    "priority": "High",
    "time": "2000-01-01T09:00:00.000Z",
    "text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci aliquid eaque eligendi error eveniet nostrum nulla pariatur repudiandae, veniam. Provident.",
    "color": 'transparent',
  }

  taskObjList.push(taskObj);
  saveStorageElements();
}


let theme = localStorage.getItem('theme') || 'light';

if (theme === 'dark') setTheme('dark');

printAllElements(taskObjList);
addNavbarBtnListener();
addTaskBtnListener();
addColorBtnsListener();
taskNumCounter();

// ========================================================

form.addEventListener('submit', (e) => {
  e.preventDefault(); 

  let formData = new FormData(form);
  let date = new Date();

  // ответвление для редактирования таска =================
  if (editToggle === true) {

    taskObjList[editTaskIndex].title = formData.get('inputTitle');
    taskObjList[editTaskIndex].text = formData.get('inputText');
    taskObjList[editTaskIndex].color = formData.get('colors');
    taskObjList[editTaskIndex].priority = formData.get('priority');

    saveStorageElements();

    editTask.setAttribute('data-color', formData.get('colors'));
    editTask.classList.remove(theme === 'dark' ? 'dark-' + editTaskColor : editTaskColor);
    taskColoring(editTask);

    editTask.querySelector('.title').textContent = formData.get('inputTitle');
    editTask.querySelector('.text').textContent = formData.get('inputText');
    editTask.querySelector('.priority').textContent = formData.get('priority') + " priority";

    formReset();
    editToggle = false;
    $('#exampleModal').modal('hide');

    return;
  }

  // создания нового таска ================================
  let taskObj = {
    "isCompleted": false,
    "title": formData.get('inputTitle'),
    "priority": formData.get('priority'),
    "time": date,
    "text": formData.get('inputText'),
  }

  taskObj.color = formData.get('colors') || "transparent";

  printElement(taskObj);

  taskObjList.push(taskObj);
  formReset();
  saveStorageElements();
  taskNumCounter();
  $('#exampleModal').modal('hide');
});

// ========================================================

function addNavbarBtnListener() {

  navbar.addEventListener('click', (e) => {
    let target = e.target;
    let targetBtn = target.closest('button');

    if (!targetBtn) return;

    if (targetBtn.classList.contains('btn-light')) {
      if (theme !== 'light') setTheme('light');
    } else if (targetBtn.classList.contains('btn-dark')) {
      if (theme !== 'dark') setTheme('dark');
    } else if (targetBtn.classList.contains('up-button')) {

      sortDirection = 'up';
      taskSorter(sortDirection);

    } else if (targetBtn.classList.contains('down-button')) {

      sortDirection = 'down';
      taskSorter(sortDirection);

    } else if (targetBtn.classList.contains('addBtn')) {
      editToggle = false;

      formReset();
      changeInscriptionsInModalTo('Add');
    }
  })
}

function setTheme(clickedTheme) {

  theme = clickedTheme;
  oppositeTheme = (theme === 'light') ? 'dark' : 'light';

  // блок основного окна ==================================
  document.body.classList.add(theme + '-main');
  document.body.classList.remove(oppositeTheme + '-main');

  container.classList.add(theme + '-main');
  container.classList.remove(oppositeTheme + '-main');

  navbar.classList.add(theme + '-nav');
  navbar.classList.remove(oppositeTheme + '-nav');

  let tasks = document.querySelectorAll('.task');
  tasks.forEach(task => taskColoring(task));

  let taskBtnsMenu = document.querySelectorAll('.dropdown-menu');
  taskBtnsMenu.forEach(menu => menu.classList.toggle('dark-btnMenu'));

  // блок модального окна ==================================
  let modalContent = document.querySelector('.modal-content');
  modalContent.classList.add(theme + '-modal');
  modalContent.classList.remove(oppositeTheme + '-modal');

  let textFields = document.querySelectorAll('.form-control');

  textFields.forEach(function(field) {
    field.classList.toggle('dark-field');
  })

  let closeX = modalContent.querySelector('.closeX');
  closeX.classList.toggle('dark-x');

  let colorBtns = form.querySelectorAll('.color-check');
  colorBtns.forEach((btn) => {

    let color = btn.getAttribute('data-color');

    btn.classList.toggle(color);
    btn.classList.toggle(`dark-${color}`);
  });

  saveThemeColor();
}

function taskSorter(direction) {

  taskObjList.sort((a, b) => direction === 'up' ? new Date(b.time) - new Date(a.time) : new Date(a.time) - new Date(b.time));

  printAllElements(taskObjList);
  saveStorageElements();
}

//=========================================================

function taskColoring(task) {
  let color = task.getAttribute('data-color');

  if (theme === 'dark') {
    task.classList.add('dark-' + color);
    task.classList.remove(color);
  } else {
    task.classList.add(color);
    task.classList.remove('dark-' + color);
  }
}

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

    if (target.classList.contains('complete')) {
      taskCompleter(target);
    } else if (target.classList.contains('edit')) {
      taskEditor(target);
    } else if (target.classList.contains('delete')) {
      taskDeleter(target);
    }
  })
}

function taskCompleter(btn) {

  let taskToComp = btn.closest(".task");

  for (let i = 0; i < taskObjList.length; i++) {
    if (taskToComp.getAttribute('data-time') === JSON.parse(JSON.stringify(taskObjList[i].time))) {
      taskObjList[i].isCompleted = true;
      completedBlock.append(taskToComp);

      break;
    }
  }

  taskSorter(sortDirection);

  saveStorageElements();
  taskNumCounter();
}

function taskEditor(btn) {

  editTask = btn.closest(".task");

  for (let i = 0; i < taskObjList.length; i++) {
    if (editTask.getAttribute('data-time') === JSON.parse(JSON.stringify(taskObjList[i].time))) {

      editTaskIndex = i;

      formReset();
      
      form.querySelector('#inputTitle').setAttribute('value', taskObjList[i].title);
      form.querySelector('#inputText').setAttribute('value', taskObjList[i].text);

      form.querySelector(`#${taskObjList[i].color}`).setAttribute('checked','');
      form.querySelector(`#${taskObjList[i].priority}`).setAttribute('checked','');

      editTaskColor = taskObjList[i].color;

      break;
    }
  }

  editToggle = true;

  changeInscriptionsInModalTo('Edit');
}


function taskDeleter(btn) {

  let taskToDel = btn.closest(".task");

  for (let i = 0; i < taskObjList.length; i++) {
    if (taskToDel.getAttribute('data-time') === JSON.parse(JSON.stringify(taskObjList[i].time))) {
      taskObjList.splice(i, 1);
      taskToDel.remove();

      break;
    }
  }
  
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

function addColorBtnsListener() {

  let colorBtns = document.querySelector('.colorBtns');

  colorBtns.addEventListener('click', (e) => {

    let target = e.target;

    if (target.closest('.color-check')) {
      let formColorBtns = form.querySelectorAll('.color-radio');
      formColorBtns.forEach(btn => btn.removeAttribute('checked'));

      target.closest('.color-check').querySelector('input').setAttribute('checked','');
    }
  })
}

function formReset() {

  form.reset();

  let formText = form.querySelectorAll('.form-control');
  formText.forEach(elem => elem.removeAttribute('value'));

  let formBtns = form.querySelectorAll('.form-check-input');
  formBtns.forEach(btn => btn.removeAttribute('checked'));
  
}

//=========================================================

function getElements() {
  taskObjList = JSON.parse(localStorage.getItem('pageStorage'));
}

function printAllElements(taskObjList) {

  toDoBlock.innerHTML = '';
  completedBlock.innerHTML = '';

  if (!taskObjList) return;
  if (taskObjList.length < 1) return;

  for (let i = 0; i < taskObjList.length; i++) {
    printElement(taskObjList[i]);
  }
}

function printElement(obj) {

  let newTask = document.createElement('li');

  let additionelBtns;

  if (obj['isCompleted'] === false) {
    toDoBlock.append(newTask);

    additionelBtns = `<button type="button" class="btn btn-success w-100 complete">Complete</button>\n
    <button type="button" class="btn btn-info w-100 my-2 edit" data-toggle="modal" data-target="#exampleModal">Edit</button>\n`;

  } else if (obj['isCompleted'] === true) {
    completedBlock.append(newTask);

    additionelBtns = '';
  }

  newTask.classList.add('task', 'list-group-item', 'd-flex', 'w-100', 'mb-2');
  newTask.setAttribute('data-time', JSON.parse(JSON.stringify(obj.time)));
  newTask.setAttribute('data-color', obj.color);

  taskColoring(newTask);

  let btnMenuColor = theme === 'dark' ? 'dark-btnMenu' : '';

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
    <div class="dropdown-menu p-2 flex-column btn-block ${btnMenuColor}" aria-labelledby="dropdownMenuItem1">
        ${additionelBtns}
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