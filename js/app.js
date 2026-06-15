// HTCS401 Dashboard Controller

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initSearch();
    initProgressTracker();
});

// Theme Management (Dark / Light Mode)
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('aktu-exam-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.classList.add('dark');
        updateThemeIcon(true);
    } else {
        document.documentElement.classList.remove('dark');
        updateThemeIcon(false);
    }

    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('aktu-exam-theme', isDark ? 'dark' : 'light');
        updateThemeIcon(isDark);
    });
}

function updateThemeIcon(isDark) {
    const iconContainer = document.getElementById('theme-toggle-icon');
    if (!iconContainer) return;
    
    if (isDark) {
        iconContainer.innerHTML = `
            <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path>
            </svg>
        `;
    } else {
        iconContainer.innerHTML = `
            <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
        `;
    }
}

// Navigation Tab Management
function initNavigation() {
    const savedTab = localStorage.getItem('aktu-exam-active-tab') || 'shannon';
    
    // Switch to saved tab initially
    switchTopic(savedTab);

    // Make switchTopic globally available
    window.switchTopic = switchTopic;
}

function switchTopic(topicId) {
    // Hide all topics
    const topics = document.querySelectorAll('.topic-content');
    topics.forEach(t => {
        t.classList.add('hidden');
        t.classList.remove('animate-fade-in');
    });

    // Show selected
    const selectedTopic = document.getElementById(topicId + '-topic');
    if (selectedTopic) {
        selectedTopic.classList.remove('hidden');
        selectedTopic.classList.add('animate-fade-in');
        
        // Retrigger MathJax Typeset if available
        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise([selectedTopic]).catch(err => console.log(err));
        }
    }

    // Update Nav styling
    const btns = document.querySelectorAll('.nav-btn');
    btns.forEach(b => {
        b.classList.remove('active-tab');
        b.classList.add('theme-text-secondary');
    });
    
    // Find matching button
    const activeBtn = document.querySelector(`button[onclick*="switchTopic('${topicId}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active-tab');
        activeBtn.classList.remove('theme-text-secondary');
    }

    // Save active tab
    localStorage.setItem('aktu-exam-active-tab', topicId);

    // Scroll to top of main content
    const mainContainer = document.getElementById('topic-container');
    if (mainContainer) {
        mainContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Global Search Filtering
function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const btns = document.querySelectorAll('.nav-btn');
        
        btns.forEach(btn => {
            const btnText = btn.textContent.toLowerCase();
            const topicId = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
            const topicContent = document.getElementById(topicId + '-topic');
            const contentText = topicContent ? topicContent.textContent.toLowerCase() : '';

            // Match query in button text OR full content text of that section
            if (btnText.includes(query) || contentText.includes(query)) {
                btn.style.display = 'block';
            } else {
                btn.style.display = 'none';
            }
        });
    });
}

// Progress Checklist Tracker
function initProgressTracker() {
    const checkboxes = document.querySelectorAll('.checklist-checkbox');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    if (checkboxes.length === 0) return;

    // Load progress from localStorage
    let savedProgress = JSON.parse(localStorage.getItem('aktu-exam-progress')) || {};

    // Apply saved states
    checkboxes.forEach(cb => {
        const id = cb.id;
        if (savedProgress[id] !== undefined) {
            cb.checked = savedProgress[id];
        }

        // Add event listener to save and update
        cb.addEventListener('change', () => {
            savedProgress[cb.id] = cb.checked;
            localStorage.setItem('aktu-exam-progress', JSON.stringify(savedProgress));
            updateProgressPercentage(checkboxes, progressBar, progressText);
        });
    });

    // Initial calculation
    updateProgressPercentage(checkboxes, progressBar, progressText);
}

function updateProgressPercentage(checkboxes, progressBar, progressText) {
    const total = checkboxes.length;
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    const percentage = Math.round((checked / total) * 100);

    if (progressBar) {
        progressBar.style.width = percentage + '%';
    }
    if (progressText) {
        progressText.textContent = `${percentage}% Complete`;
    }
}
