// Feature tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const tabSlider = document.querySelector('.tab-slider');
const tabTrack = document.querySelector('.tab-track');
const tabIndicator = document.querySelector('.tab-indicator');

function showTab(selectedIndex) {
    if (!tabSlider || !tabTrack || tabButtons.length === 0) {
        return;
    }

    tabButtons.forEach((button, index) => {
        const isSelected = index === selectedIndex;
        const panel = document.getElementById(button.getAttribute('aria-controls'));

        button.classList.toggle('active', isSelected);
        button.setAttribute('aria-selected', String(isSelected));
        button.tabIndex = isSelected ? 0 : -1;

        if (panel) {
            panel.setAttribute('aria-hidden', String(!isSelected));
            panel.inert = !isSelected;
        }

        if (isSelected && tabIndicator) {
            tabIndicator.style.left = `${button.offsetLeft}px`;
            tabIndicator.style.width = `${button.offsetWidth}px`;
        }
    });

    // Move the row of slides to show the selected feature.
    tabTrack.style.transform = `translateX(-${selectedIndex * tabSlider.clientWidth}px)`;
}

tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => showTab(index));

    // Let keyboard users move between tabs with the arrow keys.
    button.addEventListener('keydown', (event) => {
        let nextIndex;

        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            nextIndex = (index + 1) % tabButtons.length;
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
        } else if (event.key === 'Home') {
            nextIndex = 0;
        } else if (event.key === 'End') {
            nextIndex = tabButtons.length - 1;
        } else {
            return;
        }

        event.preventDefault();
        showTab(nextIndex);
        tabButtons[nextIndex].focus();
    });
});

showTab(0);

window.addEventListener('resize', () => {
    const selectedIndex = Array.from(tabButtons).findIndex((button) => button.classList.contains('active'));
    showTab(Math.max(selectedIndex, 0));
});

// Newsletter form
const emailForm = document.querySelector('.contact-form');
const emailInput = document.getElementById('email');
const inputGroup = document.querySelector('.input-group');
const contactButton = document.getElementById('contact-button');

function checkEmail() {
    if (!emailInput || !inputGroup) {
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hasError = !emailPattern.test(emailInput.value.trim());

    inputGroup.classList.toggle('error', hasError);
    emailInput.setAttribute('aria-invalid', String(hasError));
}

if (emailForm && emailInput && inputGroup) {
    emailForm.addEventListener('submit', (event) => {
        event.preventDefault();
        checkEmail();
    });

    emailInput.addEventListener('input', () => {
        inputGroup.classList.remove('error');
        emailInput.setAttribute('aria-invalid', 'false');
    });
}

if (contactButton) {
    contactButton.addEventListener('click', checkEmail);
}

// Footer counter: count from 35,000 down to zero over 20 seconds.
const joinedCount = document.getElementById('joined-count');
const startingCount = 35000;
const counterDuration = 20000;
const counterStartTime = performance.now();

function updateCounter(currentTime) {
    const progress = Math.min((currentTime - counterStartTime) / counterDuration, 1);

    if (joinedCount) {
        const currentCount = Math.ceil(startingCount * (1 - progress));
        joinedCount.textContent = currentCount.toLocaleString('en-US');
    }

    if (progress < 1) {
        requestAnimationFrame(updateCounter);
    }
}

requestAnimationFrame(updateCounter);

// Mobile navigation menu
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.getElementById('primary-nav');

function setMenuOpen(isOpen) {
    if (!menuButton || !navigation) {
        return;
    }

    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    navigation.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
}

if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
        const menuIsOpen = menuButton.getAttribute('aria-expanded') === 'true';
        setMenuOpen(!menuIsOpen);
    });

    navigation.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setMenuOpen(false));
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            setMenuOpen(false);
        }
    });
}

// Feature popup: open on desktop hover or after 30 seconds.
const featureModal = document.querySelector('.feature-modal');
const modalCloseButtons = document.querySelectorAll('.modal-close, .modal-dismiss');
const topPageElements = document.querySelectorAll('header, .hero');
let modalHasOpened = false;

function openFeatureModal() {
    if (!featureModal || modalHasOpened) {
        return;
    }

    modalHasOpened = true;
    featureModal.showModal();
}

const isDesktopWithMouse = window.matchMedia('(min-width: 769px) and (hover: hover) and (pointer: fine)');

if (isDesktopWithMouse.matches) {
    topPageElements.forEach((element) => {
        element.addEventListener('mouseenter', openFeatureModal, { once: true });
    });
}

modalCloseButtons.forEach((button) => {
    button.addEventListener('click', () => {
        if (featureModal) {
            featureModal.close();
        }
    });
});

if (featureModal) {
    featureModal.addEventListener('click', (event) => {
        if (event.target === featureModal) {
            featureModal.close();
        }
    });

    window.setTimeout(openFeatureModal, 30000);
}
