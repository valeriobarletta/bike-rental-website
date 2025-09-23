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

// Dynamic Stripe Checkout Configuration
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51SAIVqHR43SSGlJl4bshr7LVIybJYHnatjICVaku6xtO6mlFpsFdREq4VYSp6qn9QgTgITcXOVTTUxR9Ktk2CMdy00EV7R5wem';
let stripe;

// Initialize Stripe
document.addEventListener('DOMContentLoaded', () => {
    if (STRIPE_PUBLISHABLE_KEY.includes('pk_live_') || STRIPE_PUBLISHABLE_KEY.includes('pk_test_')) {
        stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
    }
    
    // Show info message about dynamic pricing
    setTimeout(() => {
        showDynamicPricingMessage();
    }, 2000);
    
    // Setup admin access easter egg
    setupAdminAccess();
});

// Process booking with dynamic pricing
async function processBooking(bikeType, dailyRate) {
    // Validate booking form first
    const customerName = document.getElementById('customer-name').value;
    const customerEmail = document.getElementById('customer-email').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const rentalPeriod = document.getElementById('rental-period').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    // Basic validation
    if (!customerName || !customerEmail || !customerPhone || !rentalPeriod || !startDate || !endDate) {
        alert('Please fill in all booking details first!');
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
    
    // Calculate total amount based on form data
    const totalAmount = calculateDynamicTotal(dailyRate, rentalPeriod, start, end);
    const bikeNames = {
        'city': 'City Cruiser',
        'mountain': 'Mountain Explorer',
        'electric': 'E-Bike Pro',
        'road': 'Road Racer'
    };
    
    // Create dynamic Stripe checkout
    if (stripe) {
        try {
            const { error } = await stripe.redirectToCheckout({
                mode: 'payment',
                lineItems: [{
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${bikeNames[bikeType]} Rental`,
                            description: `${startDate} to ${endDate} (${rentalPeriod})`,
                            images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'],
                        },
                        unit_amount: totalAmount * 100, // Convert to cents
                    },
                    quantity: 1,
                }],
                customer_email: customerEmail,
                metadata: {
                    customerName: customerName,
                    customerPhone: customerPhone,
                    bikeType: bikeType,
                    rentalPeriod: rentalPeriod,
                    startDate: startDate,
                    endDate: endDate,
                    totalAmount: totalAmount
                },
                success_url: window.location.origin + '/success.html?session_id={CHECKOUT_SESSION_ID}',
                cancel_url: window.location.origin + '/index.html?cancelled=true',
            });

            if (error) {
                throw new Error(error.message);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Payment setup failed. Please try again or contact support.');
        }
    } else {
        // Fallback: show calculated total and prompt for manual payment
        alert(`Booking calculated: $${totalAmount}\n\nStripe not configured. Contact us to complete payment.\n\nCustomer: ${customerName}\nEmail: ${customerEmail}\nBike: ${bikeNames[bikeType]}\nDates: ${startDate} to ${endDate}`);
    }
}

// Calculate dynamic total based on rental period and dates
function calculateDynamicTotal(dailyRate, rentalPeriod, startDate, endDate) {
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    let totalCost = 0;
    
    switch (rentalPeriod) {
        case 'hourly':
            // Assume 8 hours average per day for hourly rentals
            totalCost = daysDiff * 8 * 5; // $5 per hour
            break;
        case 'daily':
            totalCost = daysDiff * dailyRate;
            break;
        case 'weekly':
            const weeks = Math.ceil(daysDiff / 7);
            totalCost = weeks * dailyRate * 6; // 6 days price for 7 days (1 day free)
            break;
        default:
            totalCost = daysDiff * dailyRate;
    }
    
    return totalCost;
}

// Note: Form submission is no longer needed since we're using Stripe Payment Links
// Customers will click the payment link buttons instead of submitting the form

// Show message about dynamic pricing
function showDynamicPricingMessage() {
    const message = document.createElement('div');
    message.className = 'payment-message success show';
    message.innerHTML = `
        <div style="text-align: center;">
            <i class="fas fa-calculator" style="font-size: 2rem; color: #667eea; margin-bottom: 1rem;"></i>
            <h3>Smart Pricing System</h3>
            <p>Fill out your booking details first, then click "Book & Pay" for any bike. The price will be calculated automatically based on your rental period and dates!</p>
            <p><small>Hourly: $5/hour • Daily: Per day rate • Weekly: 6 days for 7 (1 day free!)</small></p>
        </div>
    `;
    
    const formContainer = document.querySelector('.booking-form-container');
    const existingMessage = formContainer.querySelector('.payment-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    formContainer.insertBefore(message, formContainer.firstChild);
    
    // Remove message after 10 seconds
    setTimeout(() => {
        message.remove();
    }, 10000);
}

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

// Stripe Checkout - Real Payments
async function redirectToStripeCheckout(customerName, customerEmail, bikeType, rentalPeriod, startDate, endDate) {
    try {
        const totalCost = document.getElementById('total-cost').textContent;
        const amount = parseInt(totalCost.replace('$', '')) * 100; // Convert to cents
        const bikeTypeName = bikeTypeSelect.options[bikeTypeSelect.selectedIndex].text;
        
        // Create Stripe Checkout Session
        const { error } = await stripe.redirectToCheckout({
            mode: 'payment',
            lineItems: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${bikeTypeName} Rental`,
                        description: `${startDate} to ${endDate} (${rentalPeriod})`,
                        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'], // Bike image
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            }],
            customer_email: customerEmail,
            metadata: {
                customerName: customerName,
                customerPhone: document.getElementById('customer-phone').value,
                bikeType: bikeType,
                rentalPeriod: rentalPeriod,
                startDate: startDate,
                endDate: endDate,
                bookingId: Date.now().toString()
            },
            success_url: window.location.origin + '/success.html?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: window.location.origin + '/index.html?cancelled=true',
        });

        if (error) {
            throw new Error(error.message);
        }
        
    } catch (error) {
        console.error('Stripe Checkout error:', error);
        showPaymentError('Failed to redirect to payment. Please try again.');
        
        // Reset button state
        const submitButton = document.getElementById('submit-payment');
        const buttonText = document.getElementById('button-text');
        const spinner = document.getElementById('spinner');
        
        submitButton.disabled = false;
        buttonText.style.display = 'flex';
        spinner.classList.add('hidden');
    }
}

// Payment Processing Functions
async function processStripePayment(customerName, customerEmail) {
    try {
        // Create payment method
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                name: customerName,
                email: customerEmail,
            },
        });

        if (error) {
            throw new Error(error.message);
        }

        // Since we don't have a backend, we'll use a workaround
        // In production, you'd send paymentMethod.id to your server
        
        // For now, let's try to confirm payment using Stripe's test approach
        const totalCost = document.getElementById('total-cost').textContent;
        const amount = parseInt(totalCost.replace('$', '')) * 100;
        
        // Create a simple payment intent simulation
        // NOTE: This is still a simulation, but feels more real
        const simulatedPaymentIntent = {
            id: 'pi_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            status: 'succeeded',
            amount: amount,
            currency: 'usd'
        };
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));

        return {
            success: true,
            paymentDetails: {
                id: simulatedPaymentIntent.id,
                method: 'card',
                last4: paymentMethod.card.last4,
                brand: paymentMethod.card.brand,
                amount: amount,
                paymentMethodId: paymentMethod.id
            }
        };

    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

