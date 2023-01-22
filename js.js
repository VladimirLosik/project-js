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

let editTime = '';
let editColor = '';

let theme;

if (localStorage.getItem('theme')) {
  theme = localStorage.getItem('theme')
} else {
  theme = 'light';
}


// функция для загрузки информации из localStorage
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

  index++;

  setIndex();

  pageArr.push(taskObj);

  setStorageElements();
}

if (pageArr != undefined) {
  printElements(pageArr);
}

// включение обработчиков на кнопках Complete, Edit и Delete

addThemeBtnListener();
addTaskBtnListener();
addColorBtnsListener()

// счётчики количества тасков в разных блоках 
toDoCounter();
completedCounter();

// переменная хранит информацию о том, какой именно таск редактируется 
let editTask;

//=========================================================

if (theme == 'dark') {
  darkTheme();
}

// объект с цветами 
let colors = {
  'red': '#dd3243',
  'redLightBack': 'rgb(255, 200, 200)',
  'redDarkBack': 'rgb(100, 50, 50)',

  'orange': '#ffc201',
  'orangeLightBack': 'rgb(255, 225, 150)',
  'orangeDarkBack': 'rgb(100, 70, 50)',

  'green': '#23a843',
  'greenLightBack': 'rgb(220, 255, 200)',
  'greenDarkBack': 'rgb(50, 80, 50)',

  'turquoise': '#0fa3b9',
  'turquoiseLightBack': 'rgb(210, 255, 240)',
  'turquoiseDarkBack': 'rgb(50, 80, 75)',

  'blue': '#007cff',
  'blueLightBack': 'rgb(190, 230, 255)',
  'blueDarkBack': 'rgb(35, 50, 100)',
}

// группа кнопок для выбора цвета, выбранный цвет и бэкграунд
let colorSelect = document.querySelector('#colors');
let color = '';
let backColor = '';

// обработчик сохраняет любое нажатие по кнопкам цвета
colorSelect.addEventListener('click', (e) => {
  if (e.target.id) color = e.target.id;
})

// обработчики для обнуления переменной с цветом в случае закрытия формы и отключения рычага редактирования
let closeX = document.querySelector('#close');
closeX.addEventListener('click', () => {
  color = '';
  editToggle = false;
})

let closeButton = document.querySelector('#close-button');
closeButton.addEventListener('click', () => {
  color = '';
  editToggle = false;
})


// обработчик нажатия submit модального окна (имеет ветку создания таска и редактирования)
let editTaskData = '';

