// Load the YouTube Data API client
function loadClient() {
  gapi.client.setApiKey("AIzaSyBFJVj-p7TGX1kJCdFWXveO61HXYnkRlcY");
  return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(function() {
      console.log("GAPI client loaded for API");
    }, function(err) {
      console.error("Error loading GAPI client for API", err);
    });
}

// Fetch videos based on selected exam, language, and video type
function fetchVideos() {
  const fetchButton = document.querySelector('button');
  fetchButton.disabled = true; // Disable button while fetching

  const examType = document.getElementById("examSelect").value;
  if (!examType) {
    alert("Please select an exam type.");
    fetchButton.disabled = false; // Re-enable button if there's an issue
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

  const resultsElement = document.getElementById('results');
  resultsElement.innerHTML = ''; // Clear previous results

  // Add skeleton loaders
  for (let i = 0; i < 5; i++) {
    resultsElement.appendChild(createSkeletonLoader());
  }

  // Execute the search
  execute(examType + videoTypeQuery + languageQuery, fetchButton);
}

function createSkeletonLoader() {
  const skeletonLoader = document.createElement('div');
  skeletonLoader.className = 'result-item skeleton';
  skeletonLoader.innerHTML = `
      <div class="skeleton-img"></div>
      <div class="skeleton-title"></div>
  `;
  return skeletonLoader;
}

function execute(query, fetchButton) {
  gapi.client.youtube.search.list({
    "part": "snippet",
    "maxResults": 25,
    "q": query
  })
  .then(function(response) {
    displayResults(response.result.items);
    fetchButton.disabled = false; // Re-enable button after fetching
  }, function(err) {
    console.error("Execute error", err);
    fetchButton.disabled = false; // Re-enable button if error occurs
  });
}

function displayResults(videos) {
  const resultsElement = document.getElementById('results');
  resultsElement.innerHTML = ''; // Clear skeleton loaders

  if (videos.length === 0) {
    resultsElement.innerHTML = '<p>No videos found for the selected criteria. Try different options.</p>';
    return;
  }

  videos.forEach(video => {
    if (video.id && video.id.videoId) {
      const listItem = document.createElement('div');
      listItem.className = 'result-item'; // Same class used by the skeleton loader

      const link = document.createElement('a');
      link.href = `https://www.youtube.com/watch?v=${video.id.videoId}`;
      link.target = '_blank';

      const img = document.createElement('img');
      img.src = video.snippet.thumbnails.medium.url;
      img.className = 'skeleton-img'; // Same class for consistent image style
      img.alt = video.snippet.title;

      const titleDiv = document.createElement('div');
      titleDiv.className = 'title'; // Same class for consistent title style
      titleDiv.textContent = video.snippet.title;

      link.appendChild(img);
      link.appendChild(titleDiv);
      listItem.appendChild(link);
      resultsElement.appendChild(listItem);
    }
  });
}

// Load the YouTube API
gapi.load("client", function() {
  loadClient();
});


// Fetch job listings and display them in the job categories
document.addEventListener('DOMContentLoaded', () => {
  const states = [
    { slug: 'west-bengal', name: 'West Bengal' },
    { slug: 'varanasi', name: 'Varanasi' },
    { slug: 'uttarakhand', name: 'Uttarakhand' },
    { slug: 'uttar-pradesh', name: 'Uttar Pradesh' },
    { slug: 'tripura', name: 'Tripura' },
    { slug: 'telangana', name: 'Telangana' },
    { slug: 'tamil-nadu', name: 'Tamil Nadu' },
    { slug: 'sikkim', name: 'Sikkim' },
    { slug: 'rajasthan', name: 'Rajasthan' },
    { slug: 'punjab', name: 'Punjab' },
    { slug: 'pune', name: 'Pune' },
    { slug: 'osmanabad', name: 'Osmanabad' },
    { slug: 'odisha', name: 'Odisha' },
    { slug: 'new-delhi', name: 'New Delhi' },
    { slug: 'nagpur', name: 'Nagpur' },
    { slug: 'mumbai', name: 'Mumbai' },
    { slug: 'mizoram', name: 'Mizoram' },
    { slug: 'meghalaya', name: 'Meghalaya' },
    { slug: 'manipur', name: 'Manipur' },
    { slug: 'maharashtra', name: 'Maharashtra' },
    { slug: 'madhya-pradesh', name: 'Madhya Pradesh' },
    { slug: 'kolkata', name: 'Kolkata' },
    { slug: 'kerala', name: 'Kerala' },
    { slug: 'karnataka', name: 'Karnataka' },
    { slug: 'jodhpur', name: 'Jodhpur' },
    { slug: 'jharkhand', name: 'Jharkhand' },
    { slug: 'jammu-and-kashmir', name: 'Jammu & Kashmir' },
    { slug: 'jaipur', name: 'Jaipur' },
    { slug: 'hyderabad', name: 'Hyderabad' },
    { slug: 'himachal-pradesh', name: 'Himachal Pradesh' },
    { slug: 'haryana', name: 'Haryana' },
    { slug: 'gujarat', name: 'Gujarat' },
    { slug: 'golabandha', name: 'Golabandha' },
    { slug: 'goa', name: 'Goa' },
    { slug: 'dehradun', name: 'Dehradun' },
    { slug: 'chhattisgarh', name: 'Chhattisgarh' },
    { slug: 'chandigarh', name: 'Chandigarh' },
    { slug: 'bikaner', name: 'Bikaner' },
    { slug: 'bihar', name: 'Bihar' },
    { slug: 'bibinagar', name: 'Bibinagar' },
    { slug: 'bangalore', name: 'Bangalore' },
    { slug: 'assam', name: 'Assam' },
    { slug: 'arunachal-pradesh', name: 'Arunachal Pradesh' },
    { slug: 'andhra-pradesh', name: 'Andhra Pradesh' },
    { slug: 'andaman-and-nicobar', name: 'Andaman and Nicobar' },
    { slug: 'ajmer', name: 'Ajmer' },
    { slug: 'ahmedabad', name: 'Ahmedabad' },
    { slug: 'agra', name: 'Agra' }
  ];

  // Sorting states alphabetically
  states.sort((a, b) => a.name.localeCompare(b.name));

  const columns = document.querySelectorAll('.state-column');
  const statesPerColumn = Math.ceil(states.length / columns.length);

  if (columns.length === 0) {
    console.error('No state columns found on the page.');
    return;
  }

  // Populate state columns
  columns.forEach((column, index) => {
    const start = index * statesPerColumn;
    const end = start + statesPerColumn;
    const statesSubset = states.slice(start, end);

    const stateList = column.querySelector('.state-list');
    if (stateList) {
      statesSubset.forEach(state => {
        const listItem = document.createElement('li');
        const stateLink = document.createElement('a');

        stateLink.href = `https://sarkariwallahjob.com/state/${state.slug}/`;
        stateLink.textContent = state.name;
        stateLink.target = '_blank';

        listItem.appendChild(stateLink);
        stateList.appendChild(listItem);
      });
    } else {
      console.warn(`No state list found in column ${index + 1}`);
    }
  });

  // Map categories to corresponding section IDs
  const categoryMap = {
    'Latest Jobs': 'latest-jobs',
    'Central Jobs': 'central-jobs',
    'Bank Jobs': 'bank-jobs',
  };

  // Fetch jobs from the API
  fetch('https://project-v-backend.onrender.com/api/jobs')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Fetched Job Data:', data);

      const uniqueJobs = new Set();

      // Group jobs by category and remove duplicates
      const groupedJobs = data.reduce((acc, job) => {
        const category = job.category || 'Latest Jobs';
        const uniqueKey = job.title || job.link;

        // Skip duplicates
        if (uniqueJobs.has(uniqueKey)) {
          console.warn(`Duplicate job found: ${job.title}`);
          return acc;
        }

        uniqueJobs.add(uniqueKey);

        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(job);
        return acc;
      }, {});

      // Sort jobs in each category by date (most recent first)
      for (const category in groupedJobs) {
        groupedJobs[category].sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          if (isNaN(dateA)) return 1;
          if (isNaN(dateB)) return -1;
          return dateB - dateA;
        });
      }

      // Render the jobs in their respective sections
      for (const [category, jobs] of Object.entries(groupedJobs)) {
        const categoryId = categoryMap[category] || category;
        const jobList = document.querySelector(`#${categoryId} .job-list`);

        if (jobList) {
          jobs.forEach(job => {
            const listItem = document.createElement('li');
            listItem.classList.add('job-item');
            listItem.innerHTML = `
              <div class="job-title">${job.title}</div>
              <div class="job-date">Published on: ${
                job.date ? new Date(job.date).toLocaleDateString() : 'Unknown date'
              }</div>
              <a href="${job.link}" target="_blank" class="read-more">Read more</a>
            `;
            jobList.appendChild(listItem);
          });
        } else {
          console.warn(`No job list found for category: ${category}`);
        }
      }
    })
    .catch(error => {
      console.error('Error fetching jobs:', error);
      const jobCategories = document.querySelector('.job-categories');
      jobCategories.innerHTML = '<p>Error fetching job listings. Please try again later.</p>';
    });
});


// Toggle between Videos and Jobs
document.addEventListener('DOMContentLoaded', () => {
  const toggleVideosButton = document.createElement('button');
  const toggleJobsButton = document.createElement('button');

  toggleVideosButton.textContent = 'Show Videos';
  toggleJobsButton.textContent = 'Show Jobs';

  const toggleControls = document.createElement('div');
  toggleControls.id = 'toggle-controls';
  toggleControls.appendChild(toggleVideosButton);
  toggleControls.appendChild(toggleJobsButton);

  document.body.insertBefore(toggleControls, document.querySelector('h1'));

  const videosSection = document.getElementById('video-search').parentElement;
  const jobsSection = document.getElementById('job-listings').parentElement;

  // Initially show the video section and hide the jobs section
  videosSection.style.display = 'block';
  jobsSection.style.display = 'none';

  toggleVideosButton.addEventListener('click', () => {
    videosSection.style.display = 'block';
    jobsSection.style.display = 'none';
  });

  toggleJobsButton.addEventListener('click', () => {
    videosSection.style.display = 'none';
    jobsSection.style.display = 'block';
  });
});