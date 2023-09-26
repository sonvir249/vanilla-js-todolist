// Selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOptions = document.querySelector('.filter-todo');

// Event Listeners
document.addEventListener('DOMContentLoaded', renderTodos);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', todoActions);
filterOptions.addEventListener('change', filterTodo);

/**
 * Helper function to add todo.
 *
 * @param {*} event
 */
function addTodo(event) {
  const noTodoText = document.querySelector('.notodo-text');
  // Prevent from form submit.
  event.preventDefault();
  // Create todo div
  const todoDiv = document.createElement('div');
  todoDiv.classList.add('todo');
  // create li
  const newTodo = document.createElement('li');
  newTodo.innerText = todoInput.value;
  newTodo.classList.add('todo-item');
  todoDiv.appendChild(newTodo);

  // Save todos in local storage.
  let todoData = {};
  todoData['todoName'] = todoInput.value;
  todoData['status'] = false;
  saveLocalTodos(todoData);

  // check mark button
  const completedButton = document.createElement('button');
  completedButton.innerHTML = '<li class="fas fa-check"></li>';
  completedButton.classList.add('complete-btn');
  todoDiv.appendChild(completedButton);

  // trash button
  const trashButton = document.createElement('button');
  trashButton.innerHTML = '<li class="fas fa-trash"></li>';
  trashButton.classList.add('trash-btn');
  todoDiv.appendChild(trashButton);

  // Append to list
  todoList.appendChild(todoDiv);
  if(noTodoText) {
    noTodoText.style.display = 'none';
  }

  // Clear input value.
  todoInput.value = '';
}

function todoActions(event) {
  const item = event.target;
  const todo = item.parentElement;

  // Delete todo
  if (item.classList[0] === 'trash-btn') {
    todo.classList.add('fall');
    removeLocalTodos(todo);
    todo.addEventListener("transitionend", function() {
      todo.remove();
    });
  }

  // Check todo
  if (item.classList[0] === 'complete-btn') {
    updateCompletedLocalTodos(todo);
    todo.classList.toggle('completed');
  }

  let todos = fetchLocalStorageTodos();
  // Display heading when all todos are deleted.
  if (todos.length === 0) {
    const noTodotext = createNoTodoHeading();
    noTodotext.style.display = 'block';
    setTimeout(() => {
      todoList.appendChild(noTodotext);
    }, "600");
  }
}


/**
 * filter todos.
 *
 * @param {*} event
 */
function filterTodo(event) {
  const todos = todoList.childNodes;
  todos.forEach(function(todo) {
    switch(event.target.value) {
      case "all":
        todo.style.display = 'flex';
        break;
      case "completed":
        if(todo.classList.contains('completed')) {
          todo.style.display = 'flex';
        } else {
          todo.style.display = 'none';
        }
        break;
      case "uncompleted":
        if(!todo.classList.contains('completed')) {
          todo.style.display = 'flex';
        } else {
          todo.style.display = 'none';
        }
        break;
    }
  })
}

/**
 * Helper method to save todos.
 *
 * @param {*} todo
 */
function saveLocalTodos(todo) {
  let todos = fetchLocalStorageTodos();
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

/**
 * Get all todos.
 */
function renderTodos() {
  let todos = fetchLocalStorageTodos();
  let todoDiv;
  if (todos.length > 0) {
    todos.forEach(function(todo) {
      // Create todo div
      todoDiv = document.createElement('div');
      todoDiv.classList.add('todo');
      if(todo.status) {
        todoDiv.classList.add('completed');
      }
      // create li
      const newTodo = document.createElement('li');
      newTodo.innerText = todo.todoName;
      newTodo.classList.add('todo-item');
      todoDiv.appendChild(newTodo);

      // check mark button
      const completedButton = document.createElement('button');
      completedButton.innerHTML = '<li class="fas fa-check"></li>';
      completedButton.classList.add('complete-btn');
      todoDiv.appendChild(completedButton);

      // trash button
      const trashButton = document.createElement('button');
      trashButton.innerHTML = '<li class="fas fa-trash"></li>';
      trashButton.classList.add('trash-btn');
      todoDiv.appendChild(trashButton);

      // Append to list
      todoList.appendChild(todoDiv);
    });
  } else {
    // Append to list
    todoList.appendChild(createNoTodoHeading());
  }
}

/**
 * Create H2 element.
 */
function createNoTodoHeading() {
  let noTodoHeading = document.createElement('h2');
  noTodoHeading.classList.add('notodo-text');
  noTodoHeading.innerText = "Create your todo list.";
  return noTodoHeading;
}

/**
 * Delete todos.
 *
 * @param {*} todo
 */
function removeLocalTodos(todo) {
  let todos = fetchLocalStorageTodos();
  let todoIndex;
  todoText = todo.children[0].innerText;
  todos.map(function(todo, i){
    if (todo.todoName === todoText) {
      todoIndex = i;
    }
  });

  todos.splice(todos.indexOf(todoIndex), 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

/**
 * Helper function to update completed todos status.
 *
 * @param {*} todo
 */
function updateCompletedLocalTodos(todo) {
  let todos = fetchLocalStorageTodos();
  todoText = todo.children[0].innerText;
  todos.map(function(todo, i){
    if (todo.todoName === todoText) {
      todo.status = true;
    }
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}

/**
 * Helper function to get todos.
 *
 * @returns
 */
function fetchLocalStorageTodos() {
  let todos;
  // check - existing
  if(localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  return todos;
}
