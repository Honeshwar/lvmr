document.addEventListener('DOMContentLoaded', function() {
    const locationSelect = document.getElementById('location-select');
    const roomTypeSelect = document.getElementById('room-type');
    
    function populateRoomTypeOptions(loc) {
        if (!roomTypeSelect) return;
        const currentVal = roomTypeSelect.value;
        if (loc === 'mohal') {
            roomTypeSelect.innerHTML = `
                <option value="single">Single Room</option>
                <option value="sharing">Double Sharing</option>
                <option value="bunk">Bunk Bed</option>
            `;
        } else {
            roomTypeSelect.innerHTML = `
                <option value="single">Single Room</option>
                <option value="premium">Premium Room (Best Views & Space)</option>
                <option value="sharing">Sharing Room (Bring your partner)</option>
            `;
        }
        
        // Try to keep previous selection
        const optionExists = Array.from(roomTypeSelect.options).some(opt => opt.value === currentVal);
        if (optionExists) {
            roomTypeSelect.value = currentVal;
        } else {
            roomTypeSelect.selectedIndex = 0;
        }
    }

    if (locationSelect) {
        populateRoomTypeOptions(locationSelect.value);
    }

    // Custom Dropdown Logic
    function convertSelectsToCustom() {
        const selects = document.querySelectorAll('.calculator-section select');
        
        selects.forEach(select => {
            if (select.parentNode.classList.contains('custom-select-wrapper')) return;

            const wrapper = document.createElement('div');
            wrapper.className = 'custom-select-wrapper';
            select.parentNode.insertBefore(wrapper, select);
            wrapper.appendChild(select);
            
            const trigger = document.createElement('div');
            trigger.className = 'custom-select-trigger';
            trigger.textContent = select.options[select.selectedIndex] ? select.options[select.selectedIndex].text : '';
            wrapper.appendChild(trigger);
            
            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'custom-options';
            
            function buildOptions() {
                optionsContainer.innerHTML = '';
                Array.from(select.options).forEach((option, index) => {
                    const opt = document.createElement('div');
                    opt.className = 'custom-option' + (index === select.selectedIndex ? ' selected' : '');
                    opt.textContent = option.text;
                    opt.dataset.value = option.value;
                    
                    opt.addEventListener('click', function() {
                        select.value = this.dataset.value;
                        trigger.textContent = this.textContent;
                        
                        wrapper.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
                        this.classList.add('selected');
                        
                        wrapper.classList.remove('open');
                        
                        // Trigger native change event
                        const event = new Event('change');
                        select.dispatchEvent(event);
                    });
                    
                    optionsContainer.appendChild(opt);
                });
            }

            buildOptions();
            wrapper.appendChild(optionsContainer);
            
            trigger.addEventListener('click', function(e) {
                e.stopPropagation();
                document.querySelectorAll('.custom-select-wrapper').forEach(w => {
                    if (w !== wrapper) w.classList.remove('open');
                });
                wrapper.classList.toggle('open');
            });

            // Sync if native select changes from outside
            select.addEventListener('change', function() {
                trigger.textContent = select.options[select.selectedIndex] ? select.options[select.selectedIndex].text : '';
                buildOptions();
            });
        });
        
        document.addEventListener('click', function() {
            document.querySelectorAll('.custom-select-wrapper').forEach(w => w.classList.remove('open'));
        });
    }

    convertSelectsToCustom();

    const roomTypeGroup = document.getElementById('room-type-group');
    const bedTypeGroup = document.getElementById('bed-type-group');
    const bedTypeSelect = document.getElementById('bed-type');
    const sharingTypeGroup = document.getElementById('sharing-type-group');
    const sharingTypeSelect = document.getElementById('sharing-type');
    const sharingNote = document.getElementById('sharing-note');
    const durationSelect = document.getElementById('duration-select');
    const mealGroup = document.getElementById('meal-group');
    const mealsSelect = document.getElementById('meals-select');
    const calculatedPrice = document.getElementById('calculated-price');
    const calcWhatsapp = document.getElementById('calc-whatsapp');
    
    const shamshiInfo = document.getElementById('shamshi-info');
    const mohalInfo = document.getElementById('mohal-info');

    const prices = {
        shamshi: {
            'single': {
                'standard': { 
                    monthly: { 2: 10000, 3: 12000 }, 
                    weekly: { 2: 4500, 3: 6000 }, 
                    'two-week': { 2: 6500, 3: 8000 } 
                },
                'queen': { 
                    monthly: { 2: 11500, 3: 13000 }, 
                    weekly: { 2: 5000, 3: 6500 }, 
                    'two-week': { 2: 7500, 3: 9000 } 
                }
            },
            'premium': { 
                monthly: { 2: 18000, 3: 20000 }, 
                weekly: { 2: 8000, 3: 10000 }, 
                'two-week': { 2: 13000, 3: 15000 } 
            },
            'sharing': {
                'double': { 
                    monthly: { 2: 8500, 3: 10000 }, 
                    weekly: { 2: 4000, 3: 5500 }, 
                    'two-week': { 2: 6000, 3: 7500 } 
                },
                'triple': { 
                    monthly: { 2: 8000, 3: 9500 }, 
                    weekly: { 2: 3500, 3: 5000 }, 
                    'two-week': { 2: 5500, 3: 7000 } 
                }
            }
        },
        mohal: {
            'single': { 
                monthly: { 2: 9500, 3: 11500 }, 
                weekly: { 2: 4000, 3: 5500 }, 
                'two-week': { 2: 6000, 3: 7500 } 
            },
            'sharing': { 
                monthly: { 2: 8000, 3: 9500 }, 
                weekly: { 2: 3500, 3: 5000 }, 
                'two-week': { 2: 5500, 3: 7000 } 
            },
            'bunk': { 
                monthly: { 2: 8000, 3: 9000 }, 
                weekly: { 2: 4000, 3: 5500 }, 
                'two-week': { 2: 6000, 3: 7500 } 
            }
        }
    };

    function updateCalculator() {
        const location = locationSelect.value;
        const duration = durationSelect.value;
        const meals = mealsSelect.value;
        const roomType = roomTypeSelect.value;
        
        const locationName = locationSelect.options[locationSelect.selectedIndex].text;
        const durationName = durationSelect.options[durationSelect.selectedIndex].text;
        const mealsName = mealsSelect.options[mealsSelect.selectedIndex].text;
        
        // Handle Bed Type Visibility for Shamshi Single Room
        if (location === 'shamshi' && roomType === 'single') {
            bedTypeGroup.style.display = 'block';
        } else {
            bedTypeGroup.style.display = 'none';
        }

        // Handle Sharing Note and Sharing Type Visibility for Shamshi Sharing Room
        if (location === 'shamshi' && roomType === 'sharing') {
            sharingTypeGroup.style.display = 'block';
            sharingNote.style.display = 'block';
        } else {
            sharingTypeGroup.style.display = 'none';
            sharingNote.style.display = 'none';
        }

        if (location === 'mohal') {
            roomTypeGroup.style.display = 'block';
            mealGroup.style.display = 'block';
            shamshiInfo.style.display = 'none';
            mohalInfo.style.display = 'block';
            
            let roomTypeName = roomTypeSelect.options[roomTypeSelect.selectedIndex].text;
            let priceData = prices.mohal[roomType];
            
            if (!priceData) priceData = prices.mohal.bunk; // Fallback
            
            let price = 0;
            if (priceData[duration] && typeof priceData[duration] === 'object') {
                price = priceData[duration][meals] || priceData[duration][2];
            } else {
                price = priceData[duration] || 0;
            }
            
            calculatedPrice.textContent = '₹' + price.toLocaleString();
            updateWhatsAppLink(locationName, roomTypeName, durationName, mealsName, price);
        } else {
            roomTypeGroup.style.display = 'block';
            mealGroup.style.display = 'block';
            shamshiInfo.style.display = 'block';
            mohalInfo.style.display = 'none';
            
            let roomTypeName = roomTypeSelect.options[roomTypeSelect.selectedIndex].text;
            let priceData;

            if (roomType === 'sharing') {
                const sharingType = sharingTypeSelect.value;
                const sharingTypeName = sharingTypeSelect.options[sharingTypeSelect.selectedIndex].text;
                roomTypeName = `${roomTypeName} (${sharingTypeName})`;
                priceData = prices.shamshi.sharing[sharingType];
            } else if (roomType === 'single') {
                const bedType = bedTypeSelect.value;
                const bedTypeName = bedTypeSelect.options[bedTypeSelect.selectedIndex].text;
                roomTypeName = `${roomTypeName} (${bedTypeName})`;
                priceData = prices.shamshi.single[bedType];
            } else {
                priceData = prices.shamshi[roomType];
            }

            if (!priceData) {
                // Fallback
                priceData = prices.shamshi.single.standard;
            }
            
            let price = 0;
            if (priceData[duration] && typeof priceData[duration] === 'object') {
                price = priceData[duration][meals] || priceData[duration][2];
            } else {
                price = priceData[duration] || 0;
            }
            
            calculatedPrice.textContent = '₹' + price.toLocaleString();
            updateWhatsAppLink(locationName, roomTypeName, durationName, mealsName, price);
        }
    }

    function updateWhatsAppLink(location, roomType, duration, meals, price) {
        const text = `*New Booking Inquiry - LVMR PG*\n\n` +
                     `*Location:* ${location}\n` +
                     `*Room Type:* ${roomType}\n` +
                     `*Duration:* ${duration}\n` +
                     `*Meals:* ${meals}\n` +
                     `*Total Prize:* ₹${price.toLocaleString()}\n\n` +
                     `Can you please help me with the booking?`;
        const encodedText = encodeURIComponent(text);
        calcWhatsapp.href = `https://wa.me/918580788847?text=${encodedText}`;
    }

    let lastLocation = locationSelect ? locationSelect.value : null;
    locationSelect.addEventListener('change', function(e) {
        const newLoc = this.value;
        if (newLoc !== lastLocation) {
            lastLocation = newLoc;
            populateRoomTypeOptions(newLoc);
            roomTypeSelect.dispatchEvent(new Event('change'));
        }
        updateCalculator();
    });

    roomTypeSelect.addEventListener('change', updateCalculator);
    bedTypeSelect.addEventListener('change', updateCalculator);
    sharingTypeSelect.addEventListener('change', updateCalculator);
    durationSelect.addEventListener('change', updateCalculator);
    mealsSelect.addEventListener('change', updateCalculator);

    // Initial calculation
    updateCalculator();
});
