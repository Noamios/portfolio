# 🎬 DAY 3: MOVIE SEARCH APP WITH APIs
## Learn Async/Await & Fetch Real Data!

---

## 🎯 WHAT YOU'LL BUILD

A **Movie Search App** that:
- ✅ Searches for movies from the internet (real API)
- ✅ Displays movie posters and details
- ✅ Shows loading spinner while searching
- ✅ Handles errors gracefully
- ✅ Click any movie for more details
- ✅ Beautiful responsive design

**Uses real data from OMDb API!** 🌐

---

## 📥 DOWNLOAD 3 FILES

1. **Day3-index.html** - HTML structure
2. **Day3-style.css** - Styling
3. **Day3-script.js** - JavaScript with Fetch API

---

## 🔧 SETUP (SAME AS DAY 2)

### Step 1: Create folder
```
Documents/movie-app/
```

### Step 2: Download 3 files into folder

### Step 3: Rename files
- `Day3-index.html` → `index.html`
- `Day3-style.css` → `style.css`
- `Day3-script.js` → `script.js`

### Step 4: Open index.html in Safari

---

## 🎮 HOW TO USE

1. **Type a movie name** (e.g., "Inception", "Avatar", "Matrix")
2. **Press Enter or click Search**
3. **Wait for results** (you'll see a loading spinner)
4. **See movies appear** with posters
5. **Click any movie** for more details
6. **Search again** for different movies

---

## 🌐 NEW CONCEPT: FETCH API

This is the big new thing in Day 3!

### What is Fetch?
Fetch = Getting data from the internet (from APIs)

### Simple Example:
```javascript
// Get data from an API
const response = await fetch('https://api.example.com/data');
const data = await response.json();
console.log(data);
```

### What's happening:
1. `fetch()` - Ask the internet for data
2. `await` - Wait for the response
3. `.json()` - Convert the response to JavaScript object
4. Now you have the data to use!

---

## ⏳ NEW CONCEPT: ASYNC/AWAIT

### Async = Can Wait
```javascript
// This function can wait for things
async function searchMovies() {
  // Inside async function, we can use await
}
```

### Await = Wait For This
```javascript
// Wait for the fetch to complete
const response = await fetch(url);
// Only after response, do this:
const data = await response.json();
```

### Why This Matters
Without await, your code would try to use data **before it arrives**:

```javascript
// ❌ WRONG - data not ready yet!
const response = fetch(url);
const data = response.json(); // data is still loading!
console.log(data); // undefined!

// ✅ CORRECT - wait for data first
const response = await fetch(url);
const data = await response.json();
console.log(data); // data is ready!
```

---

## 🔄 STEP BY STEP: HOW THE APP WORKS

### Step 1: User Types and Searches
```javascript
// User types "Inception" and presses Enter
searchMovies() function starts
```

### Step 2: Show Loading
```javascript
// Show spinner
loading.classList.remove('hidden');
// Hide previous results
results.innerHTML = '';
```

### Step 3: Fetch from API
```javascript
const response = await fetch(
  'https://www.omdbapi.com/?apikey=fdb147b1&s=Inception'
);
```

API returns:
```json
{
  "Search": [
    {
      "Title": "Inception",
      "Year": "2010",
      "imdbID": "tt1375666",
      "Poster": "https://m.media-amazon.com/...",
      "Type": "movie"
    },
    ...more movies...
  ]
}
```

### Step 4: Parse the Response
```javascript
const data = await response.json();
// Now data is a JavaScript object we can use!
console.log(data.Search[0].Title); // "Inception"
```

### Step 5: Display Results
```javascript
displayMovies(data.Search);
// This loops through each movie and creates HTML
```

### Step 6: Click for Details
```javascript
// User clicks a movie card
movieCard.addEventListener('click', () => {
  getMovieDetails(movie.imdbID);
});

// Fetch more details about that specific movie
async function getMovieDetails(imdbID) {
  const response = await fetch(
    'https://www.omdbapi.com/?apikey=fdb147b1&i=tt1375666'
  );
  const movie = await response.json();
  // Show detailed info
  alert(movie.Plot);
}
```

---

## 🛠️ KEY CODE EXPLAINED

### The Main Function
```javascript
async function searchMovies() {
  // 1. Get search query
  const query = searchInput.value.trim();
  
  // 2. Check if empty
  if (query === '') {
    alert('Please enter a movie name!');
    return;
  }
  
  // 3. Show loading, hide errors
  loading.classList.remove('hidden');
  error.classList.add('hidden');
  
  try {
    // 4. FETCH from API (wait for response)
    const response = await fetch(
      `${API_URL}&s=${encodeURIComponent(query)}`
    );
    
    // 5. Convert to JSON (wait for conversion)
    const data = await response.json();
    
    // 6. Hide loading spinner
    loading.classList.add('hidden');
    
    // 7. Check for errors
    if (data.Response === 'False') {
      error.textContent = data.Error;
      error.classList.remove('hidden');
      return;
    }
    
    // 8. Display movies
    displayMovies(data.Search);
    
  } catch (err) {
    // Handle any errors that happened
    loading.classList.add('hidden');
    error.textContent = 'Error: ' + err.message;
    error.classList.remove('hidden');
  }
}
```

### Error Handling (Try/Catch)
```javascript
try {
  // Try to fetch data
  const data = await fetch(...);
} catch (err) {
  // If something fails, catch the error
  console.error(err);
  // Show error message to user
  error.textContent = 'Network error!';
}
```

---

## 📚 JAVASCRIPT CONCEPTS YOU'RE LEARNING

- **Fetch API** - Get data from internet
- **Async/Await** - Handle waiting for data
- **Promises** - What fetch returns
- **Try/Catch** - Error handling
- **JSON** - Data format from APIs
- **Array Methods** - forEach to loop through movies
- **DOM Events** - Click to get details
- **Error Messages** - Show errors to user

---

## 🔐 SECURITY NOTE

**encodeURIComponent()**
```javascript
// Why we use this:
const query = "Inception";
encodeURIComponent(query); // "Inception"

// What if user searches for: "Star Wars: Episode I"
// Without encoding: Star Wars: Episode I (spaces & colons break URL)
// With encoding: Star%20Wars%3A%20Episode%20I (safe for URL)

// Always use encodeURIComponent() for user input in URLs!
```

---

## 🎓 WHAT YOU'RE DOING (Advanced!)

You're now:
- ✅ Calling real APIs
- ✅ Handling asynchronous code
- ✅ Processing real-world data
- ✅ Building error handling
- ✅ Creating dynamic content

**This is what professional developers do!** 🚀

---

## 🚀 CHALLENGES (Try After App Works)

1. **Add favorites** - Save favorite movies to localStorage
2. **Add pagination** - Show next/previous page of results
3. **Add sorting** - Sort by year, rating, etc.
4. **Better details** - Show details in a modal instead of alert
5. **Search history** - Show previous searches

---

## 📊 API INFORMATION

**OMDb API** (Open Movie Database)
- **URL**: https://www.omdbapi.com/
- **Key**: fdb147b1 (free public key)
- **Limit**: 1000 requests/day on free tier
- **Data**: Movie information, posters, ratings

### API Response Example:
```json
{
  "Search": [
    {
      "Title": "Inception",
      "Year": "2010",
      "imdbID": "tt1375666",
      "Type": "movie",
      "Poster": "https://m.media-amazon.com/..."
    }
  ],
  "totalResults": "123",
  "Response": "True"
}
```

---

## ✅ VERIFICATION CHECKLIST

- [ ] Can you search for a movie?
- [ ] Do results appear after a few seconds?
- [ ] Is there a loading spinner?
- [ ] Can you click a movie for details?
- [ ] Do error messages show if no results?
- [ ] Responsive on mobile?

**If all YES → Day 3 COMPLETE!** 🎉

---

## 🎯 KEY TAKEAWAY

**Async/Await makes it easy to:**
1. Get data from internet
2. Wait for it to arrive
3. Process it
4. Show it to user

**This is ESSENTIAL for modern web development!**

---

## 🚀 NEXT STEP

**Day 4: React Basics** 🎨

We're moving to a JavaScript framework that makes building apps even easier!

You'll learn:
- Components
- State management
- Hooks
- React patterns

See you in Day 4! 💪
