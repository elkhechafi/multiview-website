const portfolio = document.getElementById('portfolio');
        const switchBtn = document.getElementById('switch-view');
        const transitionOverlay = document.querySelector('.transition-overlay');

        let isDeveloperView = false;

        const fetchContent = async () => {
            try {
                const response = await fetch('content.json');
                const data = await response.json();
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
                        <div class="section services">
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
                default:
                    console.warn('Unknown section type:', section.type);
            }
            return html;
        };

        const updateContent = async () => {
            const content = await fetchContent();
            const currentView = isDeveloperView ? 'developer' : 'martech';
            const sections = content[currentView]?.sections || [];

            portfolio.innerHTML = sections.map(renderSection).join('');
        };

        switchBtn.addEventListener('click', async () => {
                
            // Wait for the button to fade out
            setTimeout(() => {
                isDeveloperView = !isDeveloperView;
            
                if (isDeveloperView) {
                    transitionOverlay.classList.add('to-developer');
                    switchBtn.textContent = 'Switch to Martech View';
                    switchBtn.classList.remove('martech');
                    switchBtn.classList.add('developer');
                } else {
                    transitionOverlay.classList.add('to-martech');
                    switchBtn.textContent = 'Switch to Developer View';
                    switchBtn.classList.remove('developer');
                    switchBtn.classList.add('martech');
                }
            
                transitionOverlay.classList.add('active');
            
            // Start fading out the button
            switchBtn.classList.add('fading');
                setTimeout(() => {
                    if (isDeveloperView) {
                        portfolio.classList.remove('martech');
                        portfolio.classList.add('developer');
                    } else {
                        portfolio.classList.remove('developer');
                        portfolio.classList.add('martech');
                    }
                
                    // Update content after the transition
                    updateContent();
                
                    setTimeout(() => {
                        transitionOverlay.classList.remove('active', 'to-martech', 'to-developer');
                        // Fade the button back in
                        switchBtn.classList.remove('fading');
                    }, 500);
                }, 375);
            }, 400); // Wait for 500ms (matching the transition time) before starting the main transition
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
            const delta = Math.sign(event.deltaY);

            if (delta > 0) {
                // Scroll down
                if (currentSectionIndex < sections.length - 1) {
                    currentSectionIndex++;
                }
            } else {
                // Scroll up
                if (currentSectionIndex > 0) {
                    currentSectionIndex--;
                }
            }

            sections[currentSectionIndex].scrollIntoView({ behavior: 'smooth' });
        };

        document.addEventListener('wheel', handleScroll);
        