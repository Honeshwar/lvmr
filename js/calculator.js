document.addEventListener('DOMContentLoaded', function() {
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
            trigger.textContent = select.options[select.selectedIndex].text;
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
                trigger.textContent = select.options[select.selectedIndex].text;
                buildOptions();
            });
        });
        
        document.addEventListener('click', function() {
            document.querySelectorAll('.custom-select-wrapper').forEach(w => w.classList.remove('open'));
        });
    }

    convertSelectsToCustom();

    const locationSelect = document.getElementById('location-select');
    const roomTypeGroup = document.getElementById('room-type-group');
    const roomTypeSelect = document.getElementById('room-type');
    const durationSelect = document.getElementById('duration-select');
    const mealGroup = document.getElementById('meal-group');
    const mealsSelect = document.getElementById('meals-select');
    const calculatedPrice = document.getElementById('calculated-price');
    const calcWhatsapp = document.getElementById('calc-whatsapp');
    
    const shamshiInfo = document.getElementById('shamshi-info');
    const mohalInfo = document.getElementById('mohal-info');

    const prices = {
        shamshi: {
            'single-3-6': { monthly: { 2: 10000, 3: 12000 }, weekly: 4500, 'two-week': 6500 },
            'double-5-6': { monthly: { 2: 11500, 3: 13000 }, weekly: 5500, 'two-week': 7500 }
        },
        mohal: {
            bunk: { monthly: { 2: 9000, 3: 11000 }, weekly: 3500, 'two-week': 6000 }
        }
    };

    function updateCalculator() {
        const location = locationSelect.value;
        const duration = durationSelect.value;
        const meals = mealsSelect.value;
        
        const locationName = locationSelect.options[locationSelect.selectedIndex].text;
        const durationName = durationSelect.options[durationSelect.selectedIndex].text;
        const mealsName = mealsSelect.options[mealsSelect.selectedIndex].text;
        
        if (location === 'mohal') {
            roomTypeGroup.style.display = 'none';
            mealGroup.style.display = 'block';
            shamshiInfo.style.display = 'none';
            mohalInfo.style.display = 'block';
            
            let priceData = prices.mohal.bunk;
            let price = 0;
            
            if (duration === 'monthly') {
                price = priceData.monthly[meals];
            } else {
                price = priceData[duration];
            }
            
            calculatedPrice.textContent = '₹' + price.toLocaleString();
            updateWhatsAppLink(locationName, 'Premium Bunk Stay', durationName, mealsName, price);
        } else {
            roomTypeGroup.style.display = 'block';
            mealGroup.style.display = 'block';
            shamshiInfo.style.display = 'block';
            mohalInfo.style.display = 'none';
            
            const roomType = roomTypeSelect.value;
            const roomTypeName = roomTypeSelect.options[roomTypeSelect.selectedIndex].text;
            
            let priceData = prices.shamshi[roomType];
            if (!priceData) {
                // Fallback or handle if options mismatch
                priceData = prices.shamshi['single-3-6'];
            }
            
            let price = 0;
            
            if (duration === 'monthly') {
                price = priceData.monthly[meals];
            } else {
                price = priceData[duration];
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

    locationSelect.addEventListener('change', updateCalculator);
    roomTypeSelect.addEventListener('change', updateCalculator);
    durationSelect.addEventListener('change', updateCalculator);
    mealsSelect.addEventListener('change', updateCalculator);

    // Initial calculation
    updateCalculator();
});
