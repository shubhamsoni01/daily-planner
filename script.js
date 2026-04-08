// Navigation - Open/Close sections
function openFeatures() {
  var allElems = document.querySelectorAll(".elem");
  var fullElemPage = document.querySelectorAll(".fullElem");
  var fullElemPageBackBtn = document.querySelectorAll(".fullElem .back");

  // By default sabhi sections ko hide karein taaki overlap na ho
  fullElemPage.forEach(page => page.style.display = "none");

  // Page reload par pehle se open tab ko open rakhne ke liye
  var activeTab = localStorage.getItem("activeTab");
  if (activeTab !== null) {
    let tabIndex = parseInt(activeTab);
    if (!isNaN(tabIndex) && fullElemPage[tabIndex]) {
      fullElemPage[tabIndex].style.display = "block";
    }
  }

  allElems.forEach(function (elem, index) {
    elem.addEventListener("click", function () {
      fullElemPage.forEach(page => page.style.display = "none"); // Naya kholne se pehle baaki sab hide
      fullElemPage[index].style.display = "block";
      localStorage.setItem("activeTab", index); // Jo tab open ho uska index save karein
    });
  });

  fullElemPageBackBtn.forEach(function (back, index) {
    back.addEventListener("click", function () {
      fullElemPage[index].style.display = "none";
      localStorage.removeItem("activeTab"); // Back aane par save data hata dein
    });
  });
}
openFeatures();

// Load tasks from localStorage
var currentTask = [];

try {
  if (localStorage.getItem("currentTask")) {
    currentTask = JSON.parse(localStorage.getItem("currentTask"));
    // Agar purana data array ki jagah kuch aur ho gaya ho toh isko khali array set kar dein
    if (!Array.isArray(currentTask)) {
      currentTask = [];
    }
  }
} catch (error) {
  currentTask = []; // Agar parsing error aaye toh default khali array lein
}

// Render tasks to screen
function renderTask() {
  var allTask = document.querySelector(".allTask");
  let sum = "";
  let completedCount = 0;

  currentTask.forEach(function (elem, idx) {
    if (elem.completed) completedCount++;
    sum =
      sum +
      ` <div class="task ${elem.completed ? 'completed' : ''}">
            <h5>${elem.task} <span>${elem.imp ? "IMP" : ""}</span></h5>
            <div class="task-actions">
              <button class="btn-complete" data-id="${elem.id || idx}" title="Mark Complete"><i class="ri-check-double-line"></i></button>
              <button class="btn-delete" data-id="${elem.id || idx}" title="Delete Task"><i class="ri-delete-bin-line"></i></button>
            </div>
          </div>`;
  });
  allTask.innerHTML = sum;

  // Update Progress Bar
  const progressEl = document.getElementById("task-progress");
  const progressText = document.getElementById("progress-text");
  if (progressEl && progressText) {
    const total = currentTask.length;
    const percent = total === 0 ? 0 : Math.round((completedCount / total) * 100);
    progressEl.style.width = percent + "%";
    progressText.innerText = percent + "% Completed";
  }
}
renderTask();

// Form - Add new task
var form = document.querySelector(".addTask form");
var taskInput = document.querySelector(".addTask form #task-input");
var taskDetailsInput = document.querySelector(".addTask form textarea");
var taskCheckbox = document.querySelector(".addTask form #check");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  
  currentTask.push({
    id: Date.now(),
    task: taskInput.value,
    details: taskDetailsInput.value,
    imp: taskCheckbox.checked,
    completed: false
  });
  
  // Save to localStorage
  localStorage.setItem("currentTask", JSON.stringify(currentTask));
  
  // Clear form
  taskInput.value = "";
  taskDetailsInput.value = "";
  taskCheckbox.checked = false;
  
  // Re-render
  renderTask();
});

// Event Delegation - Delete task on button click
document.querySelector(".allTask").addEventListener("click", function (e) {
  const btn = e.target.closest("button");
  if (btn) {
    var taskId = btn.getAttribute("data-id");
    
    var indexToUpdate = currentTask.findIndex(function(task) {
      return task.id == taskId || currentTask.indexOf(task) == taskId;
    });
    
    if (indexToUpdate !== -1) {
      if (btn.classList.contains("btn-delete")) {
        currentTask.splice(indexToUpdate, 1);
      } else if (btn.classList.contains("btn-complete")) {
        currentTask[indexToUpdate].completed = !currentTask[indexToUpdate].completed;
      }
      localStorage.setItem("currentTask", JSON.stringify(currentTask));
      renderTask();
    }
  }
});