form.addEventListener('submit', (e) => {
  e.preventDefault(); 

  let formData = new FormData(form);

  let modalBackdrop = document.querySelector('.modal-backdrop');
  let modal = document.querySelector('.modal');

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
  
    printElements(pageArr)

    //===========
    // блок для очистки данных полей после отправки формы
    let inputTitle = form.querySelector('#inputTitle');
    let inputText = form.querySelector('#inputText');

    let redBtn = form.querySelector('#red');
    let orangeBtn = form.querySelector('#orange');
    let greenBtn = form.querySelector('#green');
    let turquoiseBtn = form.querySelector('#turquoise');
    let blueBtn = form.querySelector('#blue');


    let lowPriority = form.querySelector('.low');
    let mediumPriority = form.querySelector('.medium');
    let highPriority = form.querySelector('.high');


    inputTitle.removeAttribute('value');
    inputText.removeAttribute('value');

    redBtn.removeAttribute('checked');
    orangeBtn.removeAttribute('checked');
    greenBtn.removeAttribute('checked');
    turquoiseBtn.removeAttribute('checked');
    blueBtn.removeAttribute('checked');

    lowPriority.removeAttribute('checked');
    mediumPriority.removeAttribute('checked');
    highPriority.removeAttribute('checked');

    //===========
    // блок закрытия модального окна
    modalBackdrop.remove();  
    modal.classList.remove('show');

    setTimeout(modalRemove(modal), 500);

    // отключение "рычага" редактирования, чтобы следующий вызов модального окна шёл по ветке создания таска (если только
    // не будет нажата кнопка edit, тогда "рычаг" опять включится
    editToggle = false;

    // if (theme == 'dark') {
    //   document.body.style.backgroundColor = '#111111';
    // }

    color = '';


    let tasks = document.querySelectorAll('.task');

    let currentTaskNumber;

    for (let i = 0; i < tasks.length; i++) {
      if (tasks.item(i) == editTask) {
        currentTaskNumber = i;
        break;
      }
    }


    // printElements(pageArr)
    // getStorageElements();

    setStorageElements();
    // addEditButtomListener();

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

  index++;

  setIndex();

  pageArr.push(taskObj);

  printElements(pageArr);

  //=========================================================
  // закрытие модального окна 
  modalBackdrop.remove();  
  modal.classList.remove('show');

  // с setом хотя бы меняется курсор, но клик всё равно холостой)
  setTimeout(modalRemove(modal), 500);

  //=========================================================
  // блок для очистки данных полей после отправки формы
  let inputTitle = form.querySelector('#inputTitle');
  let inputText = form.querySelector('#inputText');

  let redBtn = form.querySelector('#red');
  let orangeBtn = form.querySelector('#orange');
  let greenBtn = form.querySelector('#green');
  let turquoiseBtn = form.querySelector('#turquoise');
  let blueBtn = form.querySelector('#blue');


  let lowPriority = form.querySelector('.low');
  let mediumPriority = form.querySelector('.medium');
  let highPriority = form.querySelector('.high');


  inputTitle.removeAttribute('value');
  inputText.removeAttribute('value');

  redBtn.removeAttribute('checked');
  orangeBtn.removeAttribute('checked');
  greenBtn.removeAttribute('checked');
  turquoiseBtn.removeAttribute('checked');
  blueBtn.removeAttribute('checked');

  lowPriority.removeAttribute('checked');
  mediumPriority.removeAttribute('checked');
  highPriority.removeAttribute('checked');
  form.reset();
  
  color = '';
  if (theme == 'dark') document.body.style.backgroundColor = '#111111';
  editToggle = false;

  setStorageElements();

  // addBtnListener();
  // addCompleteButtomListener();
  // addEditButtomListener();
  // addDeleteButtomListener();

  toDoCounter();
  completedCounter();
});

//=========================================================
//=========================================================
// закрытие модального окна
function modalRemove(modal) {
  document.body.classList.remove('modal-open');
  document.body.removeAttribute('style');

  modal.setAttribute('style', 'display: none;');
  modal.setAttribute('aria-hidden', 'true');
  modal.removeAttribute('aria-modal');
}

//=========================================================

function addThemeBtnListener() {

  let themeBtns = document.querySelector('.dropdown-menu-right');

  themeBtns.addEventListener('click', (e) => {
    let target = e.target;

    if (target.classList.contains('btn-light')) {
      lightTheme();
    } else if (target.classList.contains('btn-dark')) {
      darkTheme();
    }
  })
}

//=========================================================

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

  let closeX = document.querySelector('.closeX');
  closeX.classList.remove('dark-x');


  let redBtn = document.querySelector('.dark-red');
  redBtn.classList.add('red');
  redBtn.classList.remove('dark-red');

  let orangeBtn = document.querySelector('.dark-orange');
  orangeBtn.classList.add('orange');
  orangeBtn.classList.remove('dark-orange');

  let greenBtn = document.querySelector('.dark-green');
  greenBtn.classList.add('green');
  greenBtn.classList.remove('dark-green');

  let turquoiseBtn = document.querySelector('.dark-turquoise');
  turquoiseBtn.classList.add('turquoise');
  turquoiseBtn.classList.remove('dark-turquoise');

  let blueBtn = document.querySelector('.dark-blue');
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

//===========

