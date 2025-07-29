// Unit conversion data and formulas
export const unitsData = {
    length: {
        name: 'Length',
        icon: 'ruler',
        units: {
            meter: {
                name: 'Meter',
                symbol: 'm',
                convertTo: (value, targetUnit) => {
                    const conversions = {
                        meter: value,
                        kilometer: value / 1000,
                        centimeter: value * 100,
                        millimeter: value * 1000,
                        inch: value * 39.3701,
                        foot: value * 3.28084,
                        yard: value * 1.09361,
                        mile: value / 1609.34
                    };
                    return conversions[targetUnit] || value;
                },
                trivia: 'The meter was originally defined in 1793 as one ten-millionth of the distance from the equator to the North Pole.'
            },
            kilometer: {
                name: 'Kilometer',
                symbol: 'km',
                convertTo: (value, targetUnit) => unitsData.length.units.meter.convertTo(value * 1000, targetUnit) / 1000,
                trivia: 'The kilometer was first introduced in 1799 during the French Revolution.'
            },
            centimeter: {
                name: 'Centimeter',
                symbol: 'cm',
                convertTo: (value, targetUnit) => unitsData.length.units.meter.convertTo(value / 100, targetUnit) * 100,
                trivia: 'A centimeter is about the width of a large paperclip.'
            },
            inch: {
                name: 'Inch',
                symbol: 'in',
                convertTo: (value, targetUnit) => unitsData.length.units.meter.convertTo(value / 39.3701, targetUnit) * 39.3701,
                trivia: 'An inch was originally based on the width of a man\'s thumb.'
            },
            foot: {
                name: 'Foot',
                symbol: 'ft',
                convertTo: (value, targetUnit) => unitsData.length.units.meter.convertTo(value / 3.28084, targetUnit) * 3.28084,
                trivia: 'The foot was originally based on the length of a human foot.'
            },
            yard: {
                name: 'Yard',
                symbol: 'yd',
                convertTo: (value, targetUnit) => unitsData.length.units.meter.convertTo(value / 1.09361, targetUnit) * 1.09361,
                trivia: 'A yard was originally the distance from King Henry I\'s nose to his outstretched thumb.'
            },
            mile: {
                name: 'Mile',
                symbol: 'mi',
                convertTo: (value, targetUnit) => unitsData.length.units.meter.convertTo(value * 1609.34, targetUnit) / 1609.34,
                trivia: 'The word "mile" comes from the Latin "mille passus" meaning one thousand paces.'
            }
        }
    },
    mass: {
        name: 'Mass',
        icon: 'weight',
        units: {
            kilogram: {
                name: 'Kilogram',
                symbol: 'kg',
                convertTo: (value, targetUnit) => {
                    const conversions = {
                        kilogram: value,
                        gram: value * 1000,
                        milligram: value * 1000000,
                        pound: value * 2.20462,
                        ounce: value * 35.274,
                        ton: value / 1000,
                        stone: value * 0.157473
                    };
                    return conversions[targetUnit] || value;
                },
                trivia: 'The kilogram is the only SI base unit with a prefix (kilo) as part of its name.'
            },
            // ... (other mass units)
        }
    },
    temperature: {
        name: 'Temperature',
        icon: 'thermometer-half',
        units: {
            celsius: {
                name: 'Celsius',
                symbol: '°C',
                convertTo: (value, targetUnit) => {
                    switch (targetUnit) {
                        case 'celsius': return value;
                        case 'fahrenheit': return (value * 9/5) + 32;
                        case 'kelvin': return value + 273.15;
                        default: return value;
                    }
                },
                trivia: 'The Celsius scale was originally defined by the freezing point (0°C) and boiling point (100°C) of water at sea level.'
            },
            fahrenheit: {
                name: 'Fahrenheit',
                symbol: '°F',
                convertTo: (value, targetUnit) => {
                    switch (targetUnit) {
                        case 'celsius': return (value - 32) * 5/9;
                        case 'fahrenheit': return value;
                        case 'kelvin': return (value - 32) * 5/9 + 273.15;
                        default: return value;
                    }
                },
                trivia: 'The Fahrenheit scale was proposed by Daniel Gabriel Fahrenheit in 1724.'
            },
            kelvin: {
                name: 'Kelvin',
                symbol: 'K',
                convertTo: (value, targetUnit) => {
                    switch (targetUnit) {
                        case 'celsius': return value - 273.15;
                        case 'fahrenheit': return (value - 273.15) * 9/5 + 32;
                        case 'kelvin': return value;
                        default: return value;
                    }
                },
                trivia: 'The Kelvin scale is an absolute temperature scale where 0K is absolute zero, the theoretical lowest temperature possible.'
            }
        }
    },
    // ... (other categories: volume, time, speed, currency)
};

// Default units for each category
export const defaultUnits = {
    length: { from: 'meter', to: 'foot' },
    mass: { from: 'kilogram', to: 'pound' },
    temperature: { from: 'celsius', to: 'fahrenheit' },
    volume: { from: 'liter', to: 'gallon' },
    time: { from: 'second', to: 'minute' },
    speed: { from: 'kmh', to: 'mph' },
    currency: { from: 'usd', to: 'eur' }
};

// Trivia facts for each category
export const triviaFacts = {
    length: [
        'The Great Pyramid of Giza was originally 146.5 meters (481 feet) tall.',
        'The longest river in the world is the Nile, stretching about 6,650 km (4,130 miles).',
        'A light-year is about 9.46 trillion kilometers (5.88 trillion miles).'
    ],
    mass: [
        'The largest animal on Earth, the blue whale, can weigh up to 200 tons.',
        'A single grain of sand typically weighs about 0.00063 grams.',
        'The average cloud weighs about 1.1 million pounds (500,000 kg)!'
    ],
    temperature: [
        'The highest temperature ever recorded on Earth was 56.7°C (134°F) in Death Valley, California.',
        'Absolute zero is -273.15°C (-459.67°F), the lowest possible temperature.',
        'The average human body temperature is about 37°C (98.6°F).'
    ]
    // ... (trivia for other categories)
};
