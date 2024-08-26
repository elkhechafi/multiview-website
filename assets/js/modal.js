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

const showProjectDetails = (index) => {
    const project = projectData[index];
    const details = project.details || project.test; // Use 'details' or 'test' depending on your JSON structure

    if (!details) {
        console.error('No details found for this project');
        return;
    }

    const modalContent = `
        <h2>${project.title}</h2>
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

// Close modal when clicking on the close button or outside the modal
document.querySelector('.close').onclick = () => {
    document.getElementById('projectModal').style.display = 'none';
};

window.onclick = (event) => {
    if (event.target == document.getElementById('projectModal')) {
        document.getElementById('projectModal').style.display = 'none';
    }
};