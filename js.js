let mainBlock = document.querySelector('.main-block');
let toDoBlock = document.querySelector('#currentTasks');
let completedBlock = document.querySelector('#completedTasks');
let form = document.querySelector('#form1');

let pageArr = [];
let index;

if (localStorage.getItem('index')) {
  index = +localStorage.getItem('index')
} else {
  index = 0;
}

let editToggle = false;
let theme;

if (localStorage.getItem('pageStorage')) {
  getElements();
} else {
  let taskObj = {
    "isCompleted": false,
    "title": "Title",
    "priority": "High",
    "time": new Date("2000-01-01T09:00:00.000Z"),
    "text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci aliquid eaque eligendi error eveniet nostrum nulla pariatur repudiandae, veniam. Provident.",
    "color": 'white',
    "index": index,
  }

  pageArr.push(taskObj);
  index++;

  setStorageElements();
  setIndex();
}

if (localStorage.getItem('theme')) {
  theme = localStorage.getItem('theme')
} else {
  theme = 'light';
}


if (theme == 'dark' && pageArr != undefined) {
  darkTheme();
} else {
  printElements(pageArr);
}

// включение обработчиков на кнопках Complete, Edit и Delete
addNavbarBtnListener();
addTaskBtnListener();
addColorBtnsListener();

// счётчики количества тасков в разных блоках 
toDoCounter();
completedCounter();

// переменная хранит информацию о том, какой именно таск редактируется 
let editTask;

// обработчик нажатия submit модального окна (имеет ветку создания таска и редактирования)
let editTaskData = '';

form.addEventListener('submit', (e) => {
  
  e.preventDefault(); 

  let formData = new FormData(form);
  let date = new Date();

  //=========================================================
  // ответвление для редактирования таска

  if (editToggle == true) {

    for (let i = 0; i < pageArr.length; i++) {
      if (+editTask.classList[1] == pageArr[i].index) {
        pageArr[i].title = formData.get('inputTitle');
        pageArr[i].priority = formData.get('priority');
        pageArr[i].text = formData.get('inputText');

        if (formData.get('colors')) {
          pageArr[i].color = formData.get('colors');
        } 

        break;
      }
    }  
  
    printElements(pageArr);

    formReset();
    setStorageElements();

    editToggle = false;

    $('#exampleModal').modal('hide');

    return;
  }

  //=========================================================
  // создания нового таска

  let taskObj = {
    "isCompleted": false,
    "title": formData.get('inputTitle'),
    "priority": formData.get('priority'),
    "time": date,
    "text": formData.get('inputText'),
    "index": index,
  }

  taskObj.color = formData.get('colors') ? formData.get('colors') : "white";

  pageArr.push(taskObj);
  index++;

  printElements(pageArr);

  formReset();

  setStorageElements();
  setIndex();

  toDoCounter();
  completedCounter();

  $('#exampleModal').modal('hide');
});

//=========================================================
//=========================================================

function addNavbarBtnListener() {

  let navbar = document.querySelector('.navbar');

  navbar.addEventListener('click', (e) => {
    let target = e.target;
    let targetBtn = target.closest('button');

    if (!targetBtn) return;

    if (targetBtn.classList.contains('btn-light')) {
      lightTheme();
    } else if (targetBtn.classList.contains('btn-dark')) {
      darkTheme();
    } else if (targetBtn.classList.contains('up-button')) {
      upSorter();
    } else if (targetBtn.classList.contains('down-button')) {
      downSorter();
    } else if (targetBtn.classList.contains('addBtn')) {
      addElemEditer();
    }
  })
}


