// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Bike Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const bikeCards = document.querySelectorAll('.bike-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Get filter value
        const filterValue = button.getAttribute('data-filter');
        
        // Show/hide bike cards based on filter
        bikeCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
                card.classList.add('fade-in');
            } else {
                card.style.display = 'none';
                card.classList.remove('fade-in');
            }
        });
    });
});

// Booking Form Functionality
const bookingForm = document.querySelector('.booking-form');
const bikeTypeSelect = document.getElementById('bike-type');
const rentalPeriodSelect = document.getElementById('rental-period');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const selectedBikeSpan = document.getElementById('selected-bike');
const selectedPeriodSpan = document.getElementById('selected-period');
const totalCostSpan = document.getElementById('total-cost');

// Bike prices (daily rates)
const bikePrices = {
    'city': 15,
    'mountain': 25,
    'electric': 35,
    'road': 30
};

// Period multipliers
const periodMultipliers = {
    'hourly': 1/24 * 5, // $5 per hour
    'daily': 1,
    'weekly': 6 // 6 days price for 7 days (1 day free)
};

// Set minimum date to today
const today = new Date().toISOString().split('T')[0];
startDateInput.setAttribute('min', today);
endDateInput.setAttribute('min', today);

// Update end date minimum when start date changes
startDateInput.addEventListener('change', () => {
    endDateInput.setAttribute('min', startDateInput.value);
    calculateTotal();
});

// Update booking summary when form changes
[bikeTypeSelect, rentalPeriodSelect, startDateInput, endDateInput].forEach(element => {
    element.addEventListener('change', updateBookingSummary);
});

function updateBookingSummary() {
    const bikeType = bikeTypeSelect.value;
    const rentalPeriod = rentalPeriodSelect.value;
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    
    // Update selected bike display
    if (bikeType) {
        const bikeOption = bikeTypeSelect.options[bikeTypeSelect.selectedIndex];
        selectedBikeSpan.textContent = bikeOption.text;
    } else {
        selectedBikeSpan.textContent = '-';
    }
    
    // Update selected period display
    if (rentalPeriod) {
        const periodOption = rentalPeriodSelect.options[rentalPeriodSelect.selectedIndex];
        selectedPeriodSpan.textContent = periodOption.text;
    } else {
        selectedPeriodSpan.textContent = '-';
    }
    
    calculateTotal();
}

function calculateTotal() {
    const bikeType = bikeTypeSelect.value;
    const rentalPeriod = rentalPeriodSelect.value;
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    
    if (!bikeType || !rentalPeriod || !startDateInput.value || !endDateInput.value) {
        totalCostSpan.textContent = '$0';
        return;
    }
    
    if (endDate < startDate) {
        totalCostSpan.textContent = 'Invalid dates';
        return;
    }
    
    const bikePrice = bikePrices[bikeType];
    const periodMultiplier = periodMultipliers[rentalPeriod];
    
    let totalCost = 0;
    
    if (rentalPeriod === 'hourly') {
        // For hourly, assume 8 hours per day on average
        const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        totalCost = daysDiff * 8 * 5; // $5 per hour, 8 hours average per day
    } else if (rentalPeriod === 'daily') {
        const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        totalCost = daysDiff * bikePrice;
    } else if (rentalPeriod === 'weekly') {
        const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        const weeks = Math.ceil(daysDiff / 7);
        totalCost = weeks * bikePrice * periodMultiplier;
    }
    
    totalCostSpan.textContent = `$${totalCost.toFixed(0)}`;
}

// Handle form submission
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(bookingForm);
    const customerName = document.getElementById('customer-name').value;
    const customerEmail = document.getElementById('customer-email').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const bikeType = bikeTypeSelect.value;
    const rentalPeriod = rentalPeriodSelect.value;
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    
    // Basic validation
    if (!customerName || !customerEmail || !customerPhone || !bikeType || !rentalPeriod || !startDate || !endDate) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Date validation
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (start < today) {
        alert('Start date cannot be in the past.');
        return;
    }
    
    if (end < start) {
        alert('End date must be after start date.');
        return;
    }
    
    // Save booking to local storage
    const totalCost = totalCostSpan.textContent;
    const bikeTypeName = bikeTypeSelect.options[bikeTypeSelect.selectedIndex].text;
    
    const booking = {
        id: Date.now(), // Simple ID based on timestamp
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: customerPhone,
        bikeType: bikeType,
        bikeTypeName: bikeTypeName,
        rentalPeriod: rentalPeriod,
        startDate: startDate,
        endDate: endDate,
        totalCost: totalCost,
        bookingDate: new Date().toISOString(),
        status: 'confirmed'
    };
    
    // Get existing bookings from localStorage
    let bookings = JSON.parse(localStorage.getItem('bikeRentalBookings')) || [];
    
    // Add new booking
    bookings.push(booking);
    
    // Save back to localStorage
    localStorage.setItem('bikeRentalBookings', JSON.stringify(bookings));
    
    const confirmationMessage = `
Booking Confirmation

Booking ID: #${booking.id}
Customer: ${customerName}
Email: ${customerEmail}
Phone: ${customerPhone}

Bike: ${bikeTypeName}
Period: ${rentalPeriod}
Start Date: ${startDate}
End Date: ${endDate}

Total Cost: ${totalCost}

Thank you for your booking! You will receive a confirmation email shortly.
Your booking has been saved with ID #${booking.id}.
    `;
    
    alert(confirmationMessage);
    
    // Reset form
    bookingForm.reset();
    updateBookingSummary();
});

// Rent Now buttons functionality
document.querySelectorAll('.bike-card .btn-primary').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get bike type from the card
        const bikeCard = button.closest('.bike-card');
        const bikeCategory = bikeCard.getAttribute('data-category');
        
        // Set the bike type in the booking form
        bikeTypeSelect.value = bikeCategory;
        
        // Update the booking summary
        updateBookingSummary();
        
        // Scroll to booking section
        document.getElementById('book').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Highlight the booking form briefly
        const bookingContainer = document.querySelector('.booking-form-container');
        bookingContainer.style.boxShadow = '0 0 30px rgba(102, 126, 234, 0.3)';
        setTimeout(() => {
            bookingContainer.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.1)';
        }, 2000);
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.bike-card, .pricing-card, .contact-item').forEach(el => {
    observer.observe(el);
});

// Set current year in footer
document.addEventListener('DOMContentLoaded', () => {
    const currentYear = new Date().getFullYear();
    const footerText = document.querySelector('.footer-bottom p');
    if (footerText) {
        footerText.textContent = `© ${currentYear} CycleRent. All rights reserved.`;
    }
});

// Console welcome message
console.log('%c🚴‍♂️ Welcome to CycleRent! 🚴‍♀️', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with ❤️ for cyclists everywhere', 'color: #764ba2; font-size: 14px;');
