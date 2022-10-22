// блок активных тасков и блок формыgetStorageElements()
let toDoBlock = document.querySelector('#currentTasks');
let form = document.querySelector('#form1');

// рычаг для переключения поведения результатов формы при отправки, когда он включен, элемент редактируется, когда выключен, создаётся новый
// включение происходит по нажатию одной из кнопок Edit
let editToggle = false;

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


// функция для загрузки информации из localStorage
// getStorageElements();

// переменная хранит информацию о том, какой именно таск редактируется 
let editTask;

//=========================================================
// переменная с информацией о теме, изначально светлая
let theme = 'light';

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
let colorSelect = document.getElementById('colors');
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
form.addEventListener('submit', (e) => {
  e.preventDefault();

  let formData = new FormData(form); 

  let modalBackdrop = document.querySelector('.modal-backdrop');
  let modal = document.querySelector('.modal');

  //=========================================================
  // ответвление для редактирования, а не создания таска

  if (editToggle == true) {
    
    // редактирование тайтла
    let title = editTask.querySelector('.title');
    title.textContent = formData.get('inputTitle');

    // редактирование текста
    let text = editTask.querySelector('.text');
    text.textContent = formData.get('inputText');

    // редактирование цвета:
    // определение текущей темы страницы
    if (theme == 'dark') backColor = 'DarkBack'; 
    if (theme == 'light') backColor = 'LightBack';
    
    // добавление цвета к элементу
    if (color) {
      editTask.setAttribute('style', `border-color: ${colors[color]}; background-color: ${colors[color + backColor]}!important;`);
    }

    // редактирование приоритета
    let priorityText = editTask.querySelector('.priority')
    priorityText.innerHTML = `${priorityValue} priority`;

    //===========
    // блок для очистки данных полей после отправки формы
    let inputTitle = form.querySelector('#inputTitle');
    let inputText = form.querySelector('#inputText');

    let lowPriority = form.querySelector('.low');
    let mediumPriority = form.querySelector('.medium');
    let highPriority = form.querySelector('.high');


    inputTitle.removeAttribute('value');
    inputText.removeAttribute('value');

    lowPriority.removeAttribute('checked');
    mediumPriority.removeAttribute('checked');
    highPriority.removeAttribute('checked');

    // отключение "рычага" редактирования, чтобы следующий вызов модального окна шёл по ветке создания таска (если только
    // не будет нажата кнопка edit, тогда "рычаг" опять включится
    editToggle = false;

    //===========
    // блок закрытия модального окна
    modalBackdrop.remove();  
    modal.classList.remove('show');

    setTimeout(modalRemove(modal), 500);

    // location.reload();
    // плохое решение проблемы с неработающими событиями после нажатия кнопки submit 
    // при создании нового элемента или редактирования сторого

    return;
  }

  //=========================================================
  // создания нового таска

  let newTask = document.createElement('li');
  newTask.classList.add('task', 'list-group-item', 'd-flex', 'w-100', 'mb-2');

  //===========
  // блок, задающий цвет границы, шрифта, бэка кнопок и заливки элемента, исходя из темы и выбранного цвета
  if (theme == 'dark') {
    newTask.style.background = '#353535';
    newTask.style.color = '#e5e5e5';

    backColor = 'DarkBack';
  } else if (theme == 'light') {
    backColor = 'LightBack';
  }

  if (color) {
    newTask.setAttribute('style', `border-color: ${colors[color]}; background-color: ${colors[color + backColor]}!important;`);
  }



    let main = document.createElement('div');
    main.classList.add('w-100', 'mr-2');

    newTask.append(main);



      let mainTitleBlock = document.createElement('div');
      mainTitleBlock.classList.add('d-flex', 'w-100', 'justify-content-between');

      main.append(mainTitleBlock);



        let mainTitle = document.createElement('h5');
        mainTitle.classList.add('title', 'mb-1');  

        // достаём текст заголовка из формы
        mainTitle.textContent = formData.get('inputTitle');

        mainTitleBlock.append(mainTitle);

        //=========================================================

        let mainInfoBlock = document.createElement('div');
        mainTitleBlock.append(mainInfoBlock);



            let mainPriority = document.createElement('small');
            mainPriority.classList.add('priority', 'mr-2');

            // достаём значение приоритета из формы (с помощью внешней переменной)
            mainPriority.innerHTML = `${priorityValue} priority`;

            mainInfoBlock.append(mainPriority);

            //=========================================================

            let mainDate = document.createElement('small');

            // блок определения времени и преобразования его в нужный формат
            let date = new Date();

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

            mainDate.innerHTML = `${dateString(date)}`;
            mainDate.classList.add('time');

            mainInfoBlock.append(mainDate);
      
      //=========================================================      

      let mainText = document.createElement('p');
      mainText.classList.add('text', 'mb-1', 'w-100');

      // достаём текст из формы
      mainText.textContent = formData.get('inputText');

      main.append(mainText);

    //=========================================================        

    let dropdown = document.createElement('div');
    dropdown.classList.add('dropdown', 'm-2', 'dropleft');
    newTask.append(dropdown);



      // блок, создающий кнопки 
      let dropdownButton = document.createElement('button');
      dropdownButton.classList.add('btn', 'btn-secondary', 'h-100');

      dropdownButton.setAttribute('type', 'button');
      dropdownButton.setAttribute('id', 'dropdownMenuItem1');
      dropdownButton.setAttribute('data-toggle', 'dropdown');
      dropdownButton.setAttribute('aria-haspopup', 'true');
      dropdownButton.setAttribute('aria-expanded', 'true');

      dropdown.append(dropdownButton);



        let dropdownPoints = document.createElement('i');
        dropdownPoints.classList.add('fas', 'fa-ellipsis-v');
        dropdownButton.append(dropdownPoints);

      //=========================================================

      let dropdownMenu = document.createElement('div');
      dropdownMenu.classList.add('dropdown-menu', 'p-2', 'flex-column');

      dropdownMenu.setAttribute('aria-labelledby', 'dropdownMenuItem1');
      dropdownMenu.setAttribute('style', 'position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-162px, 0px, 0px);');

      if (theme == 'dark') dropdownMenu.style.background = '#505050';
    
      dropdown.append(dropdownMenu);


        // кнопка complete
        let dropdownComplete = document.createElement('button');
        dropdownComplete.classList.add('btn', 'btn-success', 'w-100', 'complete');

        dropdownComplete.innerHTML = 'Complete';
        dropdownMenu.append(dropdownComplete);



        // кнопка edit
        let dropdownEdit = document.createElement('button');
        dropdownEdit.classList.add('btn', 'btn-info', 'w-100', 'my-2', 'edit');
        dropdownEdit.setAttribute('data-toggle', 'modal');
        dropdownEdit.setAttribute('data-target', '#exampleModal');

        dropdownEdit.innerHTML = 'Edit';
        dropdownMenu.append(dropdownEdit);


        
        // кнопка delete
        let dropdownDelete = document.createElement('button');
        dropdownDelete.classList.add('btn', 'btn-danger', 'w-100', 'delete');

        dropdownDelete.innerHTML = 'Delete';
        dropdownMenu.append(dropdownDelete);



  toDoBlock.append(newTask);

  //=========================================================
  // закрытие модального окна (однако до конца не срабатывает и приходится нажать 
  // один раз вхолостую, location.reload в связке с localStorage могло бы быть неплохим решением, но чувствую, что
  // есть более чистое)
  modalBackdrop.remove();  
  modal.classList.remove('show');

  // с setом хотя бы меняется курсор, но клик всё равно холостой)
  setTimeout(modalRemove(modal), 500);

  // location.reload();

  //=========================================================
  // блок для очистки данных полей после отправки формы
  let inputTitle = form.querySelector('#inputTitle');
  let inputText = form.querySelector('#inputText');

  let lowPriority = form.querySelector('.low');
  let mediumPriority = form.querySelector('.medium');
  let highPriority = form.querySelector('.high');


  inputTitle.setAttribute('value', '');
  inputText.setAttribute('value', '');

  lowPriority.removeAttribute('checked');
  mediumPriority.removeAttribute('checked');
  highPriority.removeAttribute('checked');

  
  color = '';
  if (theme == 'dark') document.body.style.backgroundColor = '#111111';
  editToggle = false;

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

  // блок стабильных видоизменений
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
});

