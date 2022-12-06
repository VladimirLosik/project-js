// блок активных тасков и блок формы
let toDoBlock = document.querySelector('#currentTasks');
let form = document.querySelector('#form1');

// рычаг для переключения поведения результатов формы при отправки, когда он включен, элемент редактируется, когда выключен, создаётся новый
// включение происходит по нажатию одной из кнопок Edit
let editToggle = false;

let editTime = '';
let editColor = '';


// функция для загрузки информации из localStorage
getStorageElements();


// объекты для хранения тасов перед помещением в 
// let storageToDo = {};
// let compStorage = {};

// счётчик количества тасков в localStorage 
let taskCounter = 0;

// включение обработчиков на кнопках Complete, Edit и Delete
addCompleteButtomListener();
addEditButtomListener();
addDeleteButtomListener();

// счётчики количества тасков в разных блоках 
toDoCounter();
completedCounter();

// переменная хранит информацию о том, какой именно таск редактируется 
let editTask;

//=========================================================
// переменная с информацией о теме, изначально светлая
let theme;

if (localStorage.getItem('theme')) {
  theme = localStorage.getItem('theme')
} else {
  theme = 'light';
}

if (theme == 'dark') {
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


  document.body.style.backgroundColor = '#111111';

  container.style.backgroundColor = '#111111';
  container.style.color = '#e5e5e5';

  navbar.classList.remove("bg-light");
  navbar.style.backgroundColor = '#353535';
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

// функция смены цвета бэкграунда на тёмную|светлую противоположность
function BackColor(task) {
  switch (task) {
    case 'rgb(255, 200, 200)':
      return 'rgb(100, 50, 50)';
    case 'rgb(255, 225, 150)':
      return 'rgb(100, 70, 50)';
    case 'rgb(220, 255, 200)':
      return 'rgb(50, 80, 50)';
    case 'rgb(210, 255, 240)':
      return 'rgb(50, 80, 75)';
    case 'rgb(190, 230, 255)':
      return 'rgb(35, 50, 100)';

    case 'rgb(100, 50, 50)':
      return 'rgb(255, 200, 200)';
    case 'rgb(100, 70, 50)':
      return 'rgb(255, 225, 150)';
    case 'rgb(50, 80, 50)':
      return 'rgb(220, 255, 200)';
    case 'rgb(50, 80, 75)':
      return 'rgb(210, 255, 240)';
    case 'rgb(35, 50, 100)':
      return 'rgb(190, 230, 255)';
  }
}

// блок, изменяющий значение приоритета
let priorityValue;

Low.onchange = function () {
  priorityValue = 'Low';
}

Medium.onchange = function () {
  priorityValue = 'Medium';
}

High.onchange = function () {
  priorityValue = 'High';
}


// обработчик нажатия submit модального окна (имеет ветку создания таска и редактирования)
let editTaskData = '';

form.addEventListener('submit', (e) => {
  e.preventDefault();

  let formData = new FormData(form); 

  let modalBackdrop = document.querySelector('.modal-backdrop');
  let modal = document.querySelector('.modal');

  let date = new Date();

  //=========================================================
  // ответвление для редактирования, а не создания таска

  if (editToggle == true) {

    // editTask.innerHTML = `
    // <div class="w-100 mr-2">
    //   <div class="d-flex w-100 justify-content-between">
    //       <h5 class="title mb-1">${formData.get('inputTitle')}</h5>
    //       <div>
    //           <small class="priority mr-2">${priorityValue} priority</small>
    //           <small class="time">${editTime}</small>
    //       </div>

    //   </div>
    //   <p class="text mb-1 w-100">${formData.get('inputText')}</p>
    // </div>
    // <div class="dropdown m-2 dropleft">
    //   <button class="btn btn-secondary h-100" type="button" id="dropdownMenuItem1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    //       <i class="fas fa-ellipsis-v"></i>
    //   </button>
    //   <div class="dropdown-menu p-2 flex-column btn-block" aria-labelledby="dropdownMenuItem1">
    //       <button type="button" class="btn btn-success w-100 complete">Complete</button>
    //       <button type="button" class="btn btn-info w-100 my-2 edit" data-toggle="modal" data-target="#exampleModal">Edit</button>
    //       <button type="button" class="btn btn-danger w-100 delete">Delete</button>
    //   </div>
    // </div>`;

    // редактирование цвета:
    // определение текущей темы страницы
    if (theme == 'dark') backColor = 'DarkBack'; 
    if (theme == 'light') backColor = 'LightBack';
    
    // добавление цвета к элементу
    if (color) {
      editTaskData = `
      <li class="task list-group-item d-flex w-100 mb-2" style="border-color: ${colors[color]}; background-color: ${colors[color + backColor]}!important;">
        <div class="w-100 mr-2">
          <div class="d-flex w-100 justify-content-between">
              <h5 class="title mb-1">${formData.get('inputTitle')}</h5>
              <div>
                  <small class="priority mr-2">${priorityValue} priority</small>
                  <small class="time">${editTime}</small>
              </div>

          </div>
          <p class="text mb-1 w-100">${formData.get('inputText')}</p>
        </div>
        <div class="dropdown m-2 dropleft">
          <button class="btn btn-secondary h-100" type="button" id="dropdownMenuItem1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i class="fas fa-ellipsis-v"></i>
          </button>
          <div class="dropdown-menu p-2 flex-column btn-block" aria-labelledby="dropdownMenuItem1">
              <button type="button" class="btn btn-success w-100 complete">Complete</button>
              <button type="button" class="btn btn-info w-100 my-2 edit" data-toggle="modal" data-target="#exampleModal">Edit</button>
              <button type="button" class="btn btn-danger w-100 delete">Delete</button>
          </div>
        </div>
      </li>`;
      // editTask.setAttribute('style', `border-color: ${colors[color]}; background-color: ${colors[color + backColor]}!important;`);
    } else {
      editTaskData = `
      <li class="task list-group-item d-flex w-100 mb-2" style="${editColor}">
        <div class="w-100 mr-2">
          <div class="d-flex w-100 justify-content-between">
              <h5 class="title mb-1">${formData.get('inputTitle')}</h5>
              <div>
                  <small class="priority mr-2">${priorityValue} priority</small>
                  <small class="time">${editTime}</small>
              </div>

          </div>
          <p class="text mb-1 w-100">${formData.get('inputText')}</p>
        </div>
        <div class="dropdown m-2 dropleft">
          <button class="btn btn-secondary h-100" type="button" id="dropdownMenuItem1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i class="fas fa-ellipsis-v"></i>
          </button>
          <div class="dropdown-menu p-2 flex-column btn-block" aria-labelledby="dropdownMenuItem1">
              <button type="button" class="btn btn-success w-100 complete">Complete</button>
              <button type="button" class="btn btn-info w-100 my-2 edit" data-toggle="modal" data-target="#exampleModal">Edit</button>
              <button type="button" class="btn btn-danger w-100 delete">Delete</button>
          </div>
        </div>
      </li>`;
    }

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

    if (theme == 'dark') {
      document.body.style.backgroundColor = '#111111';
    }

    color = '';


    let tasks = document.querySelectorAll('.task');

    let currentTaskNumber;

    for (let i = 0; i < tasks.length; i++) {
      if (tasks.item(i) == editTask) {
        currentTaskNumber = i;
        break;
      }
    }

    getStorageElements(currentTaskNumber);

    setStorageElements();
    addEditButtomListener();

    return;
  }

  //=========================================================
  // создания нового таска

  getStorageElements();

  let testTask = document.createElement('li');
  toDoBlock.append(testTask);

  testTask.classList.add('task', 'list-group-item', 'd-flex', 'w-100', 'mb-2');
  testTask.innerHTML = `
  <div class="w-100 mr-2">
    <div class="d-flex w-100 justify-content-between">
        <h5 class="title mb-1">${formData.get('inputTitle')}</h5>
        <div>
            <small class="priority mr-2">${priorityValue} priority</small>
            <small class="time">${dateString(date)}</small>
        </div>

    </div>
    <p class="text mb-1 w-100">${formData.get('inputText')}</p>
  </div>
  <div class="dropdown m-2 dropleft">
    <button class="btn btn-secondary h-100" type="button" id="dropdownMenuItem1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i class="fas fa-ellipsis-v"></i>
    </button>
    <div class="dropdown-menu p-2 flex-column btn-block" aria-labelledby="dropdownMenuItem1">
        <button type="button" class="btn btn-success w-100 complete">Complete</button>
        <button type="button" class="btn btn-info w-100 my-2 edit" data-toggle="modal" data-target="#exampleModal">Edit</button>
        <button type="button" class="btn btn-danger w-100 delete">Delete</button>
    </div>
  </div>`;


  if (theme == 'dark') {
    testTask.style.background = '#353535';
    testTask.style.color = '#e5e5e5';

    backColor = 'DarkBack';
  } else if (theme == 'light') {
    backColor = 'LightBack';
  }

  if (color) {
    testTask.setAttribute('style', `border-color: ${colors[color]}; background-color: ${colors[color + backColor]}!important;`);
  }


  function dateString(date) {
    let str = '';

    if (date.getHours() < 10) {
      str += '0' + date.getHours();
    } else {
      str += date.getHours();
    }

    if (date.getMinutes() < 10) {
      str += ':' + '0' + date.getMinutes();
    } else {
      str += ':' + date.getMinutes();
    }

    if (date.getDate() < 10) {
      str += ' ' + '0' + date.getDate();
    } else {
      str += ' ' + date.getDate();
    }

    if (date.getMonth() + 1 < 10) {
      str += '.' + '0' + (date.getMonth() + 1);
    } else {
      str += '.' + (date.getMonth() + 1);
    }

    str += '.' + date.getFullYear();

    return str;
  }

  //=========================================================
  // закрытие модального окна (однако до конца не срабатывает и приходится нажать 
  // один раз вхолостую, location.reload в связке с localStorage могло бы быть неплохим решением, но чувствую, что
  // есть более чистое)
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
  
  color = '';
  if (theme == 'dark') document.body.style.backgroundColor = '#111111';
  editToggle = false;

  setStorageElements();

  addCompleteButtomListener();
  addEditButtomListener();
  addDeleteButtomListener();

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
// блок с переключателями тем страницы

let lightButton = document.getElementById('light');

lightButton.addEventListener('click', () => {
  // возврат .если тема уже светлая
  if (theme == 'light') return;

  getStorageElements();
  // блок стабильных видоизменений
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


  document.body.style.backgroundColor = '#fff';

  container.style.background = '#fff';
  container.style.color = 'black';

  navbar.classList.add("bg-light");
  navbar.style.background = '#f8f9fa';

  // блок варьируемых видоизменений
  // получение коллекции всех тасков
  let tasks = document.querySelectorAll('.task');
  
  // добавление методов массива, фильтрация тасков со стандартным цветом и изменение цвета на противоположный
  let notColoredDarkArr = Array.prototype.filter.call(tasks, function(elem){
    return elem.style.backgroundColor == 'rgb(53, 53, 53)';
  });

  for (let i = 0; i < notColoredDarkArr.length; i++) {
    notColoredDarkArr[i].style.backgroundColor = '#fff';
    notColoredDarkArr[i].style.color = 'black';
  }
  
  // добавление методов массива, фильтрация окрашенных тасков и изменение цвета на противоположный окрашенный
  let coloredDarkArr = Array.prototype.filter.call(tasks, function(elem){
    return elem.style.backgroundColor != '';
  });

  for (let i = 0; i < coloredDarkArr.length; i++) {
    tasks[i].style.backgroundColor = BackColor(tasks[i].style.backgroundColor);
  }

  // изменение цвета меню кнопок 
  let menus = document.querySelector('.dropdown-menu');

  for (let i = 0; i < menus.length; i++) {
    menus[i].style.background = '#fff';
  }

  theme = 'light';

  setStorageElements();

  setThemeColor();
});

//===========

let darkButton = document.getElementById('dark');

darkButton.addEventListener('click', darkTheme);

function darkTheme() {
  if (theme == 'dark') return;

  getStorageElements();
  // блок стабильных видоизменений
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


  document.body.style.backgroundColor = '#111111';

  container.style.backgroundColor = '#111111';
  container.style.color = '#e5e5e5';

  navbar.classList.remove("bg-light");
  navbar.style.backgroundColor = '#353535';

  // блок варьируемых видоизменений
  // получение коллекции всех тасков
  let tasks = document.querySelectorAll('.task');

  // добавление методов массива, фильтрация тасков со стандартным цветом (если цвет не определён - он белый по умолчанию, 
  // если это уже второй цикл изменения тем, он будет Белым) и изменение цвета на противоположный
  let notColoredLightArr = Array.prototype.filter.call(tasks, function(elem){
    return elem.style.backgroundColor == '' || elem.style.backgroundColor == 'rgb(255, 255, 255)';
  });

  for (let i = 0; i < notColoredLightArr.length; i++) {
    notColoredLightArr[i].style.backgroundColor = '#353535';
    notColoredLightArr[i].style.color = '#e5e5e5';
  }

  // добавление методов массива, фильтрация окрашенных тасков и изменение цвета на противоположный окрашенный
  let coloredLightArr = Array.prototype.filter.call(tasks, function(elem){
    return elem.style.backgroundColor != '';
  });

  for (let i = 0; i < coloredLightArr.length; i++) {
    tasks[i].style.backgroundColor = BackColor(tasks[i].style.backgroundColor);
  }

  // изменение цвета меню кнопок 
  let menus = document.getElementsByClassName('dropdown-menu');

  for (let i = 0; i < menus.length; i++) {
    menus[i].style.background = '#505050';
  }

  theme = 'dark';

  setStorageElements();

  setThemeColor();
}

//=========================================================
// обработчики нажатий на кнопки сортировки по датам
let upButton = document.querySelector('.up-button');

upButton.addEventListener('click', () => {

  getStorageElements();
  
  let taskList = toDoBlock.querySelectorAll('.task');
  
  if (taskList.length > 1) {
    let itemsArray = [];
    let parent = taskList[0].parentNode;

    for (let i = 0; i < taskList.length; i++) {    
      itemsArray.push(parent.removeChild(taskList[i]));
    }

    itemsArray.sort(function(taskA, taskB) {
      let timeA = taskA.querySelector('.time').textContent;
      let timeB = taskB.querySelector('.time').textContent;

      timeA = timeA.split(' ');
      timeB = timeB.split(' ');

      let hoursMinutesA = timeA[0].split(':');
      let hoursMinutesB = timeB[0].split(':');

      timeA = timeA[1].split('.');
      timeB = timeB[1].split('.');

      let dateA = new Date(timeA[2], timeA[1] - 1, timeA[0], hoursMinutesA[0], hoursMinutesA[1]);
      let dateB = new Date(timeB[2], timeB[1] - 1, timeB[0], hoursMinutesB[0], hoursMinutesB[1]);
      
      if (dateA < dateB) {
        return 1;
      }
      if (dateA > dateB) {
        return -1;
      }
      return 0;
    })
    .forEach(function(node) {
      parent.appendChild(node)
    });
  }

  //========================

  let completedBlock = document.querySelector('#completedTasks');
  let compTaskList = completedBlock.querySelectorAll('.task');

  if (compTaskList.length > 1) {

    let compItemsArray = [];
    let compParent = compTaskList[0].parentNode;

    for (let i = 0; i < compTaskList.length; i++) {    
      compItemsArray.push(compParent.removeChild(compTaskList[i]));
    }

    compItemsArray.sort(function(taskA, taskB) {
      let timeA = taskA.querySelector('.time').textContent;
      let timeB = taskB.querySelector('.time').textContent;

      timeA = timeA.split(' ');
      timeB = timeB.split(' ');

      let hoursMinutesA = timeA[0].split(':');
      let hoursMinutesB = timeB[0].split(':');

      timeA = timeA[1].split('.');
      timeB = timeB[1].split('.');

      let dateA = new Date(timeA[2], timeA[1] - 1, timeA[0], hoursMinutesA[0], hoursMinutesA[1]);
      let dateB = new Date(timeB[2], timeB[1] - 1, timeB[0], hoursMinutesB[0], hoursMinutesB[1]);
      
      if (dateA < dateB) {
        return 1;
      }
      if (dateA > dateB) {
        return -1;
      }
      return 0;
    })
    .forEach(function(node) {
      compParent.appendChild(node)
    })
  }

  setStorageElements();

})
  
//========================

let downButton = document.querySelector('.down-button');

downButton.addEventListener('click', () => {

  getStorageElements();
  
  let taskList = toDoBlock.querySelectorAll('.task');

  if (taskList.length > 1) {
    let itemsArray = [];
    let parent = taskList[0].parentNode;

    for (let i = 0; i < taskList.length; i++) {    
      itemsArray.push(parent.removeChild(taskList[i]));
    }

    itemsArray.sort(function(taskA, taskB) {
      let timeA = taskA.querySelector('.time').textContent;
      let timeB = taskB.querySelector('.time').textContent;

      timeA = timeA.split(' ');
      timeB = timeB.split(' ');

      let hoursMinutesA = timeA[0].split(':');
      let hoursMinutesB = timeB[0].split(':');

      timeA = timeA[1].split('.');
      timeB = timeB[1].split('.');

      let dateA = new Date(timeA[2], timeA[1] - 1, timeA[0], hoursMinutesA[0], hoursMinutesA[1]);
      let dateB = new Date(timeB[2], timeB[1] - 1, timeB[0], hoursMinutesB[0], hoursMinutesB[1]);
      
      if (dateA < dateB) {
        return -1;
      }
      if (dateA > dateB) {
        return 1;
      }
      return 0;
    })
    .forEach(function(node) {
      parent.appendChild(node)
    });
  }

  //========================

  let completedBlock = document.querySelector('#completedTasks');
  let compTaskList = completedBlock.querySelectorAll('.task');

  if (compTaskList.length > 1) {

    let compItemsArray = [];
    let compParent = compTaskList[0].parentNode;

    for (let i = 0; i < compTaskList.length; i++) {    
      compItemsArray.push(compParent.removeChild(compTaskList[i]));
    }

    compItemsArray.sort(function(taskA, taskB) {
      let timeA = taskA.querySelector('.time').textContent;
      let timeB = taskB.querySelector('.time').textContent;

      timeA = timeA.split(' ');
      timeB = timeB.split(' ');

      let hoursMinutesA = timeA[0].split(':');
      let hoursMinutesB = timeB[0].split(':');

      timeA = timeA[1].split('.');
      timeB = timeB[1].split('.');

      let dateA = new Date(timeA[2], timeA[1] - 1, timeA[0], hoursMinutesA[0], hoursMinutesA[1]);
      let dateB = new Date(timeB[2], timeB[1] - 1, timeB[0], hoursMinutesB[0], hoursMinutesB[1]);
      
      if (dateA < dateB) {
        return -1;
      }
      if (dateA > dateB) {
        return 1;
      }
      return 0;
    })
    .forEach(function(node) {
      compParent.appendChild(node)
    })
  }

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
// обработчик событий кнопки переноса таска в статус завершённых
function addCompleteButtomListener() {
  let completeButton = document.querySelectorAll('.complete');

  completeButton.forEach(function(btn) {

    btn.addEventListener('click', () => {
      
      let task = btn.closest(".task");

      btn.nextElementSibling.remove();
      btn.remove();

      let completedBlock = document.querySelector('#completedTasks');

      task.classList.add('completed');

      let tasks = document.querySelectorAll('.task');

      let currentTaskNumber;

      for (let i = 0; i < tasks.length; i++) {
        if (tasks.item(i) == task) {
          currentTaskNumber = i;
          alert (i);
          break;
        }
      }

      getStorageElements(currentTaskNumber);

      completedBlock.appendChild(task);

      setStorageElements();

      toDoCounter();
      completedCounter();
    });
  })
}

//===========
// обработчик событий кнопки редактирования
function addEditButtomListener() {
  let editButton = document.querySelectorAll('.edit');

  editButton.forEach(function(btn) {

    btn.addEventListener('click', () => {

      let form = document.querySelector('#form1');
      editTask = btn.closest(".task");

      let title = editTask.querySelector('.title');
      let editTitleText = title.textContent;

      let inputTitle = form.querySelector('#inputTitle');
      inputTitle.setAttribute('value', editTitleText);


      let text = editTask.querySelector('.text');
      let editTextContent = text.textContent;

      let inputText = form.querySelector('#inputText');
      inputText.setAttribute('value', editTextContent);


      let priority = editTask.querySelector('.priority');
      let arr = priority.textContent.split(' ');

      
      editTime = editTask.querySelector('.time').textContent;
      editColor = editTask.getAttribute('style');


      switch (arr[0]) {
        case 'Low':
          let lowPriority = form.querySelector('.low');
          lowPriority.setAttribute('checked','');

          priorityValue = 'Low';
          break;
        case 'Medium':
          let mediumPriority = form.querySelector('.medium');
          mediumPriority.setAttribute('checked','');

          priorityValue = 'Medium';
          break;
        case 'High':
          let highPriority = form.querySelector('.high');
          highPriority.setAttribute('checked','');

          priorityValue = 'High';
          break;
      }
      
      // в закрытия формы по нажатию на "фон" modal, рычаг редактирования выключается
      // let modal = document.querySelector('.modal-backdrop');
      // modal.addEventListener('click', () => {
      //   color = '';
      //   // editToggle = false;
      // })

      let modalTitle = document.querySelector('#exampleModalLabel');
      modalTitle.textContent = 'Edit task';

      let modalButton = document.querySelector('#submit');
      modalButton.textContent = 'Edit task';

      editToggle = true;
    });
  })
}

//===========
// обработчик событий кнопки удаления
function addDeleteButtomListener() {
  let deleteButton = document.querySelectorAll('.delete');

  deleteButton.forEach(function(btn) {

    btn.addEventListener('click', () => {
      let task = btn.closest(".task");

      let tasks = document.querySelectorAll('.task');

      let currentTaskNumber;

      for (let i = 0; i < tasks.length; i++) {
        if (tasks.item(i) == task) {
          currentTaskNumber = i;
          break;
        }
      }

      getStorageElements(currentTaskNumber);

      setStorageElements();

      toDoCounter();
      completedCounter();
    });
  })
}

//=========================================================
// Счётчики текущих и завершённых тасков, запускаются при любых добавлениях, удалениях и перемешениях из категорий таксов
function toDoCounter() {
  
  let tasksAmount = toDoBlock.querySelectorAll('.task').length;
  
  let toDoTitle = document.querySelector('#to-do-title');

  toDoTitle.textContent = `ToDo (${tasksAmount})`;
}

function completedCounter() {
  let completedBlock = document.querySelector('#completedTasks');
  let tasksAmount = completedBlock.querySelectorAll('.completed').length;
  
  let completedTitle = document.querySelector('#completed-title');

  completedTitle.textContent = `Completed (${tasksAmount})`;
}

//=========================================================

let colorBtns = document.querySelectorAll('.color-check');

colorBtns.forEach(function(btn) {

  btn.addEventListener('click', () => {
    let radio = btn.querySelector('input');
    radio.setAttribute('checked','');
  });
})



//=========================================================
// localStorage

function getStorageElements(delTaskNum) {

  if (!localStorage.getItem('pageStorage')) return;

  let completedBlock = document.querySelector('#completedTasks');

  toDoBlock.innerHTML = '';
  completedBlock.innerHTML = '';

  let pageStorage = JSON.parse(localStorage.getItem('pageStorage'));

  for (let i = 0; i < pageStorage.length; i++) {

    if (i == delTaskNum && editTaskData != '') {
      let newTask = document.createElement('li');
      toDoBlock.append(newTask);

      newTask.outerHTML = editTaskData;

      editTaskData = '';
      continue;
    }

    if (i == delTaskNum) continue;
    
    if (pageStorage[i] == undefined) return;

    let obj = pageStorage[i][0];

    if (obj['place'] == 'toDo') {

      let newTask = document.createElement('li');
      toDoBlock.append(newTask);

      newTask.classList.add('task', 'list-group-item', 'd-flex', 'w-100', 'mb-2');
      newTask.innerHTML = `
      <div class="w-100 mr-2">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="title mb-1">${obj.title}</h5>
            <div>
                <small class="priority mr-2">${obj.priority} priority</small>
                <small class="time">${obj.time}</small>
            </div>

        </div>
        <p class="text mb-1 w-100">${obj.text}</p>
      </div>
      <div class="dropdown m-2 dropleft">
        <button class="btn btn-secondary h-100" type="button" id="dropdownMenuItem1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="fas fa-ellipsis-v"></i>
        </button>
        <div class="dropdown-menu p-2 flex-column btn-block" aria-labelledby="dropdownMenuItem1">
            <button type="button" class="btn btn-success w-100 complete">Complete</button>
            <button type="button" class="btn btn-info w-100 my-2 edit" data-toggle="modal" data-target="#exampleModal">Edit</button>
            <button type="button" class="btn btn-danger w-100 delete">Delete</button>
        </div>
      </div>`;

      if (obj.style) {
        newTask.setAttribute('style', obj.style);
      }

      continue;

    } 
    
    if (obj['place'] == 'completed') {

      let newTask = document.createElement('li');
      completedBlock.append(newTask);

      newTask.classList.add('task', 'list-group-item', 'd-flex', 'w-100', 'mb-2', 'completed');
      newTask.innerHTML = `
      <div class="w-100 mr-2">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="title mb-1">${obj.title}</h5>
            <div>
                <small class="priority mr-2">${obj.priority} priority</small>
                <small class="time">${obj.time}</small>
            </div>

        </div>
        <p class="text mb-1 w-100">${obj.text}</p>
      </div>
      <div class="dropdown m-2 dropleft">
        <button class="btn btn-secondary h-100" type="button" id="dropdownMenuItem1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="fas fa-ellipsis-v"></i>
        </button>
        <div class="dropdown-menu p-2 flex-column btn-block" aria-labelledby="dropdownMenuItem1">
            <button type="button" class="btn btn-danger w-100 delete">Delete</button>
        </div>
      </div>`;

      if (obj.style) {
        newTask.setAttribute('style', obj.style);
      }
    }
  }


  addCompleteButtomListener();
  addEditButtomListener();
  addDeleteButtomListener();
}


window.addEventListener('unload', setStorageElements);

function setStorageElements() {

  localStorage.removeItem('pageStorage');

  let tasks = document.querySelectorAll('.task');
  let pageStorage = [];

  for (let i = 0; i < tasks.length; i++) {

    let place = '';

    if (tasks[i].classList.contains('completed')) {
      place = 'completed';
    } else {
      place = 'toDo';
    }


    let taskPriorityValue;
    let priority = tasks[i].querySelector('.priority');
    let priorityArr = priority.textContent.split(' ');

    switch (priorityArr[0]) {
      case 'Low':

        taskPriorityValue = 'Low';
        break;

      case 'Medium':

        taskPriorityValue = 'Medium';
        break;

      case 'High':

        taskPriorityValue = 'High';
        break;
    }


    let taskStorage = {
      "place": place,
      "title": tasks[i].querySelector('.title').textContent,
      "priority": taskPriorityValue,
      "time": tasks[i].querySelector('.time').textContent,
      "text": tasks[i].querySelector('.text').textContent,
    };

    
    if (tasks[i].getAttribute('style')) {
      taskStorage.style = tasks[i].getAttribute('style');
    };

    pageStorage.push([taskStorage]);
  }

  localStorage.setItem('pageStorage', JSON.stringify(pageStorage));
}


window.addEventListener('unload', setThemeColor());

function setThemeColor() {
  localStorage.setItem('theme', theme);
}

