// Uttarakhand Tourism Website - JavaScript

// ========== MOBILE NAVIGATION ========== 
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Animate hamburger
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(8px, 8px)' : 'rotate(0)';
            spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
            spans[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(7px, -7px)' : 'rotate(0)';
        });
    }

    // Close menu when link is clicked
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navLinks) {
                navLinks.classList.remove('active');
                // Reset hamburger
                const spans = document.querySelectorAll('.hamburger span');
                spans[0].style.transform = 'rotate(0)';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'rotate(0)';
            }
        });
    });

    // Set active nav link based on current page
    setActiveNavLink();
    
    // Smooth scroll for anchor links
    setupSmoothScroll();
});

// ========== SET ACTIVE NAV LINK ==========
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ========== SMOOTH SCROLL ==========
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ========== FORM VALIDATION ==========
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            this.setupRealTimeValidation();
        }
    }

    setupRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('change', () => this.validateField(input));
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        
        if (this.validateForm()) {
            this.showSuccessMessage();
            this.form.reset();
            
            // Optional: Send form data (for future backend integration)
            console.log('Form submitted successfully');
            
            // Clear success message after 5 seconds
            setTimeout(() => {
                const successMsg = this.form.querySelector('.success-message');
                if (successMsg) {
                    successMsg.classList.remove('show');
                }
            }, 5000);
        }
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        const errorMessage = field.parentElement.querySelector('.error-message');

        // Clear previous errors
        field.classList.remove('error');
        if (errorMessage) {
            errorMessage.classList.remove('show');
        }

        // Required field validation
        if (field.hasAttribute('required') && value === '') {
            isValid = false;
            this.showError(field, 'This field is required');
        } 
        // Email validation
        else if (field.type === 'email' && value !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                this.showError(field, 'Please enter a valid email address');
            }
        }
        // Phone validation
        else if (field.type === 'tel' && value !== '') {
            const phoneRegex = /^[0-9]{10,}$/;
            if (!phoneRegex.test(value.replace(/\D/g, ''))) {
                isValid = false;
                this.showError(field, 'Please enter a valid phone number (10 digits)');
            }
        }
        // Min length validation
        else if (field.hasAttribute('minlength')) {
            const minLength = parseInt(field.getAttribute('minlength'));
            if (value.length > 0 && value.length < minLength) {
                isValid = false;
                this.showError(field, `Minimum ${minLength} characters required`);
            }
        }
        // Max length validation
        else if (field.hasAttribute('maxlength')) {
            const maxLength = parseInt(field.getAttribute('maxlength'));
            if (value.length > maxLength) {
                isValid = false;
                this.showError(field, `Maximum ${maxLength} characters allowed`);
            }
        }

        return isValid;
    }

    showError(field, message) {
        field.classList.add('error');
        let errorMessage = field.parentElement.querySelector('.error-message');
        
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            field.parentElement.appendChild(errorMessage);
        }
        
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
    }

    showSuccessMessage() {
        let successMsg = this.form.querySelector('.success-message');
        if (successMsg) {
            successMsg.classList.add('show');
        }
    }
}

// ========== SCROLL ANIMATIONS ==========
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .feature-box, section').forEach(el => {
        observer.observe(el);
    });
}

// ========== LAZY LOADING IMAGES ==========
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-lazy]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.lazy;
                    img.removeAttribute('data-lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.lazy;
            img.removeAttribute('data-lazy');
        });
    }
}

// ========== PAGE LOAD FUNCTIONS ==========
window.addEventListener('load', function() {
    setupScrollAnimations();
    setupLazyLoading();
});

// ========== CONTACT FORM VALIDATION ==========
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = new FormValidator('contactForm');
    const bookingForm = new FormValidator('bookingForm');
});

// ========== UTILITY FUNCTIONS ==========

// Scroll to top button
function setupScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTopBtn');
    
    window.addEventListener('scroll', function() {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            if (scrollBtn) scrollBtn.style.display = 'block';
        } else {
            if (scrollBtn) scrollBtn.style.display = 'none';
        }
    });

    if (scrollBtn) {
        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize scroll to top
document.addEventListener('DOMContentLoaded', setupScrollToTop);

// ========== SEARCH FUNCTIONALITY ==========
function setupSearch() {
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
        searchBox.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.card');
            
            cards.forEach(card => {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                const text = card.querySelector('.card-text').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || text.includes(searchTerm)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.3s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', setupSearch);

// ========== FILTER FUNCTIONALITY ==========
function setupFilters() {
    const filterBtns = document.querySelectorAll('[data-filter]');
    const filterItems = document.querySelectorAll('[data-category]');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter items
            filterItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.3s ease';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', setupFilters);

// ========== IMAGE LIGHTBOX ==========
class ImageLightbox {
    constructor() {
        this.currentImageIndex = 0;
        this.images = [];
        this.setupLightbox();
    }

    setupLightbox() {
        const galleryItems = document.querySelectorAll('[data-lightbox]');
        
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.openLightbox(index);
            });
        });
    }

    openLightbox(index) {
        this.currentImageIndex = index;
        // Lightbox implementation (optional enhancement)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ImageLightbox();
});

// ========== LOCAL STORAGE - REMEMBER USER PREFERENCES ==========
class UserPreferences {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.setupThemeToggle();
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
    }

    applyTheme() {
        if (this.theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new UserPreferences();
});

// ========== ACCESSIBILITY - FOCUS MANAGEMENT ==========
function setupAccessibility() {
    document.addEventListener('keydown', function(e) {
        // Escape key to close menus
        if (e.key === 'Escape') {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) {
                navLinks.classList.remove('active');
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', setupAccessibility);

// ========== PERFORMANCE - DEBOUNCE FUNCTION ==========
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========== CONSOLE LOG CUSTOM MESSAGE ==========
console.log('%c Uttarakhand Tourism Website', 'color: #2c5aa0; font-size: 18px; font-weight: bold;');
console.log('%c Built with HTML5, CSS3, Bootstrap & JavaScript', 'color: #ff6b3d; font-size: 12px;');
