// Get elements from HTML
const todoInput = document.getElementById('todoInput');
const dueDateInput = document.getElementById('dueDateInput');
const priorityInput = document.getElementById('priorityInput');
const categoryInput = document.getElementById('categoryInput');
const addBtn = document.getElementById('addBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const categoryFilter = document.getElementById('categoryFilter');
const sortSelect = document.getElementById('sortSelect');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const filterBtns = document.querySelectorAll('.filter-btn');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');

// Load todos from localStorage (or start with empty array)
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';
let selectedCategory = 'all';
let currentSort = 'newest';
let editingTodoId = null;

// ===== EVENT LISTENERS =====
addBtn.addEventListener('click', addTodo);
clearAllBtn.addEventListener('click', clearAllTodos);
categoryFilter.addEventListener('change', (e) => {
  selectedCategory = e.target.value;
  renderTodos();
});
sortSelect.addEventListener('change', (e) => {
  currentSort = e.target.value;
  renderTodos();
});

todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

// ===== FUNCTIONS =====
function addTodo() {
  const text = todoInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = priorityInput.value;
  const category = categoryInput.value.trim();

  if (text === '') {
    alert('Please enter a todo!');
    return;
  }

  const todo = {
    id: Date.now(),
    text: text,
    dueDate: dueDate || null,
    priority: priority || 'medium',
    category: category || 'General',
    completed: false,
    createdAt: new Date().toLocaleString()
  };

  todos.push(todo);
  saveTodos();

  todoInput.value = '';
  dueDateInput.value = '';
  priorityInput.value = 'medium';
  categoryInput.value = '';
  todoInput.focus();

  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  if (editingTodoId === id) editingTodoId = null;
  saveTodos();
  renderTodos();
}

function clearAllTodos() {
  if (todos.length === 0) return;
  if (!confirm('Delete all todos?')) return;

  todos = [];
  editingTodoId = null;
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;

  todo.completed = !todo.completed;
  saveTodos();
  renderTodos();
}

function editTodo(id) {
  editingTodoId = id;
  renderTodos();
}

function saveTodoEdit(id) {
  const todo = todos.find((t) => t.id === id);
  const input = document.getElementById(`editInput-${id}`);
  if (!todo || !input) return;

  const updatedText = input.value.trim();
  if (updatedText === '') {
    alert('Todo text cannot be empty.');
    return;
  }

  todo.text = updatedText;
  editingTodoId = null;
  saveTodos();
  renderTodos();
}

function cancelTodoEdit() {
  editingTodoId = null;
  renderTodos();
}

function getPriorityWeight(priority) {
  const map = { high: 3, medium: 2, low: 1 };
  return map[priority] || 2;
}

function renderTodos() {
  todoList.innerHTML = '';

  let filteredTodos = [...todos];
  if (currentFilter === 'active') {
    filteredTodos = filteredTodos.filter((t) => !t.completed);
  } else if (currentFilter === 'completed') {
    filteredTodos = filteredTodos.filter((t) => t.completed);
  }

  if (selectedCategory !== 'all') {
    filteredTodos = filteredTodos.filter((t) => (t.category || 'General') === selectedCategory);
  }

  if (currentSort === 'oldest') {
    filteredTodos.sort((a, b) => a.id - b.id);
  } else if (currentSort === 'priority') {
    filteredTodos.sort((a, b) => getPriorityWeight(b.priority) - getPriorityWeight(a.priority));
  } else if (currentSort === 'dueDate') {
    filteredTodos.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    });
  } else {
    filteredTodos.sort((a, b) => b.id - a.id);
  }

  emptyState.classList.toggle('show', filteredTodos.length === 0);

  filteredTodos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.completed ? ' completed' : '');

    const safePriority = ['high', 'medium', 'low'].includes(todo.priority) ? todo.priority : 'medium';
    const dueDateLabel = todo.dueDate ? `Due: ${escapeHtml(todo.dueDate)}` : 'No due date';
    const isEditing = editingTodoId === todo.id;

    const todoMain = isEditing
      ? `<input id="editInput-${todo.id}" class="edit-input" type="text" value="${escapeHtml(todo.text)}">`
      : `<span class="todo-text">${escapeHtml(todo.text)}</span>`;

    const todoActions = isEditing
      ? `<div class="todo-actions">
          <button class="save-btn" onclick="saveTodoEdit(${todo.id})">Save</button>
          <button class="cancel-btn" onclick="cancelTodoEdit()">Cancel</button>
        </div>`
      : `<div class="todo-actions">
          <button class="edit-btn" onclick="editTodo(${todo.id})">Edit</button>
          <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
        </div>`;

    li.innerHTML = `
      <input
        type="checkbox"
        class="todo-checkbox"
        ${todo.completed ? 'checked' : ''}
        onchange="toggleTodo(${todo.id})"
      >
      <div class="todo-content">
        ${todoMain}
        <div class="todo-meta">
          <span>${dueDateLabel}</span>
          <span class="priority-badge priority-${safePriority}">Priority: ${escapeHtml(safePriority)}</span>
          <span>Category: ${escapeHtml(todo.category || 'General')}</span>
        </div>
      </div>
      ${todoActions}
    `;

    todoList.appendChild(li);

    if (isEditing) {
      const input = li.querySelector('.edit-input');
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveTodoEdit(todo.id);
        if (e.key === 'Escape') cancelTodoEdit();
      });
    }
  });

  updateCategoryFilterOptions();
  updateStats();
}

function updateCategoryFilterOptions() {
  const categories = [...new Set(todos.map((t) => (t.category || 'General').trim()))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  const options = ['<option value="all">All Categories</option>']
    .concat(
      categories.map((category) => {
        const selected = selectedCategory === category ? 'selected' : '';
        return `<option value="${escapeHtml(category)}" ${selected}>${escapeHtml(category)}</option>`;
      })
    )
    .join('');

  categoryFilter.innerHTML = options;

  if (selectedCategory !== 'all' && !categories.includes(selectedCategory)) {
    selectedCategory = 'all';
    categoryFilter.value = 'all';
  }
}

function updateStats() {
  totalCount.textContent = todos.length;
  completedCount.textContent = todos.filter((t) => t.completed).length;
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

renderTodos();