function lightTheme() {

  if (theme == 'light') return;

  theme = 'light';

  printElements(pageArr);

  // блок стабильных видоизменений модального окна
  let modalContent = document.querySelector('.modal-content');
  modalContent.classList.add('light-modal');
  modalContent.classList.remove('dark-modal');

  let textFields = document.querySelectorAll('.form-control');
  textFields.forEach(function(field) {
    field.classList.remove('dark-field');
  })

  let closeX = modalContent.querySelector('.closeX');
  closeX.classList.remove('dark-x');


  let redBtn = modalContent.querySelector('.dark-red');
  redBtn.classList.add('red');
  redBtn.classList.remove('dark-red');

  let orangeBtn = modalContent.querySelector('.dark-orange');
  orangeBtn.classList.add('orange');
  orangeBtn.classList.remove('dark-orange');

  let greenBtn = modalContent.querySelector('.dark-green');
  greenBtn.classList.add('green');
  greenBtn.classList.remove('dark-green');

  let turquoiseBtn = modalContent.querySelector('.dark-turquoise');
  turquoiseBtn.classList.add('turquoise');
  turquoiseBtn.classList.remove('dark-turquoise');

  let blueBtn = modalContent.querySelector('.dark-blue');
  blueBtn.classList.add('blue');
  blueBtn.classList.remove('dark-blue');

  // блок стабильных видоизменений основного окна

  document.body.classList.add('light-main');

  container.classList.add('light-main');

  navbar.classList.add('bg-light', 'light-nav');
  navbar.classList.remove('dark-nav');

  // сохранение

  setStorageElements();
  setThemeColor();
};


function darkTheme() {

  if (theme == 'dark' && !document.querySelector('.bg-light')) return;

  theme = 'dark';

  // блок стабильных видоизменений модального окна
  let modalContent = document.querySelector('.modal-content');
  modalContent.classList.remove('light-modal');
  modalContent.classList.add('dark-modal');

  let textFields = document.querySelectorAll('.form-control');
  textFields.forEach(function(field) {
    field.classList.add('dark-field');
  })

  let closeX = modalContent.querySelector('.closeX');
  closeX.classList.add('dark-x'); 

  let redBtn = modalContent.querySelector('.red');
  redBtn.classList.add('dark-red');
  redBtn.classList.remove('red');

  let orangeBtn = modalContent.querySelector('.orange');
  orangeBtn.classList.add('dark-orange');
  orangeBtn.classList.remove('orange');

  let greenBtn = modalContent.querySelector('.green');
  greenBtn.classList.add('dark-green');
  greenBtn.classList.remove('green');

  let turquoiseBtn = modalContent.querySelector('.turquoise');
  turquoiseBtn.classList.add('dark-turquoise');
  turquoiseBtn.classList.remove('turquoise');

  let blueBtn = modalContent.querySelector('.blue');
  blueBtn.classList.add('dark-blue');
  blueBtn.classList.remove('blue');

  // блок стабильных видоизменений основного окна

  document.body.classList.add('dark-main');
  document.body.classList.remove('light-main');

  container.classList.add('dark-main');
  container.classList.remove('light-main');

  navbar.classList.add('dark-nav');
  navbar.classList.remove('bg-light', 'light-nav');

  printElements(pageArr);

  // сохранение

  setStorageElements();
  setThemeColor();
}


function upSorter() {

  pageArr = pageArr.sort((a, b) => new Date(b.time) - new Date(a.time));

  printElements(pageArr);
  setStorageElements();
}


function downSorter() {

  pageArr = pageArr.sort((a, b) => new Date(a.time) - new Date(b.time));

  printElements(pageArr);
  setStorageElements();
}


function addElemEditer() {

  formReset();

  editToggle = false;

  let modalTitle = document.querySelector('#exampleModalLabel');
  modalTitle.textContent = 'Add task';

  let modalButton = document.querySelector('#submit');
  modalButton.textContent = 'Add task';

}


//=========================================================

function dateString(date) {
  let str = '';

  str = date.toLocaleTimeString().slice(0,-3) + ' ' + date.toLocaleDateString();

  return str;
}

//=========================================================

