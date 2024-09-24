// Function to fetch videos from your backend API
function fetchVideos() {
  const fetchButton = document.querySelector('button');
  fetchButton.disabled = true;
  const examType = document.getElementById("examSelect").value;
  if (!examType) {
    alert("Please select an exam type.");
    fetchButton.disabled = false;
    return;
  }

  let languageQuery = "";
  if (document.getElementById("englishLang").checked) {
    languageQuery += " English";
  }
  if (document.getElementById("teluguLang").checked) {
    languageQuery += " Telugu";
  }

  let videoTypeQuery = "";
  if (document.getElementById("examPreparation").checked) {
    videoTypeQuery += " exam preparation";
  }
  if (document.getElementById("crashCourse").checked) {
    videoTypeQuery += " crash course";
  }
  if (document.getElementById("strategy").checked) {
    videoTypeQuery += " strategy";
  }

  const query = examType + videoTypeQuery + languageQuery;
  const resultsElement = document.getElementById('results');
  resultsElement.innerHTML = '';

  for (let i = 0; i < 5; i++) {
    const skeletonLoader = createSkeletonLoader();
    if (skeletonLoader instanceof Node) {
      resultsElement.appendChild(skeletonLoader);
    } else {
      console.error("Error: skeletonLoader is not a DOM node");
    }
  }

  // Fetch data from your backend API
  fetch(`https://project-v-backend.onrender.com/api/youtube-search?query=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        console.error("Error fetching videos:", data.error);
        resultsElement.innerHTML = `<p>Error: ${data.error}</p>`;
      } else {
        displayResults(data.items);
      }
      fetchButton.disabled = false;
    })
    .catch(error => {
      console.error("Error fetching videos:", error);
      resultsElement.innerHTML = '<p>Error fetching videos. Please try again later.</p>';
      fetchButton.disabled = false;
    });
}

// Function to create skeleton loaders
function createSkeletonLoader() {
  const skeletonLoader = document.createElement('div');
  skeletonLoader.className = 'result-item skeleton';
  skeletonLoader.innerHTML = `
      <div class="skeleton-img"></div>
      <div class="skeleton-title"></div>
  `;
  return skeletonLoader;
}

// Function to display the fetched videos
function displayResults(videos) {
  const resultsElement = document.getElementById('results');
  resultsElement.innerHTML = '';

  if (videos.length === 0) {
    resultsElement.innerHTML = '<p>No videos found for the selected criteria. Try different options.</p>';
    return;
  }

  videos.forEach(video => {
    if (video.id && video.id.videoId) {
      const listItem = createVideoElement(video);
      if (listItem instanceof Node) {
        resultsElement.appendChild(listItem);
      } else {
        console.error("Error: listItem is not a DOM node");
      }
    }
  });
}

// Function to create video elements
function createVideoElement(video) {
  const listItem = document.createElement('div');
  listItem.className = 'result-item';
  const link = document.createElement('a');
  link.href = `https://www.youtube.com/watch?v=${video.id.videoId}`;
  link.target = '_blank';
  const img = document.createElement('img');
  img.src = video.snippet.thumbnails.medium.url;
  img.className = 'skeleton-img';
  img.alt = video.snippet.title;
  const titleDiv = document.createElement('div');
  titleDiv.className = 'title';
  titleDiv.textContent = video.snippet.title;
  link.appendChild(img);
  link.appendChild(titleDiv);
  listItem.appendChild(link);
  return listItem;
}

// Initialize page elements on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const states = getMainStates();
  const columns = document.querySelectorAll('.state-column');

  if (columns.length === 0) return console.error('No state columns found on the page.');
  populateStateColumns(states, columns);
  fetchJobListings();
  setupToggleButtons();
});

// Function to get main states
function getMainStates() {
  return [
    { slug: 'andhra-pradesh', name: 'Andhra Pradesh' },
    { slug: 'arunachal-pradesh', name: 'Arunachal Pradesh' },
    { slug: 'assam', name: 'Assam' },
    { slug: 'bihar', name: 'Bihar' },
    { slug: 'gujarat', name: 'Gujarat' },
    { slug: 'haryana', name: 'Haryana' },
    { slug: 'himachal-pradesh', name: 'Himachal Pradesh' },
    { slug: 'karnataka', name: 'Karnataka' },
    { slug: 'kerala', name: 'Kerala' },
    { slug: 'madhya-pradesh', name: 'Madhya Pradesh' },
    { slug: 'maharashtra', name: 'Maharashtra' },
    { slug: 'manipur', name: 'Manipur' },
    { slug: 'meghalaya', name: 'Meghalaya' },
    { slug: 'mizoram', name: 'Mizoram' },
    { slug: 'odisha', name: 'Odisha' },
    { slug: 'punjab', name: 'Punjab' },
    { slug: 'rajasthan', name: 'Rajasthan' },
    { slug: 'sikkim', name: 'Sikkim' },
    { slug: 'tamil-nadu', name: 'Tamil Nadu' },
    { slug: 'telangana', name: 'Telangana' },
    { slug: 'uttar-pradesh', name: 'Uttar Pradesh' },
    { slug: 'uttarakhand', name: 'Uttarakhand' },
    { slug: 'west-bengal', name: 'West Bengal' },
    { slug: 'jharkhand', name: 'Jharkhand' },
    { slug: 'jammu-kashmir', name: 'Jammu & Kashmir' },
    { slug: 'chhattisgarh', name: 'Chhattisgarh' },
    { slug: 'goa', name: 'Goa' }
  ].sort((a, b) => a.name.localeCompare(b.name));
}