// var hours = Array.from({length:18},function(elem, idx){
// return `${6+idx}:00 - ${7+idx}:00`

// })
function dailyPlanner(){
  var hours = Array.from({length:18}, (_, idx) => {
    let s = 6 + idx; // Start hour
    let e = 7 + idx; // End hour
    let sAmPm = (s >= 12 && s < 24) ? "PM" : "AM";
    let eAmPm = (e >= 12 && e < 24) ? "PM" : "AM";
    let s12 = s % 12 || 12; // 12-hour format mein convert
    let e12 = e % 12 || 12;
    return `${s12}:00 ${sAmPm} - ${e12}:00 ${eAmPm}`;
  });
console.log(hours);

// Pehle localStorage se data load karein (agar nahi hai toh empty object lein)
var dayPlanData = {};
try {
  dayPlanData = JSON.parse(localStorage.getItem('dayPlanData')) || {};
  if (typeof dayPlanData !== 'object' || Array.isArray(dayPlanData)) {
      dayPlanData = {};
  }
} catch (error) {
  dayPlanData = {}; // Agar purana data corrupt ho toh ek naya khali object lein
}

// Agar pehle se key nahi hai, toh abhi bana do taaki devtools me proper column dikhe
if (!localStorage.getItem('dayPlanData')) {
  localStorage.setItem('dayPlanData', JSON.stringify(dayPlanData));
}

var wholeDaysum = "";
hours.forEach(function(elem, idx){
  // Check karein ki is specific input ka koi data save hai ya nahi
  var savedValue = dayPlanData[idx] || "";
  wholeDaysum = wholeDaysum+`<div class="day-planner-time">
         <p>${elem}</p>
         <input class="plan-input" id="${idx}" type="text" placeholder="..." value="${savedValue}">
       </div>`

})

var dayPlanner =  document.querySelector('.day-planner')
dayPlanner.innerHTML = wholeDaysum

// Event Delegation: Poore container par ek listener taaki har input properly save ho
dayPlanner.addEventListener('input', function(e) {
  if(e.target.classList.contains('plan-input')) {
    dayPlanData[e.target.id] = e.target.value;
    localStorage.setItem('dayPlanData', JSON.stringify(dayPlanData));
  }
});
  
}
dailyPlanner()



function motivationQuotes() {
  var motivationTitle = document.querySelector('.motivation1 h2') // Heading text
  var motivationQuote = document.querySelector('.motivation2 h2') // HTML me .motivation2 ke andar h2 hai
  var motivationAuthor = document.querySelector('.motivation3 h1') // HTML me .motivation3 ke andar h1 hai
  var motivationPage = document.querySelector('.motivational-fullpage') // Background element

  // Khubsurat premium gradients ka collection
  const backgroundGradients = [
    "linear-gradient(135deg, #41295a 0%, #2F0743 100%)",
    "linear-gradient(135deg, #1D2B64 0%, #F8CDDA 100%)",
    "linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)",
    "linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)",
    "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
  ];

  // Heading (Title) ko bhi dynamic banane ke liye
  const dynamicTitles = [
    "Quote of the Day",
    "Daily Wisdom",
    "Stay Focused",
    "Daily Inspiration",
    "Words of Power",
    "Keep Going"
  ];

  async function fetchQuote() {
    try {
      // Quotable API down rehti hai, isliye hum reliable DummyJSON API ka use karenge
      let response = await fetch('https://dummyjson.com/quotes/random');
      let data = await response.json();
      
      if (motivationTitle) {
        motivationTitle.innerText = dynamicTitles[Math.floor(Math.random() * dynamicTitles.length)];
      }
      if (motivationQuote) {
        motivationQuote.innerText = `"${data.quote}"`; // DummyJSON me quote text ke liye 'quote' key hai
      }
      if (motivationAuthor) {
        motivationAuthor.innerText = `- ${data.author}`;
      }
      
      // Quote aate hi background color change karein
      if (motivationPage) {
        let randomBg = backgroundGradients[Math.floor(Math.random() * backgroundGradients.length)];
        motivationPage.style.background = randomBg;
      }
    } catch (error) {
      console.error("Quote fetch karne me error aayi:", error);
    }
  }
  fetchQuote();
}
motivationQuotes();


