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
  fetch('http://localhost:3000/api/jobs')
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
