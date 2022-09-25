let form = document.getElementById('form1');

let currentTasks = document.getElementById('currentTasks');

let newTask = document.createElement('li');
newTask.classList.add('list-group-item', 'd-flex', 'w-100', 'mb-2');
// newTask.style.background = 'red';



  let main = document.createElement('div');
  main.classList.add('w-100', 'mr-2');

  newTask.append(main);



    let main_titleBlock = document.createElement('div');
    main_titleBlock.classList.add('d-flex', 'w-100', 'justify-content-between');

    main.append(main_titleBlock);



      let main_title = document.createElement('h5');
      main_title.classList.add('mb-1');  

      form.addEventListener('submit', (e) => {
        // e.preventDefault();

        let formData = new FormData(form); 
        main_title.innerHTML = formData.get('inputTitle');
      });

      main_titleBlock.append(main_title);

      //=========================================================

      let main_infoBlock = document.createElement('div');
      main_titleBlock.append(main_infoBlock);



          let main_priority = document.createElement('small');
          main_priority.classList.add('mr-2');

          let priorityValue = '';

          Low.onchange = function () {
            priorityValue = 'Low';
          }

          Medium.onchange = function () {
            priorityValue = 'Medium';
          }

          High.onchange = function () {
            priorityValue = 'High';
          }

          form.addEventListener('submit', (e) => {
            // e.preventDefault();
    
            main_priority.innerHTML = `${priorityValue} priority`;
          });

          main_infoBlock.append(main_priority);

          //=========================================================

          let main_date = document.createElement('small');

          form.addEventListener('submit', (e) => {
            // e.preventDefault();

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

              if (date.getMonth() < 10) {
                str += '.' + '0' + date.getMonth();
              } else {
                str += '.' + date.getMonth();
              }

              str += '.' + date.getFullYear();

              return str;
            }

            main_date.innerHTML = `${dateString(date)}`;
          });

          main_infoBlock.append(main_date);
    
    //=========================================================      

    let main_text = document.createElement('p');
    main_text.classList.add('mb-1', 'w-100');

    form.addEventListener('submit', (e) => {
      // e.preventDefault();

      let formData = new FormData(form); 
      main_text.innerHTML = formData.get('inputText');
    });

    main.append(main_text);

  //=========================================================        

  let dropdown = document.createElement('div');
  dropdown.classList.add('dropdown', 'm-2', 'dropleft');
  newTask.append(dropdown);



    let dropdown_button = document.createElement('button');
    dropdown_button.classList.add('btn', 'btn-secondary', 'h-100');

    dropdown_button.setAttribute('type', 'button');
    dropdown_button.setAttribute('id', 'dropdownMenuItem1');
    dropdown_button.setAttribute('data-toggle', 'dropdown');
    dropdown_button.setAttribute('aria-haspopup', 'true');
    dropdown_button.setAttribute('aria-expanded', 'true');

    dropdown.append(dropdown_button);



      let dropdown_points = document.createElement('i');
      dropdown_points.classList.add('fas', 'fa-ellipsis-v');
      dropdown_button.append(dropdown_points);

    //=========================================================

    let dropdown_menu = document.createElement('div');
    dropdown_menu.classList.add('dropdown-menu', 'p-2', 'flex-column');

    dropdown_menu.setAttribute('aria-labelledby', 'dropdownMenuItem1');
    dropdown_menu.setAttribute('style', 'position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-162px, 0px, 0px);');

    dropdown.append(dropdown_menu);



      let dropdown_complete = document.createElement('button');
      dropdown_complete.classList.add('btn', 'btn-success', 'w-100');

      dropdown_complete.innerHTML = 'Complete';
      dropdown_menu.append(dropdown_complete);



      let dropdown_edit = document.createElement('button');
      dropdown_edit.classList.add('btn', 'btn-info', 'w-100', 'my-2');

      dropdown_edit.innerHTML = 'Edit';
      dropdown_menu.append(dropdown_edit);



        
        // <button type="button" class="btn btn-primary">Главный</button>
        // <button type="button" class="btn btn-secondary">Вторичный</button>
        // <button type="button" class="btn btn-success">Успех</button>
        // <button type="button" class="btn btn-danger">Опасность</button>
        // <button type="button" class="btn btn-warning">Предупреждение</button>
        // <button type="button" class="btn btn-info">Инфо</button>
        // <button type="button" class="btn btn-light">Светлый</button>
        // <button type="button" class="btn btn-dark">Темный</button>



      let dropdown_delete = document.createElement('button');
      dropdown_delete.classList.add('btn', 'btn-danger', 'w-100');

      dropdown_delete.innerHTML = 'Delete';
      dropdown_menu.append(dropdown_delete);



// currentTasks.append(newTask);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  currentTasks.append(newTask);
});

    