function pomodoroTimer(){
let interval = null;
let isRunning = false;

let totalSecond = 0;

let timer = document.querySelector('.pomo-timer h1')
var startBtn = document.querySelector('.pomo-timer .start-timer')
var resetBtn = document.querySelector('.pomo-timer .reset-timer')
var pauseBtn = document.querySelector('.pomo-timer .pause-timer')
var customTimeInput = document.querySelector('#custom-time-input')
var customSecInput = document.querySelector('#custom-sec-input')
var sessionLabel = document.querySelector('.session')

function upDateTime(){
  let minuts = Math.floor(totalSecond/60);
  let second = totalSecond%60;
  let timeString = `${minuts < 10 ? '0' + minuts : minuts}:${second < 10 ? '0' + second : second}`;
  timer.innerHTML = timeString;
}

function startTimer(){
  // Pehle se chal rahe timer ko clear karein taaki speed na badhe
  clearInterval(interval);

  // Agar timer khatam ho chuka hai (0 bache hain), to fir se default time set kar dein
  if(totalSecond === 0) {
    let mins = Math.max(0, parseInt(customTimeInput.value) || 0);
    let secs = Math.max(0, parseInt(customSecInput.value) || 0);
    if(mins === 0 && secs === 0) {
      alert("Please enter valid time to start the timer!");
      return; // Stop here if no valid time is provided
    }
    totalSecond = (mins * 60) + secs; 
    upDateTime();
  }

  isRunning = true; // Timer start ho gaya hai

  // Start hote hi Work Session aur Green color
  sessionLabel.innerText = "Work Session";
  sessionLabel.style.backgroundColor = "rgba(46, 204, 113, 0.8)";

  interval = setInterval(function(){
    if(totalSecond > 0) {
      totalSecond--;
      upDateTime();
    } else {
      clearInterval(interval);
      isRunning = false; // Timer khatam ho gaya
      sessionLabel.innerText = "Time is up!";
      sessionLabel.style.backgroundColor = "rgba(231, 76, 60, 0.8)";
      alert("Time is up! Good Job.");
    }
  },1000)
}

function pauseTimer(){
  clearInterval(interval);
  isRunning = false; // Timer pause ho gaya hai
  // Pause hote hi Break aur Blue color
  sessionLabel.innerText = "Break";
  sessionLabel.style.backgroundColor = "rgba(52, 152, 219, 0.8)";
}

function resetTimer(){
  clearInterval(interval);
  isRunning = false; // Timer reset ho gaya hai
  let mins = Math.max(0, parseInt(customTimeInput.value) || 0);
  let secs = Math.max(0, parseInt(customSecInput.value) || 0);
  
  if(mins === 0 && secs === 0) {
    totalSecond = 0;
  } else {
    totalSecond = (mins * 60) + secs;
  }

  sessionLabel.innerText = "Focus Time";
  sessionLabel.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
  upDateTime();
}

startBtn.addEventListener('click',startTimer)
pauseBtn.addEventListener('click',pauseTimer)
resetBtn.addEventListener('click', function() {
  customTimeInput.value = ""; // Reset karne par Min input box khali karein
  customSecInput.value = "";  // Reset karne par Sec input box khali karein
  resetTimer();
})

// Jab user input me time change kare, toh timer update ho jaye
customTimeInput.addEventListener('input', function() {
  // Agar timer abhi chal NAHI raha hai, tabhi input change hone par timer update karein
  if (!isRunning) {
    resetTimer();
  }
});

// Jab user seconds wale box mein change kare, tab bhi update hona chahiye
customSecInput.addEventListener('input', function() {
  if (!isRunning) {
    resetTimer();
  }
});

upDateTime()
}
pomodoroTimer();