// Function to populate state columns
function populateStateColumns(states, columns) {
  const statesPerColumn = Math.ceil(states.length / columns.length);
  columns.forEach((column, index) => {
    const stateList = column.querySelector('.state-list');
    if (stateList) {
      const statesSubset = states.slice(index * statesPerColumn, (index + 1) * statesPerColumn);
      statesSubset.forEach(state => {
        const listItem = createStateListItem(state);
        if (listItem instanceof Node) {
          stateList.appendChild(listItem);
        } else {
          console.error("Error: listItem is not a DOM node");
        }
      });
    }
  });
}

// Function to create state list items
function createStateListItem(state) {
  const listItem = document.createElement('li');
  listItem.innerHTML = `<a href="https://sarkariwallahjob.com/state/${state.slug}/" target="_blank">${state.name}</a>`;
  return listItem;
}

// Function to fetch job listings from the backend
function fetchJobListings() {
  fetch('https://project-v-backend.onrender.com/api/jobs')
    .then(response => response.ok ? response.json() : Promise.reject(`Network error: ${response.statusText}`))
    .then(data => renderJobListings(data))
    .catch(error => showError(error, 'job-categories'));
}

// Function to render job listings
function renderJobListings(data) {
  const jobCategories = groupJobsByCategory(data);
  for (const [category, jobs] of Object.entries(jobCategories)) {
    const jobList = document.querySelector(`#${getCategoryId(category)} .job-list`);
    if (jobList) jobs.forEach(job => {
      const listItem = createJobListItem(job);
      if (listItem instanceof Node) {
        jobList.appendChild(listItem);
      } else {
        console.error("Error: listItem is not a DOM node");
      }
    });
  }
}

// Function to group jobs by category
function groupJobsByCategory(data) {
  const uniqueJobs = new Set();
  return data.reduce((acc, job) => {
    const category = job.category || 'Latest Jobs';
    if (!uniqueJobs.has(job.title)) {
      uniqueJobs.add(job.title);
      if (!acc[category]) acc[category] = [];
      acc[category].push(job);
    }
    return acc;
  }, {});
}

// Function to create job list items
function createJobListItem(job) {
  if (!job.title || !job.date) return;
  const listItem = document.createElement('li');
  listItem.classList.add('job-item');
  listItem.innerHTML = `
    <div class="job-title">${job.title}</div>
    <div class="job-date">Published on: ${new Date(job.date).toLocaleDateString()}</div>
    <a href="${job.link}" target="_blank" class="read-more">Read more</a>`;
  return listItem;
}

// Function to get category ID based on category name
function getCategoryId(category) {
  const categoryMap = {
    'Latest Jobs': 'latest-jobs',
    'Central Jobs': 'central-jobs',
    'Bank Jobs': 'bank-jobs',
    '10th Pass Govt Jobs': 'tenth-Pass-Govt-Jobs',
    'Intermediate Jobs': 'intermediate-jobs'
  };
  return categoryMap[category] || category;
}

// Function to show error messages
function showError(message, elementId) {
  const element = document.querySelector(`.${elementId}`);
  if (element) element.innerHTML = `<p>${message}</p>`;
  console.error(message);
}

// Function to set up toggle buttons for switching between videos and job sections
function setupToggleButtons() {
  const toggleControls = createToggleControls();
  document.body.insertBefore(toggleControls, document.querySelector('h1'));
  setupToggleEvents();
}

// Function to create toggle controls
function createToggleControls() {
  const toggleControls = document.createElement('div');
  toggleControls.id = 'toggle-controls';
  toggleControls.innerHTML = `
    <button id="showVideos">Show Videos</button>
    <button id="showJobs">Show Jobs</button>`;
  return toggleControls;
}

// Function to set up toggle events
function setupToggleEvents() {
  const videosSection = document.getElementById('video-search').parentElement;
  const jobsSection = document.getElementById('job-listings').parentElement;
  toggleSectionVisibility(videosSection, jobsSection, true);

  document.getElementById('showVideos').addEventListener('click', () => {
    toggleSectionVisibility(videosSection, jobsSection, true);
  });
  document.getElementById('showJobs').addEventListener('click', () => {
    toggleSectionVisibility(videosSection, jobsSection, false);
  });
}

// Function to toggle section visibility
function toggleSectionVisibility(videosSection, jobsSection, showVideos) {
  videosSection.style.display = showVideos ? 'block' : 'none';
  jobsSection.style.display = showVideos ? 'none' : 'block';
}

// Function for random word animation
const word = document.querySelector('#video-search'); 
let interv, canChange = false, globalCount = 0, count = 0, isGoing = false, INITIAL_WORD = word.innerHTML;

function initAnimation() {
  if (isGoing) return;
  isGoing = true;
  const randomWord = getRandomWord(word.innerHTML);
  word.innerHTML = randomWord;
  interv = setInterval(updateAnimation, 100);
}

function getRandomWord(word) {
  return word.replace(/./g, char => (char === ' ' ? ' ' : getRandomLetter()));
}

function updateAnimation() {
  word.innerHTML = [...INITIAL_WORD].map((char, i) => (i <= count && canChange) ? char : getRandomLetter()).join('');
  if (canChange) count++;
  if (++globalCount >= 40) canChange = true;
  if (count >= INITIAL_WORD.length) resetAnimation();
}

function resetAnimation() {
  clearInterval(interv);
  count = globalCount = canChange = isGoing = 0;
}

function startAnimation() {
  if (!isGoing) initAnimation();
  setInterval(initAnimation, 10000); 
}

function getRandomLetter() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

// Start the animation when the page loads
startAnimation();