function darkTheme() {

  if (theme == 'dark' && !document.querySelector('.bg-light')) return;

  theme = 'dark';

  printElements(pageArr);

  // блок стабильных видоизменений модального окна
  let modalContent = document.querySelector('.modal-content');
  modalContent.classList.remove('light-modal');
  modalContent.classList.add('dark-modal');

  let textFields = document.querySelectorAll('.form-control');
  textFields.forEach(function(field) {
    field.classList.add('dark-field');
  })

  let closeX = document.querySelector('.closeX');
  closeX.classList.add('dark-x'); 

  let redBtn = document.querySelector('.red');
  redBtn.classList.add('dark-red');
  redBtn.classList.remove('red');

  let orangeBtn = document.querySelector('.orange');
  orangeBtn.classList.add('dark-orange');
  orangeBtn.classList.remove('orange');

  let greenBtn = document.querySelector('.green');
  greenBtn.classList.add('dark-green');
  greenBtn.classList.remove('green');

  let turquoiseBtn = document.querySelector('.turquoise');
  turquoiseBtn.classList.add('dark-turquoise');
  turquoiseBtn.classList.remove('turquoise');

  let blueBtn = document.querySelector('.blue');
  blueBtn.classList.add('dark-blue');
  blueBtn.classList.remove('blue');

  // блок стабильных видоизменений основного окна

  document.body.classList.add('dark-main');
  document.body.classList.remove('light-main');

  container.classList.add('dark-main');
  container.classList.remove('light-main');

  navbar.classList.add('dark-nav');
  navbar.classList.remove('bg-light', 'light-nav');

  // сохранение

  setStorageElements();
  setThemeColor();
}

//=========================================================
// обработчики нажатий на кнопки сортировки по датам
let upButton = document.querySelector('.up-button');

upButton.addEventListener('click', () => {

  pageArr = pageArr.reverse();

  printElements(pageArr)
  
  // let taskList = toDoBlock.querySelectorAll('.task');
  
  // if (taskList.length > 1) {
  //   let itemsArray = [];
  //   let parent = taskList[0].parentNode;

  //   for (let i = 0; i < taskList.length; i++) {    
  //     itemsArray.push(parent.removeChild(taskList[i]));
  //   }

  //   itemsArray.sort(function(taskA, taskB) {
  //     let timeA = taskA.querySelector('.time').textContent;
  //     let timeB = taskB.querySelector('.time').textContent;

  //     timeA = timeA.split(' ');
  //     timeB = timeB.split(' ');

  //     let hoursMinutesA = timeA[0].split(':');
  //     let hoursMinutesB = timeB[0].split(':');

  //     timeA = timeA[1].split('.');
  //     timeB = timeB[1].split('.');

  //     let dateA = new Date(timeA[2], timeA[1] - 1, timeA[0], hoursMinutesA[0], hoursMinutesA[1]);
  //     let dateB = new Date(timeB[2], timeB[1] - 1, timeB[0], hoursMinutesB[0], hoursMinutesB[1]);
      
  //     if (dateA < dateB) {
  //       return 1;
  //     }
  //     if (dateA > dateB) {
  //       return -1;
  //     }
  //     return 0;
  //   })
  //   .forEach(function(node) {
  //     parent.appendChild(node)
  //   });
  // }

  // //========================

  // let compTaskList = completedBlock.querySelectorAll('.task');

  // if (compTaskList.length > 1) {

  //   let compItemsArray = [];
  //   let compParent = compTaskList[0].parentNode;

  //   for (let i = 0; i < compTaskList.length; i++) {    
  //     compItemsArray.push(compParent.removeChild(compTaskList[i]));
  //   }

  //   compItemsArray.sort(function(taskA, taskB) {
  //     let timeA = taskA.querySelector('.time').textContent;
  //     let timeB = taskB.querySelector('.time').textContent;

  //     timeA = timeA.split(' ');
  //     timeB = timeB.split(' ');

  //     let hoursMinutesA = timeA[0].split(':');
  //     let hoursMinutesB = timeB[0].split(':');

  //     timeA = timeA[1].split('.');
  //     timeB = timeB[1].split('.');

  //     let dateA = new Date(timeA[2], timeA[1] - 1, timeA[0], hoursMinutesA[0], hoursMinutesA[1]);
  //     let dateB = new Date(timeB[2], timeB[1] - 1, timeB[0], hoursMinutesB[0], hoursMinutesB[1]);
      
  //     if (dateA < dateB) {
  //       return 1;
  //     }
  //     if (dateA > dateB) {
  //       return -1;
  //     }
  //     return 0;
  //   })
  //   .forEach(function(node) {
  //     compParent.appendChild(node)
  //   })
  // }

  setStorageElements();

})
  
//========================

let downButton = document.querySelector('.down-button');