async function weatherAPICall() {
  const apiKey = "7560bc1f404b4d1580f33332260804";
  const weatherInfoDiv = document.getElementById("weather-info");
  
  // Weather API ko call karne ka function
  async function fetchWeather(lat, lon) {
    try {
      var response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`);
      var data = await response.json();
      
      if (weatherInfoDiv) {
        weatherInfoDiv.innerHTML = `
          <h3>${data.current.temp_c}°C</h3>
          <p>📍 ${data.location.name}, ${data.location.region}</p>
          <p>☁️ ${data.current.condition.text}</p>
        `;
      }
    } catch (error) {
      console.error("Weather fetch error:", error);
      if (weatherInfoDiv) weatherInfoDiv.innerHTML = "<p>Weather data not found ❌</p>";
    }
  }

  // LocalStorage se purani location check karein taaki baar baar popup na aaye
  const savedLat = localStorage.getItem("userLat");
  const savedLon = localStorage.getItem("userLon");

  if (savedLat && savedLon) {
    // Agar location save hai toh bina puche weather dikhayein
    fetchWeather(savedLat, savedLon);
  } else if (navigator.geolocation) {
    // Agar pehli baar aaye hain tabhi popup aaye
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        // Location ko browser me save kar lein
        localStorage.setItem("userLat", lat);
        localStorage.setItem("userLon", lon);
        
        fetchWeather(lat, lon);
      },
      (error) => {
        console.error("Location Error:", error.message);
        if (weatherInfoDiv) weatherInfoDiv.innerHTML = "<p>Location permission required 📍</p>";
      }
    );
  } else {
    console.error("Your browser does not support geolocation.");
    if (weatherInfoDiv) weatherInfoDiv.innerHTML = "<p>Location feature not available</p>";
  }
}
weatherAPICall();

// Function to update current time and date in the header
function updateClock() {
  const timeElement = document.getElementById("current-time");
  const dateElement = document.getElementById("current-date");
  const plannerDateElement = document.getElementById("planner-date");
  
  if (timeElement && dateElement) {
    const now = new Date();
    
    // Format time (e.g., 10:25:30 AM)
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    timeElement.innerText = now.toLocaleTimeString('en-US', timeOptions);
    
    // Format date (e.g., Wednesday, April 8, 2026)
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('en-US', dateOptions);
    dateElement.innerText = formattedDate;
    
    if (plannerDateElement) {
      plannerDateElement.innerText = "📅 " + formattedDate;
    }
  }
}

// Update the clock every second
setInterval(updateClock, 1000);

// Initial call to set it immediately
updateClock();





// setInterval(()=>{
//   totalSecond--
//   upDateTime()

// },1000);
// ===== Sticky Notes (Daily Goals) Logic =====
function stickyNotesManager() {
  const addNoteBtn = document.querySelector('.add-note-btn');
  const notesContainer = document.querySelector('.notes-container');

  // Sticky notes ke liye khubsurat pastel colors
  const stickyColors = ['#Fbf8cc', '#Fde4cf', '#ffcfd2', '#f1c0e8', '#cfbaf0', '#a3c4f3', '#90dbf4', '#8eecf5', '#98f5e1', '#b9fbc0'];

  let notes = [];

  // LocalStorage se purana data load karein
  try {
    notes = JSON.parse(localStorage.getItem('stickyNotesData')) || [];
  } catch (e) {
    notes = [];
  }

  function saveNotes() {
    localStorage.setItem('stickyNotesData', JSON.stringify(notes));
  }

  function renderNotes() {
    if (!notesContainer) return;
    notesContainer.innerHTML = '';
    
    notes.forEach((note) => {
      const noteElem = document.createElement('div');
      noteElem.classList.add('sticky-note');
      noteElem.style.backgroundColor = note.color;
      noteElem.style.setProperty('--rot', `${note.rotation || 0}deg`); // Har note ka unique tilt (tedhapan)

      noteElem.innerHTML = `
        <button class="delete-note" data-id="${note.id}" title="Delete Note">
          <i class="ri-close-line"></i>
        </button>
        <textarea class="note-input" data-id="${note.id}" placeholder="Write your goal here...">${note.text}</textarea>
      `;
      notesContainer.appendChild(noteElem);
    });
  }

  // Naya note add karne ke liye
  if (addNoteBtn) {
    addNoteBtn.addEventListener('click', () => {
      const randomColor = stickyColors[Math.floor(Math.random() * stickyColors.length)];
      const randomRotation = Math.floor(Math.random() * 7) - 3; // Note ko -3 se +3 degree ke beech ghumayega
      
      const newNote = {
        id: Date.now().toString(),
        text: '',
        color: randomColor,
        rotation: randomRotation
      };
      notes.push(newNote);
      saveNotes();
      renderNotes();
    });
  }

  // Type karte hi background mein data automatically save hoga
  if (notesContainer) {
    notesContainer.addEventListener('input', (e) => {
      if (e.target.classList.contains('note-input')) {
        const id = e.target.getAttribute('data-id');
        const note = notes.find(n => n.id === id);
        if (note) {
          note.text = e.target.value;
          saveNotes();
        }
      }
    });

    // Note delete karne ke liye
    notesContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.delete-note');
      if (btn) {
        const id = btn.getAttribute('data-id');
        notes = notes.filter(n => n.id !== id);
        saveNotes();
        renderNotes();
      }
    });
  }

  // Page load hote hi notes show karein
  renderNotes();
}
stickyNotesManager();

// ===== Dark / Light Mode Toggle =====
function setupThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle');
  const themeIcon = themeBtn.querySelector('i');

  // Check LocalStorage for saved theme
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    themeIcon.className = 'ri-moon-line';
  }

  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    themeIcon.className = isLight ? 'ri-moon-line' : 'ri-sun-line';
  });
}
setupThemeToggle();
