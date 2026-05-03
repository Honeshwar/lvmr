document.addEventListener('DOMContentLoaded', function() {
    const faqData = {
        "🏠 About LVMR PG": [
            {
                q: "What makes LVMR PG different from other PGs?",
                a: "LVMR PG offers a premium yet homely experience with modern facilities, peaceful surroundings, mountain views, and a strong focus on cleanliness, safety, and long-term comfort."
            },
            {
                q: "Do you host guests from outside India?",
                a: "Yes, LVMR PG has hosted guests from various Indian states as well as international guests from countries like Japan, Germany, Israel, Russia, USA, Canada, France, and more."
            },
            {
                q: "Is it suitable for long-term stay?",
                a: "Yes, LVMR is specially designed for long-term and comfortable living."
            }
        ],
        "🛏️ Rooms & Stay Options": [
            {
                q: "Can I upgrade rooms later?",
                a: "Yes, room upgrades/downgrades are possible based on availability and revised pricing."
            },
            {
                q: "Are rooms furnished?",
                a: "Yes, rooms are fully furnished with basic essentials required for comfortable living."
            },
            {
                q: "Do rooms have mountain views?",
                a: "Many rooms offer beautiful mountain views (subject to availability)."
            }
        ],
        "💰 Pricing & Charges": [
            {
                q: "What is included in rent?",
                a: "Rent includes: Room stay, Basic electricity, WiFi, Power backup, Washing machine usage, and Security & maintenance."
            },
            {
                q: "Are there any hidden charges?",
                a: "No hidden charges. However, extra services (like special electricity usage or add-ons) may be charged separately if applicable."
            },
            {
                q: "Do prices change?",
                a: "Yes, pricing may vary depending on: Room type, Facilities included, Meal plan, and Season & availability."
            }
        ],
        "🍲 Food & Meals": [
            {
                q: "Is food compulsory?",
                a: "Food depends on the plan you choose. Both options may be available (with or without meals)."
            },
            {
                q: "What kind of food is provided?",
                a: "We provide fresh, hygienic, home-style meals daily."
            },
            {
                q: "Can I cook my own food?",
                a: "Cooking using high-power appliances is not allowed without permission."
            }
        ],
        "⚡ Electricity & Appliance Rules": [
            {
                q: "What is included in electricity?",
                a: "Basic usage like lights, fans, and charging devices is included."
            },
            {
                q: "Which appliances are restricted?",
                a: "Heaters, Induction cooktops, Electric kettles, and any heavy equipment are restricted."
            },
            {
                q: "Can I get permission for appliances?",
                a: "Yes, you must take approval from the Office Manager."
            },
            {
                q: "What happens if I break the rule?",
                a: "Strict action will be taken: Immediate removal and security deposit forfeited."
            }
        ],
        "📶 Facilities & Lifestyle": [
            {
                q: "How fast is the WiFi?",
                a: "100 Mbps high-speed WiFi, suitable for work from home and streaming."
            },
            {
                q: "Is power backup available?",
                a: "Yes, 24/7 power backup ensures no interruptions."
            },
            {
                q: "Is the PG safe?",
                a: "Yes, CCTV surveillance and a secure environment are maintained."
            },
            {
                q: "Is it noisy or peaceful?",
                a: "It’s located in a peaceful area, ideal for working professionals."
            }
        ],
        "📍 Location & Nearby Access": [
            {
                q: "Is everything available nearby?",
                a: "Yes, within walking distance: Grocery stores, Medical shops, ATMs & banks, Gyms & hospitals."
            },
            {
                q: "How is connectivity?",
                a: "Excellent connectivity via road, bus, and nearby airport."
            }
        ],
        "🚕 Travel & Reach": [
            {
                q: "How do I reach LVMR PG?",
                a: "Reach Delhi/Chandigarh, take a Volvo to Bhuntar/Kullu, and from there take a cab, auto, or bus."
            },
            {
                q: "Is transport easily available?",
                a: "Yes, autos, buses, and cabs are easily accessible."
            }
        ],
        "💳 Booking Process": [
            {
                q: "How do I confirm my room?",
                a: "By paying ₹2000 advance."
            },
            {
                q: "Is the booking amount refundable?",
                a: "Yes, it becomes part of your security deposit."
            },
            {
                q: "What if I don’t arrive after booking?",
                a: "You must inform in advance; otherwise, the booking may not be held beyond 10 days."
            },
            {
                q: "Can I visit before booking?",
                a: "Yes, visits can be arranged (subject to availability)."
            },
            {
                q: "Is security deposit refundable?",
                a: "Yes, 100% refundable after inspection."
            },
            {
                q: "What can cause security deposit deduction?",
                a: "Damaged items, dirty or poorly maintained room, or broken appliances."
            }
        ],
        "🚪 Check-in / Check-out": [
            {
                q: "What is check-in time?",
                a: "Flexible (coordinate with management)."
            },
            {
                q: "What is check-out process?",
                a: "Room inspection, Key handover, and then the Refund is initiated."
            }
        ],
        "⚠️ Rules & Discipline": [
            {
                q: "What are the main rules?",
                a: "Maintain cleanliness, no damage to property, follow electricity policy, and respect other residents."
            },
            {
                q: "Is partying allowed?",
                a: "No, this is a peaceful living environment."
            },
            {
                q: "Are guests allowed?",
                a: "Guest policy depends on management approval."
            }
        ],
        "🌄 Lifestyle & Experience": [
            {
                q: "Is it good for Work From Home?",
                a: "Yes, ideal environment with fast WiFi and peaceful surroundings."
            },
            {
                q: "Can I stay for short duration?",
                a: "Yes, short-term stays are allowed."
            },
            {
                q: "Are there places to explore nearby?",
                a: "Yes, popular destinations like Kasol, Manali, and Manikaran are easily accessible."
            }
        ]
    };

    // Create Bot HTML
    const botHTML = `
        <div class="bot-container">
            <div class="chat-window" id="chatWindow">
                <div class="chat-header">
                    <h3>LVMR Assistant</h3>
                    <div class="header-actions">
                        <i class="ion-android-expand header-icon" id="toggleFullScreen" title="Full Screen"></i>
                        <i class="ion-close header-icon" id="closeChat" title="Close"></i>
                    </div>
                </div>
                <div class="chat-body" id="chatBody">
                    <div class="bot-msg">Namaste! 🙏 I'm your LVMR Assistant. How can I help you today? Please select a category:</div>
                    <div class="category-list" id="categoryList"></div>
                </div>
            </div>
            <div class="bot-avatar-wrapper" id="botTrigger">
                <div class="bot-hint">Hi! Ask LVMR Bot</div>
                <video autoplay loop muted playsinline>
                    <source src="images/v.mp4" type="video/mp4">
                </video>
                <div class="bot-badge"></div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', botHTML);

    const botTrigger = document.getElementById('botTrigger');
    const chatWindow = document.getElementById('chatWindow');
    const closeChat = document.getElementById('closeChat');
    const chatBody = document.getElementById('chatBody');
    const categoryList = document.getElementById('categoryList');

    function showCategories() {
        categoryList.innerHTML = '';
        Object.keys(faqData).forEach(cat => {
            const btn = document.createElement('div');
            btn.className = 'category-btn';
            btn.innerHTML = `${cat} <i class="ion-chevron-right"></i>`;
            btn.onclick = () => showQuestions(cat);
            categoryList.appendChild(btn);
        });
    }

    function showQuestions(cat) {
        categoryList.innerHTML = '';
        
        const backBtn = document.createElement('div');
        backBtn.className = 'back-btn';
        backBtn.innerHTML = `<i class="ion-arrow-left-c"></i> Back to Categories`;
        backBtn.onclick = showCategories;
        categoryList.appendChild(backBtn);

        faqData[cat].forEach(item => {
            const btn = document.createElement('div');
            btn.className = 'question-btn';
            btn.innerHTML = item.q;
            btn.onclick = () => showAnswer(item.a, item.q, cat);
            categoryList.appendChild(btn);
        });
    }

    function showAnswer(answer, question, cat) {
        categoryList.innerHTML = '';

        const backBtn = document.createElement('div');
        backBtn.className = 'back-btn';
        backBtn.innerHTML = `<i class="ion-arrow-left-c"></i> Back to Questions`;
        backBtn.onclick = () => showQuestions(cat);
        categoryList.appendChild(backBtn);

        const qMsg = document.createElement('div');
        qMsg.className = 'bot-msg';
        qMsg.style.background = '#e3f2fd';
        qMsg.style.fontWeight = '500';
        qMsg.textContent = question;
        categoryList.appendChild(qMsg);

        const aMsg = document.createElement('div');
        aMsg.className = 'bot-msg';
        aMsg.textContent = answer;
        categoryList.appendChild(aMsg);
    }

    botTrigger.onclick = () => {
        const isActive = chatWindow.classList.toggle('active');
        if (isActive) {
            showCategories();
        } else {
            chatWindow.classList.remove('full-screen');
            if (toggleFullScreen) {
                toggleFullScreen.classList.remove('ion-android-contract');
                toggleFullScreen.classList.add('ion-android-expand');
            }
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.classList.remove('chat-expanded');
        }
    };

    const toggleFullScreen = document.getElementById('toggleFullScreen');
    
    toggleFullScreen.onclick = (e) => {
        e.stopPropagation();
        const isFullScreen = chatWindow.classList.toggle('full-screen');
        if (isFullScreen) {
            toggleFullScreen.classList.remove('ion-android-expand');
            toggleFullScreen.classList.add('ion-android-contract');
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            document.body.classList.add('chat-expanded');
        } else {
            toggleFullScreen.classList.remove('ion-android-contract');
            toggleFullScreen.classList.add('ion-android-expand');
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.classList.remove('chat-expanded');
        }
    };

    closeChat.onclick = (e) => {
        e.stopPropagation();
        chatWindow.classList.remove('active');
        chatWindow.classList.remove('full-screen');
        toggleFullScreen.classList.remove('ion-android-contract');
        toggleFullScreen.classList.add('ion-android-expand');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.body.classList.remove('chat-expanded');
    };
});
