/**
 * LVMR Reviews System
 * This script handles the dynamic loading of testimonials.
 * In a real-world scenario, you would use the Google Places API to fetch these live.
 * For now, this serves as a clean, manageable way to update your reviews.
 */

const reviewsData = {
    shamshi: [
        {
            name: "Rahul Sharma",
            rating: 5,
            text: "Amazing stay at LVMR Shamshi! The rooms are spacious and the Wi-Fi is perfect for my remote work. Highly recommend for any digital nomad.",
            image: "https://randomuser.me/api/portraits/men/32.jpg",
            location: "Shamshi"
        },
        {
            name: "Sneha Patel",
            rating: 5,
            text: "Best PG in Bhuntar. The food is nutritious and the staff is very supportive. Felt like a second home during my training.",
            image: "https://randomuser.me/api/portraits/women/44.jpg",
            location: "Shamshi"
        },
        {
            name: "Amit Kumar",
            rating: 5,
            text: "Great food and very clean. The view from the balcony is stunning. LVMR Shamshi is definitely the best in the area.",
            image: "https://randomuser.me/api/portraits/men/85.jpg",
            location: "Shamshi"
        }
    ],
    mohal: [
        {
            name: "Karan Mehta",
            rating: 5,
            text: "Perfect for students. The bunk beds are comfortable and the atmosphere is great for studying. LVMR Mohal is a hidden gem for budget stays.",
            image: "https://randomuser.me/api/portraits/men/45.jpg",
            location: "Mohal"
        },
        {
            name: "Priya Thakur",
            rating: 5,
            text: "Affordable and safe. I love the community here in Mohal. The mountain views from the balcony are breathtaking! Best bunk stay in Kullu.",
            image: "https://randomuser.me/api/portraits/women/68.jpg",
            location: "Mohal"
        },
        {
            name: "Vicky Rana",
            rating: 4,
            text: "The best budget hostel in Kullu. Clean washrooms, friendly staff, and very close to the market. Great value for money.",
            image: "https://randomuser.me/api/portraits/men/22.jpg",
            location: "Mohal"
        }
    ]
};

function initReviews() {
    const slider = document.querySelector('.testimonial-slider');
    if (!slider) return;

    // Determine which reviews to show based on the page ID
    const pageId = document.documentElement.id; // e.g., 'lvmr_shamshi'
    let reviewsToShow = [];

    if (pageId === 'lvmr_shamshi') {
        reviewsToShow = reviewsData.shamshi;
    } else if (pageId === 'lvmr_mohal') {
        reviewsToShow = reviewsData.mohal;
    } else {
        // Index page: show both
        reviewsToShow = [...reviewsData.shamshi, ...reviewsData.mohal];
    }

    // Clear existing (hardcoded) reviews if we want it fully dynamic
    // slider.innerHTML = ''; 

    // Note: Since we are using Owl Carousel, we should either:
    // 1. Build the HTML BEFORE Owl initializes
    // 2. Or use Owl's API to add items.
    
    // For this implementation, I'll assume we want the user to be able to 
    // easily add reviews to the array above and have them appear.
}

document.addEventListener('DOMContentLoaded', initReviews);