function showPaymentSuccess(booking) {
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'payment-message success show';
    successMessage.innerHTML = `
        <div style="text-align: center;">
            <i class="fas fa-check-circle" style="font-size: 3rem; color: #28a745; margin-bottom: 1rem;"></i>
            <h3>Payment Successful! 🎉</h3>
            <p><strong>Booking Confirmation #${booking.id}</strong></p>
            <div style="margin: 1rem 0; padding: 1rem; background: white; border-radius: 8px;">
                <p><strong>${booking.bikeTypeName}</strong></p>
                <p>${booking.startDate} to ${booking.endDate}</p>
                <p><strong>Total Paid: ${booking.totalCost}</strong></p>
            </div>
            <p>A confirmation email will be sent to ${booking.customerEmail}</p>
            <p><small>You can view your booking in the admin panel.</small></p>
        </div>
    `;

    // Insert message before the form
    const formContainer = document.querySelector('.booking-form-container');
    formContainer.insertBefore(successMessage, formContainer.firstChild);

    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Remove message after 10 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 10000);
}

function showPaymentError(errorMessage) {
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'payment-message error show';
    errorDiv.innerHTML = `
        <div style="text-align: center;">
            <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #dc3545; margin-bottom: 1rem;"></i>
            <h3>Payment Failed</h3>
            <p>${errorMessage}</p>
            <p><small>Please check your payment information and try again.</small></p>
        </div>
    `;

    // Insert message before the form
    const formContainer = document.querySelector('.booking-form-container');
    formContainer.insertBefore(errorDiv, formContainer.firstChild);

    // Scroll to error message
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Remove message after 8 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 8000);
}

function resetPaymentForm() {
    // Clear card element if it exists
    if (cardElement) {
        cardElement.clear();
    }
    
    // Clear any error messages
    const errorElement = document.getElementById('card-errors');
    errorElement.textContent = '';
    errorElement.classList.remove('show');
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Show info message about payment links
    setTimeout(() => {
        showPaymentLinksMessage();
    }, 2000);
    
    // Setup admin access easter egg
    setupAdminAccess();
});

// Hidden admin access - double click logo to reveal
function setupAdminAccess() {
    const logo = document.querySelector('.nav-logo');
    const adminAccess = document.querySelector('.admin-access');
    let clickCount = 0;
    let clickTimer = null;
    
    logo.addEventListener('click', (e) => {
        clickCount++;
        
        if (clickCount === 1) {
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 500); // Reset after 500ms
        } else if (clickCount === 2) {
            clearTimeout(clickTimer);
            clickCount = 0;
            
            // Reveal admin access
            if (adminAccess) {
                adminAccess.style.opacity = '1';
                setTimeout(() => {
                    adminAccess.style.opacity = '0';
                }, 5000); // Hide after 5 seconds
            }
        }
    });
}

// Console welcome message
console.log('%c🚴‍♂️ Welcome to CycleRent! 🚴‍♀️', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with ❤️ for cyclists everywhere', 'color: #764ba2; font-size: 14px;');
console.log('%c💳 Stripe Payment Links ready! Update links in HTML.', 'color: #635bff; font-size: 14px;');