//===========

let darkButton = document.getElementById('dark');

darkButton.addEventListener('click', () => {
  // возврат, если тема уже тёмная
  if (theme == 'dark') return;

  // блок стабильных видоизменений
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
});

//=========================================================
// обработчики нажатий на кнопки сортировки по датам
let upButton = document.querySelector('.up-button');

upButton.addEventListener('click', () => {
  
  let taskList = toDoBlock.querySelectorAll('.task');
  
  if (taskList.length < 2) return;

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
})



let downButton = document.querySelector('.down-button');

downButton.addEventListener('click', () => {
  
  let taskList = toDoBlock.querySelectorAll('.task');
  

  if (taskList.length < 2) return;

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
})

//=========================================================
// обработчик, изменяющий такст заголовка и кнопки модального окна, если идёт процесс создания нового элемента
let addTaskButton = document.querySelector('#addTaskButton');

addTaskButton.addEventListener('click', () => {
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
      let completedBlock = document.querySelector('#completedTasks');

      task.classList.add('completed');
      completedBlock.appendChild(task);

      btn.nextElementSibling.remove();
      btn.remove();

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


      switch (arr[0]) {
        case 'Low':
          let lowPriority = form.querySelector('.low');
          lowPriority.setAttribute('checked','');

          priorityValue = 'Low';
          break;
        case 'Medium':
          let mediumPriority = form.querySelector('.medium');
          mediumPriority.setAttribute('checked','');

          priorityValue = 'Madium';
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
      task.remove();

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
// localStorage

// function getStorageElements() {

//   if (!localStorage.getItem('toDoStorage')) return;

//   let toDoBlock = document.querySelector('#currentTasks');
//   toDoBlock.outerHTML = localStorage.getItem('toDoStorage');

//   let completedBlock = document.querySelector('#completedTasks');
//   completedBlock.outerHTML = localStorage.getItem('completedStorage');
// }


// window.addEventListener('unload', () => {
//   localStorage.clear();

//   let toDoStorage = document.querySelector('#currentTasks');
//   localStorage.setItem('toDoStorage', toDoStorage.outerHTML);

//   let completedStorage = document.querySelector('#completedTasks');
//   localStorage.setItem('completedStorage', completedStorage.outerHTML);
// })










    