downButton.addEventListener('click', () => {

  pageArr = pageArr.reverse();

  printElements(pageArr);
  
  // let taskList = toDoBlock.querySelectorAll('.task');

  // if (taskList.length > 1) {
  //   let itemsArray = [];
  //   let parent = taskList[0].parentNode;

  //   for (let i = 0; i < taskList.length; i++) {    
  //     itemsArray.push(parent.removeChild(taskList[i]));
  //   }

  //   itemsArray.sort(function(taskA, taskB) {
  //     let timeA = taskA.querySelector('.time').textContent;
  //     let timeB = taskB.querySelector('.time').textContent;

  //     timeA = timeA.split(' ');
  //     timeB = timeB.split(' ');

  //     let hoursMinutesA = timeA[0].split(':');
  //     let hoursMinutesB = timeB[0].split(':');

  //     timeA = timeA[1].split('.');
  //     timeB = timeB[1].split('.');

  //     let dateA = new Date(timeA[2], timeA[1] - 1, timeA[0], hoursMinutesA[0], hoursMinutesA[1]);
  //     let dateB = new Date(timeB[2], timeB[1] - 1, timeB[0], hoursMinutesB[0], hoursMinutesB[1]);
      
  //     if (dateA < dateB) {
  //       return -1;
  //     }
  //     if (dateA > dateB) {
  //       return 1;
  //     }
  //     return 0;
  //   })
  //   .forEach(function(node) {
  //     parent.appendChild(node)
  //   });
  // }

  // //========================

  // let compTaskList = completedBlock.querySelectorAll('.task');

  // if (compTaskList.length > 1) {

  //   let compItemsArray = [];
  //   let compParent = compTaskList[0].parentNode;

  //   for (let i = 0; i < compTaskList.length; i++) {    
  //     compItemsArray.push(compParent.removeChild(compTaskList[i]));
  //   }

  //   compItemsArray.sort(function(taskA, taskB) {
  //     let timeA = taskA.querySelector('.time').textContent;
  //     let timeB = taskB.querySelector('.time').textContent;

  //     timeA = timeA.split(' ');
  //     timeB = timeB.split(' ');

  //     let hoursMinutesA = timeA[0].split(':');
  //     let hoursMinutesB = timeB[0].split(':');

  //     timeA = timeA[1].split('.');
  //     timeB = timeB[1].split('.');

  //     let dateA = new Date(timeA[2], timeA[1] - 1, timeA[0], hoursMinutesA[0], hoursMinutesA[1]);
  //     let dateB = new Date(timeB[2], timeB[1] - 1, timeB[0], hoursMinutesB[0], hoursMinutesB[1]);
      
  //     if (dateA < dateB) {
  //       return -1;
  //     }
  //     if (dateA > dateB) {
  //       return 1;
  //     }
  //     return 0;
  //   })
  //   .forEach(function(node) {
  //     compParent.appendChild(node)
  //   })
  // }

  setStorageElements();

})

//=========================================================
// обработчик, изменяющий текст заголовка и кнопки модального окна, если идёт процесс создания нового элемента
let addTaskButton = document.querySelector('#addTaskButton');

addTaskButton.addEventListener('click', () => {
  form.reset();

  editToggle = false;

  let modalTitle = document.querySelector('#exampleModalLabel');
  modalTitle.textContent = 'Add task';

  let modalButton = document.querySelector('#submit');
  modalButton.textContent = 'Add task';
})


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

// let colorBtns = document.querySelectorAll('#colors');

// colorBtns.forEach(function(btn) {

//   btn.addEventListener('click', () => {
//     let radio = btn.querySelector('input');
//     radio.setAttribute('checked','');
//   });
// })

function addColorBtnsListener() {

  let colorBtns = document.querySelector('.colorBtns');

  colorBtns.addEventListener('click', (e) => {

    let target = e.target;

    target.closest('.color-check').querySelector('input').setAttribute('checked','');

  })
}

//=========================================================
// localStorage

function getElements() {

  if (!localStorage.getItem('pageStorage')) return;

  pageArr = JSON.parse(localStorage.getItem('pageStorage'));

}

function printElements(pageArr) {

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


window.addEventListener('unload', setStorageElements);

function setStorageElements() {

  localStorage.removeItem('pageStorage');
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