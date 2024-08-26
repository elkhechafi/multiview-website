const portfolio = document.getElementById('portfolio');
const viewToggle = document.getElementById('viewToggle');
const transitionOverlay = document.querySelector('.transition-overlay');

let isDeveloperView = false;
let projectData = [];

const fetchContent = async () => {
    try {
        const response = await fetch('content.json');
        const data = await response.json();
        projectData = data[isDeveloperView ? 'developer' : 'martech'].sections.find(section => section.type === 'portfolio').content.items;
        return data;
    } catch (error) {
        console.error('Error fetching content:', error);
        return {};
    }
};

const renderSection = (section) => {
    let html = '';
    switch (section.type) {
        case 'header':
            html = `
                <div class="section header">
                    <h1 class='content'>${section.content.title}</h1>
                    <h2 class='subtitle'>${section.content.subtitle}</h2>
                </div>
            `;
            break;
        case 'text':
            html = `
                <div class="section quotes">
                    <p>${section.content}</p>
                </div>
            `;
            break;
        case 'about':
            html = `
                <div class="section about">
                    <h2 class="about-title">${section.content.title}</h2>
                    <p class="about-para">${section.content.text}</p>
                    <img class="about-img" src="${section.content.image.src}" alt="${section.content.image.alt}" />
                </div>
            `;
            break;
        case 'services':
            html = `
                <div class="section ${section.class}">
                    <h2 class="services-title">${section.content.title}</h2>
                    <ul class="service-cards">
                        ${section.content.items.map((item, index) => `
                            <li class="service-card">
                                <h2>${item.title}</h2>
                                <p>${item.description}</p>
                                <img src="${item.icon}" alt="${item.title}" />
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
            break;
        case 'portfolio':
            html = `
                <div class="section ${section.class}">
                    <h2 class="portfolio-title">${section.content.title}</h2>
                    <div class="portfolio-cards">
                        ${section.content.items.map((item, index) => `
                            <div class="card ${item.order}">
                                <div class="content">
                                    <h2 class="title">${item.title}</h2>
                                    <p class="description">${item.description}</p>
                                    <button class="btn" onclick="showProjectDetails(${index})">View Detail</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            break;
        default:
            console.warn('Unknown section type:', section.type);
    }
    return html;
};

const updateContent = async () => {
    const content = await fetchContent();
    const currentView = isDeveloperView ? 'developer' : 'martech';
    const sections = content[currentView]?.sections || [];

    document.querySelector('title').textContent = isDeveloperView ? "Elkhechafi IT portfolio" : "Elkhechafi Martech portfolio";

    portfolio.innerHTML = sections.map(renderSection).join('');
};

const showProjectDetails = (index) => {
    const project = projectData[index];
    const details = project.details; // Use 'details' or 'test' depending on your JSON structure

    if (!details) {
        console.error('No details found for this project');
        return;
    }

    const modalContent = `
        <h2 class="modal-title">${project.title}</h2>
        <p><strong>Description:</strong> ${details.projectDescription}</p>
        <p><strong>Outcome:</strong> ${details.projectOutcome}</p>
        <p><strong>Tools:</strong> ${details.projectTools}</p>
        <p><strong>Timeline:</strong> ${details.projectTimeline}</p>
        <p><strong>Budget:</strong> ${details.projectBudget}</p>
        <p><strong>Client:</strong> ${details.projectClient}</p>
        <p><strong>Category:</strong> ${details.projectCategory}</p>
        <p><strong>Tags:</strong> ${details.projectTags.join(', ')}</p>
        <img src="${details.projectImage}" alt="${details.projectImageAlt}" />
        <p><em>${details.projectImageCaption}</em></p>
    `;

    document.getElementById('modalContent').innerHTML = modalContent;
    document.getElementById('projectModal').style.display = 'block';
};

viewToggle.addEventListener('change', async () => {
    isDeveloperView = viewToggle.checked;
    
    if (isDeveloperView) {
        transitionOverlay.classList.add('to-developer');
        portfolio.classList.remove('martech');
        portfolio.classList.add('developer');
    } else {
        transitionOverlay.classList.add('to-martech');
        portfolio.classList.remove('developer');
        portfolio.classList.add('martech');
    }

    transitionOverlay.classList.add('active');

    // Update content after the transition
    await updateContent();

    setTimeout(() => {
        transitionOverlay.classList.remove('active', 'to-martech', 'to-developer');
    }, 500);
});

// Initialize content
(async () => {
    await updateContent();
})();

// Scroll behavior
let currentSectionIndex = 0;
let isThrottled = false;

const throttleScroll = () => {
    isThrottled = true;
    setTimeout(() => {
        isThrottled = false;
    }, 1000);  // Adjust the timeout as needed
};

const handleScroll = (event) => {
    event.preventDefault();
    if (isThrottled) return;
    throttleScroll();
  
    const sections = document.querySelectorAll('.section');
    let delta = 0;
  
    if (event.type === 'wheel') {
        delta = Math.sign(event.deltaY);
    } else if (event.type === 'keydown') {
        if (event.key === 'ArrowDown') {
            delta = 1;
        } else if (event.key === 'ArrowUp') {
            delta = -1;
        }
    }
  
    if (delta > 0) {
        // Scroll down
        if (currentSectionIndex < sections.length - 1) {
            currentSectionIndex++;
        }
    } else if (delta < 0) {
        // Scroll up
        if (currentSectionIndex > 0) {
            currentSectionIndex--;
        }
    }
  
    sections[currentSectionIndex].scrollIntoView({ behavior: 'smooth' });
};
  
// Event listeners
document.addEventListener('wheel', handleScroll);
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        handleScroll(event);
    }
});

// Close modal when clicking on the close button or outside the modal
document.querySelector('.close').onclick = () => {
    document.getElementById('projectModal').style.display = 'none';
};

window.onclick = (event) => {
    if (event.target == document.getElementById('projectModal')) {
        document.getElementById('projectModal').style.display = 'none';
    }
};