function addTaskBtnListener() {

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


function taskCompleter(target) {

  let taskToComp = [...toDoBlock.querySelectorAll(".task")].find(li => li == target.closest(".task"));

  for (let i = 0; i < pageArr.length; i++) {
    if (+taskToComp.classList[1] == pageArr[i].index) {
      pageArr[i].isCompleted = true;
      break;
    }
  }

  setStorageElements();
  printElements(pageArr);

  toDoCounter();
  completedCounter();
}


function taskEditor(target) {

  editTask = target.closest(".task");

  let taskToEdit = [...toDoBlock.querySelectorAll(".task")].find(li => li == editTask);

  for (let i = 0; i < pageArr.length; i++) {
    if (+taskToEdit.classList[1] == pageArr[i].index) {
      
      form.querySelector('#inputTitle').setAttribute('value', pageArr[i].title);
      form.querySelector('#inputText').setAttribute('value', pageArr[i].text);

      form.querySelector(`.${pageArr[i].priority.toLowerCase()}`).setAttribute('checked','');

      if (pageArr[i].color && pageArr[i].color != "white") {
        form.querySelector(`#${pageArr[i].color.toLowerCase()}`).setAttribute('checked','');
      }

      break;
    }
  }

  let modalTitle = document.querySelector('#exampleModalLabel');
  modalTitle.textContent = 'Edit task';

  let modalButton = document.querySelector('#submit');
  modalButton.textContent = 'Edit task';

  editToggle = true;
}


function taskDeleter(target) {

  let taskToDel = [...mainBlock.querySelectorAll(".task")].find(li => li == target.closest(".task"));

  for (let i = 0; i < pageArr.length; i++) {
    if (+taskToDel.classList[1] == pageArr[i].index) {
      pageArr.splice(i, 1);
      break;
    }
  }

  printElements(pageArr);

  setStorageElements();

  toDoCounter();
  completedCounter();
}

//=========================================================
// Счётчики текущих и завершённых тасков, запускаются при любых добавлениях, удалениях и перемешениях из категорий таксов
function toDoCounter() {

  if (pageArr == undefined) return;
  
  let tasksAmount = pageArr.filter(task => task.isCompleted == false).length;
  let toDoTitle = document.querySelector('#toDoTitle');

  toDoTitle.textContent = `ToDo (${tasksAmount})`;
}

function completedCounter() {

  if (pageArr == undefined) return;

  let tasksAmount = pageArr.filter(task => task.isCompleted == true).length;
  let completedTitle = document.querySelector('#completedTitle');

  completedTitle.textContent = `Completed (${tasksAmount})`;
}

//=========================================================

function addColorBtnsListener() {

  let colorBtns = document.querySelector('.colorBtns');

  colorBtns.addEventListener('click', (e) => {

    let target = e.target;

    let formColorBtns = form.querySelectorAll('.color-radio');
    formColorBtns.forEach(btn => btn.removeAttribute('checked'));

    if (target.closest('.color-check')) {
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
// localStorage

function getElements() {

  if (!localStorage.getItem('pageStorage')) return;

  pageArr = JSON.parse(localStorage.getItem('pageStorage'));
}

function printElements(pageArr) {

  if (!pageArr) return;
  if (pageArr.length < 1) return;

  toDoBlock.innerHTML = '';
  completedBlock.innerHTML = '';

  for (let i = 0; i < pageArr.length; i++) {
    
    if (pageArr[i] == undefined) return;

    let obj = pageArr[i];
    let newTask = document.createElement('li');

    let additionelBtns;

    if (obj['isCompleted'] == false) {
      toDoBlock.append(newTask);

      additionelBtns = `<button type="button" class="btn btn-success w-100 complete">Complete</button>\n
      <button type="button" class="btn btn-info w-100 my-2 edit" data-toggle="modal" data-target="#exampleModal">Edit</button>\n`;

    } else if (obj['isCompleted'] == true) {
      completedBlock.append(newTask);

      additionelBtns = ''
    }

    newTask.classList.add('task', obj['index'], 'list-group-item', 'd-flex', 'w-100', 'mb-2');

    if (theme == 'dark' && !obj['color'].includes('dark-')) {
      newTask.classList.add('dark-' + obj['color']);
    } else {
      newTask.classList.add(obj['color']);
    }

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
      <div class="dropdown-menu p-2 flex-column btn-block" aria-labelledby="dropdownMenuItem1">
          ${additionelBtns}
          <button type="button" class="btn btn-danger w-100 delete">Delete</button>
      </div>
    </div>`;

    if (obj.style) {
      newTask.setAttribute('style', obj.style);
    }

    // изменение цвета меню кнопок 
    if (theme == 'dark') {
      let menus = document.querySelectorAll('.dropdown-menu');

      for (let i = 0; i < menus.length; i++) {
        menus[i].style.background = '#505050';
      }
    }
  }
}


window.addEventListener('unload', setStorageElements());

function setStorageElements() {
  localStorage.setItem('pageStorage', JSON.stringify(pageArr));
}


window.addEventListener('unload', setThemeColor());

function setThemeColor() {
  localStorage.setItem('theme', theme);
}

window.addEventListener('unload', setIndex());

function setIndex() {
  localStorage.setItem('index', index);
}