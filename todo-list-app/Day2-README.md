# 📝 DAY 2: INTERACTIVE TODO APP
## Your First JavaScript Project!

---

## 🎯 WHAT YOU'LL BUILD

A fully functional Todo app where you can:
- ✅ Add new todos
- ✅ Mark todos as complete/incomplete
- ✅ Delete todos
- ✅ Filter (All, Active, Completed)
- ✅ Stats (total and completed count)
- ✅ Saves data automatically (localStorage)

---

## 📥 DOWNLOAD 3 FILES

1. **Day2-index.html** - The HTML structure
2. **Day2-style.css** - The styling
3. **Day2-script.js** - The JavaScript logic

---

## 🔧 SETUP INSTRUCTIONS

### Step 1: Create a new folder
In your Documents, create a folder called `todo-app`:
```
Documents/todo-app/
```

### Step 2: Download the 3 files
Download all three files and put them in the `todo-app/` folder.

### Step 3: Rename the files
- `Day2-index.html` → `index.html`
- `Day2-style.css` → `style.css`
- `Day2-script.js` → `script.js`

### Step 4: Your folder should look like:
```
Documents/todo-app/
├── index.html
├── style.css
└── script.js
```

### Step 5: Open in browser
Double-click `index.html` to open in Safari.

---

## 🎨 WHAT YOU'LL SEE

- Beautiful purple gradient background
- Input field to add todos
- Filter buttons (All, Active, Completed)
- List of todos with checkboxes and delete buttons
- Statistics at the bottom

---

## 🎮 HOW TO USE IT

1. **Type a todo** in the input field
2. **Press Enter or click "Add"** to add it
3. **Check the box** to mark as complete
4. **Click "Delete"** to remove it
5. **Click filter buttons** to see different todos
6. **Close and reopen** - todos are saved!

---

## 💡 KEY FEATURES EXPLAINED

### 1. Add Todo
```javascript
// When you click Add or press Enter
function addTodo() {
  // Get the text you typed
  const text = todoInput.value.trim();
  
  // Create a todo object
  const todo = {
    id: Date.now(),
    text: text,
    completed: false
  };
  
  // Add to array
  todos.push(todo);
}
```

### 2. Delete Todo
```javascript
// When you click delete button
function deleteTodo(id) {
  // Remove todo with matching ID
  todos = todos.filter(todo => todo.id !== id);
}
```

### 3. Toggle Complete
```javascript
// When you check/uncheck the checkbox
function toggleTodo(id) {
  // Find the todo and flip its completed status
  const todo = todos.find(t => t.id === id);
  todo.completed = !todo.completed;
}
```

### 4. Filter Todos
```javascript
// Show only active (not completed)
if (currentFilter === 'active') {
  filteredTodos = todos.filter(t => !t.completed);
}

// Show only completed
if (currentFilter === 'completed') {
  filteredTodos = todos.filter(t => t.completed);
}
```

### 5. Save to localStorage
```javascript
// Saves todos to browser storage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Loads todos when page opens
let todos = JSON.parse(localStorage.getItem('todos')) || [];
```

---

## 🔍 WHAT'S HAPPENING BEHIND THE SCENES

When you **add a todo**:
1. JavaScript gets the text from input field
2. Creates a unique ID (using current time)
3. Adds it to the `todos` array
4. Saves to browser's localStorage
5. Re-renders the list on the page

When you **reload the page**:
1. JavaScript loads todos from localStorage
2. Displays them on the page
3. Your data persists!

---

## 📚 JAVASCRIPT CONCEPTS YOU'RE LEARNING

- **DOM Manipulation**: Getting/creating HTML elements
- **Event Listeners**: Responding to clicks and keypress
- **Array Methods**: push, filter, find
- **Objects**: Creating and storing data
- **localStorage**: Saving data locally
- **Functions**: Organizing code into reusable blocks
- **Template Literals**: Creating dynamic HTML strings

---

## 🚀 CHALLENGE (Optional)

After you get it working, try:
1. Add a "Clear All" button to delete all todos
2. Add an "Edit" button to modify todo text
3. Add due dates to todos
4. Add priority levels (High, Medium, Low)
5. Add categories for organizing todos

---

## ✅ VERIFICATION CHECKLIST

Once you open the app:
- [ ] Can you type and add a todo?
- [ ] Can you check the checkbox?
- [ ] Can you delete a todo?
- [ ] Do filter buttons work?
- [ ] Do stats update correctly?
- [ ] If you refresh, are todos still there?

**If all YES → Day 2 complete!** 🎉

---

## 🎯 WHAT YOU'VE LEARNED TODAY

- HTML structure and form inputs
- CSS styling and responsive design
- **NEW: JavaScript DOM manipulation**
- **NEW: Event listeners and handlers**
- **NEW: Array methods (map, filter, find)**
- **NEW: localStorage (data persistence)**
- **NEW: Dynamic HTML rendering**

---

## 🚀 NEXT STEP

**Day 3: Movie Search App** (adds API calls!)

You'll learn:
- Fetch API (getting data from internet)
- Async/await (waiting for data)
- Working with APIs
- Error handling

---

## 💬 QUESTIONS?

Look at `Day2-script.js` - I added comments explaining each function!

**Tell me when you've built and tested your Todo App!** 🚀
