// Main application script for Convertly
import { unitsData, defaultUnits, triviaFacts } from './units.js';

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const categoryTabs = document.querySelectorAll('.category-tabs .tab-btn');
    const fromValueInput = document.getElementById('from-value');
    const toValueInput = document.getElementById('to-value');
    const fromUnitSelect = document.getElementById('from-unit');
    const toUnitSelect = document.getElementById('to-unit');
    const swapButton = document.getElementById('swap-units');
    const addFavoriteButton = document.getElementById('add-favorite');
    const clearRecentButton = document.getElementById('clear-recent');
    const recentList = document.getElementById('recent-list');
    const themeToggle = document.getElementById('theme-toggle');
    const conversionFormula = document.getElementById('conversion-formula');
    const triviaText = document.getElementById('trivia-text');
    
    // State
    let currentCategory = 'length';
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let recentConversions = JSON.parse(localStorage.getItem('recentConversions')) || [];
    let isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    
    // Initialize the app
    function init() {
        setupEventListeners();
        updateTheme();
        loadCategory(currentCategory);
        updateRecentConversions();
        showRandomTrivia();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Category tabs
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.dataset.category;
                if (category && category !== currentCategory) {
                    currentCategory = category;
                    loadCategory(category);
                    updateActiveTab();
                    convert();
                    showRandomTrivia();
                }
            });
        });
        
        // Input and select changes
        fromValueInput.addEventListener('input', convert);
        fromUnitSelect.addEventListener('change', convert);
        toUnitSelect.addEventListener('change', convert);
        
        // Buttons
        swapButton.addEventListener('click', swapUnits);
        addFavoriteButton.addEventListener('click', toggleFavorite);
        clearRecentButton.addEventListener('click', clearRecentConversions);
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Load a category and populate unit selectors
    function loadCategory(category) {
        const categoryData = unitsData[category];
        if (!categoryData) return;
        
        // Clear and populate unit selectors
        fromUnitSelect.innerHTML = '';
        toUnitSelect.innerHTML = '';
        
        // Get default units for this category
        const defaultFrom = defaultUnits[category]?.from || Object.keys(categoryData.units)[0];
        const defaultTo = defaultUnits[category]?.to || Object.keys(categoryData.units)[1] || Object.keys(categoryData.units)[0];
        
        // Populate unit options
        Object.entries(categoryData.units).forEach(([key, unit]) => {
            const option1 = document.createElement('option');
            option1.value = key;
            option1.textContent = `${unit.name} (${unit.symbol})`;
            if (key === defaultFrom) option1.selected = true;
            
            const option2 = option1.cloneNode(true);
            if (key === defaultTo) option2.selected = true;
            
            fromUnitSelect.appendChild(option1);
            toUnitSelect.appendChild(option2);
        });
        
        // Update conversion formula display
        updateConversionFormula();
        
        // Trigger conversion with default values
        convert();
    }
    
    // Convert between units
    function convert() {
        const fromUnit = fromUnitSelect.value;
        const toUnit = toUnitSelect.value;
        const inputValue = parseFloat(fromValueInput.value) || 0;
        
        const categoryData = unitsData[currentCategory];
        const fromUnitData = categoryData?.units[fromUnit];
        
        if (!fromUnitData || !fromUnitData.convertTo) {
            toValueInput.value = 'N/A';
            return;
        }
        
        // Perform the conversion
        const result = fromUnitData.convertTo(inputValue, toUnit);
        
        // Format the result
        toValueInput.value = formatNumber(result);
        
        // Add to recent conversions
        addToRecentConversions({
            category: currentCategory,
            fromValue: inputValue,
            fromUnit: fromUnit,
            toValue: result,
            toUnit: toUnit,
            timestamp: new Date().toISOString()
        });
    }
    
    // Swap the from and to units
    function swapUnits() {
        const tempUnit = fromUnitSelect.value;
        fromUnitSelect.value = toUnitSelect.value;
        toUnitSelect.value = tempUnit;
        
        // Also swap the values
        const tempValue = fromValueInput.value;
        fromValueInput.value = toValueInput.value;
        toValueInput.value = tempValue;
        
        convert();
    }
    
    // Toggle favorite status of current conversion
    function toggleFavorite() {
        const fromUnit = fromUnitSelect.value;
        const toUnit = toUnitSelect.value;
        const favoriteId = `${currentCategory}:${fromUnit}:${toUnit}`;
        
        const favoriteIndex = favorites.findIndex(fav => fav.id === favoriteId);
        
        if (favoriteIndex === -1) {
            // Add to favorites
            favorites.push({
                id: favoriteId,
                category: currentCategory,
                fromUnit,
                toUnit
            });
            addFavoriteButton.innerHTML = '<i class="fas fa-star"></i>';
            addFavoriteButton.classList.add('favorited');
            showNotification('Added to favorites!');
        } else {
            // Remove from favorites
            favorites.splice(favoriteIndex, 1);
            addFavoriteButton.innerHTML = '<i class="far fa-star"></i>';
            addFavoriteButton.classList.remove('favorited');
            showNotification('Removed from favorites');
        }
        
        // Save to localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    
    // Add a conversion to recent conversions
    function addToRecentConversions(conversion) {
        // Check if this exact conversion is already in the recent list
        const existingIndex = recentConversions.findIndex(
            item => item.category === conversion.category &&
                   item.fromUnit === conversion.fromUnit &&
                   item.toUnit === conversion.toUnit &&
                   item.fromValue === conversion.fromValue
        );
        
        if (existingIndex !== -1) {
            // Move to top if it exists
            recentConversions.splice(existingIndex, 1);
        }
        
        // Add to the beginning of the array
        recentConversions.unshift(conversion);
        
        // Keep only the 10 most recent
        if (recentConversions.length > 10) {
            recentConversions = recentConversions.slice(0, 10);
        }
        
        // Save to localStorage and update UI
        localStorage.setItem('recentConversions', JSON.stringify(recentConversions));
        updateRecentConversions();
    }
    
    // Update the recent conversions list
    function updateRecentConversions() {
        recentList.innerHTML = '';
        
        if (recentConversions.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No recent conversions';
            li.className = 'no-recent';
            recentList.appendChild(li);
            return;
        }
        
        recentConversions.forEach(conversion => {
            const li = document.createElement('li');
            
            const fromUnitData = unitsData[conversion.category]?.units[conversion.fromUnit];
            const toUnitData = unitsData[conversion.category]?.units[conversion.toUnit];
            
            if (!fromUnitData || !toUnitData) return;
            
            li.innerHTML = `
                <span class="recent-from">${formatNumber(conversion.fromValue)} ${fromUnitData.symbol}</span>
                <span class="recent-arrow">→</span>
                <span class="recent-to">${formatNumber(conversion.toValue)} ${toUnitData.symbol}</span>
                <span class="recent-category">${unitsData[conversion.category].name}</span>
            `;
            
            li.addEventListener('click', () => {
                // Switch to this conversion
                currentCategory = conversion.category;
                loadCategory(currentCategory);
                fromUnitSelect.value = conversion.fromUnit;
                toUnitSelect.value = conversion.toUnit;
                fromValueInput.value = conversion.fromValue;
                convert();
                updateActiveTab();
            });
            
            recentList.appendChild(li);
        });
    }
    
    // Clear recent conversions
    function clearRecentConversions() {
        if (recentConversions.length === 0) return;
        
        if (confirm('Are you sure you want to clear your recent conversions?')) {
            recentConversions = [];
            localStorage.setItem('recentConversions', JSON.stringify(recentConversions));
            updateRecentConversions();
            showNotification('Recent conversions cleared');
        }
    }
    
    // Toggle between dark and light theme
    function toggleTheme() {
        isDarkMode = !isDarkMode;
        updateTheme();
        localStorage.setItem('isDarkMode', isDarkMode);
    }
    
    // Update the theme based on current state
    function updateTheme() {
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
    
    // Show a random trivia fact for the current category
    function showRandomTrivia() {
        const facts = triviaFacts[currentCategory];
        if (facts && facts.length > 0) {
            const randomIndex = Math.floor(Math.random() * facts.length);
            triviaText.textContent = facts[randomIndex];
        }
    }
    
    // Update the active tab in the UI
    function updateActiveTab() {
        categoryTabs.forEach(tab => {
            if (tab.dataset.category === currentCategory) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }
    
    // Update the conversion formula display
    function updateConversionFormula() {
        const fromUnit = fromUnitSelect.options[fromUnitSelect.selectedIndex]?.text || '';
        const toUnit = toUnitSelect.options[toUnitSelect.selectedIndex]?.text || '';
        conversionFormula.textContent = `1 ${fromUnit} = ? ${toUnit}`;
    }
    
    // Show a notification message
    function showNotification(message, duration = 2000) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Add to DOM and animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after duration
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, duration);
    }
    
    // Format a number with appropriate decimal places
    function formatNumber(num) {
        // If the number is very small or very large, use scientific notation
        if (Math.abs(num) < 0.0001 || Math.abs(num) >= 1000000) {
            return num.toExponential(4);
        }
        
        // Otherwise, use fixed decimal places based on the magnitude
        const decimalPlaces = Math.max(0, 4 - Math.floor(Math.log10(Math.abs(num))) - 1);
        return parseFloat(num.toFixed(decimalPlaces)).toString();
    }
    
    // Initialize the app
    init();
});
