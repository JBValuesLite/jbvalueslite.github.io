let isBruleeMode = false;
const cardsDiv = document.querySelector(".cards");

var vehicles;
var cosmetics;

var selected = 0;
var display = "Vehicles";

function removeAll() {
    cardsDiv.querySelectorAll(".card").forEach(c => {c.remove()})
}

function createCard(element) {
    cardsDiv.innerHTML += `
    <div class="${element.demand.toLowerCase().replaceAll(' ', '-')} card">
        <div class="demand ${element.demand.toLowerCase().replaceAll(' ', '-')}">${element.demand}</div>
        <div class="img">
            <img src="${element.image}">
        </div>
        <div class="infos">
        <div id="name">${element.name}</div>
        <div class="prices">
            <div id="value" data-original-value="${element.value}">$${element.value}</div>
            <div id="trend">${element.trend}</div>
        </div>
    </div>

    </div>`
}

function refresh(index) {
    document.querySelector(".filter").value="no";

    fetch("https://jbvalues-app.herokuapp.com/itemdata2").then(result=>result.json()).then(response=>{
        vehicles = response.vehicles;
        cosmetics = response.cosmetics;
    
        if (index == 0) {
            removeAll()
            for (const key in vehicles) {
                const element = vehicles[key];
                createCard(element)
            }
            display = "Vehicles";
        } else if (index == 1) {
            removeAll()
            for (const key in cosmetics) {
                const element = cosmetics[key];
                createCard(element)
            }
            display = "Cosmetics";
        }

        document.querySelector(".display").textContent = display;
    })
}

// Search
function filter() {
    document.querySelectorAll(".card").forEach(card => {
        if (!card.querySelector(".infos").querySelector("#name").textContent.toLowerCase().includes(document.querySelector("#search").value)) {
            card.style.display = "none";
        } else {
            card.style.display = "block"
        }
    })  
    if (!document.querySelector("#search").value=="") {
        document.querySelector(".display").style.display="none";
    } else {
        document.querySelector(".display").textContent = display;
    }
}
function mapDemandToValue(demand) {
    const demandMap = {
        'Very High': 6,
        'High': 5,
        'Medium': 4,
        'Below Average': 3,
        'Low': 2,
        'Very Low': 1,
        'Extremely Low': 0
    };
    return demandMap[demand] || 0; // Default to 0 if demand is not found
}
function parsePrice(price) {
    // Remove non-numeric characters and parse as a float
    return parseFloat(price.replace(/[^0-9.-]+/g, ''));
}

function filter_cards() {
    const filterOption = document.querySelector('.filter').value;
    const cardsContainer = document.querySelector('.cards');
    const cards = Array.from(cardsContainer.getElementsByClassName('card'));

    switch (filterOption) {
        case 'alphabetical':
            cards.sort((a, b) => {
                const nameA = a.querySelector('#name').textContent.toLowerCase();
                const nameB = b.querySelector('#name').textContent.toLowerCase();
                return nameA.localeCompare(nameB);
            });
            break;

        case 'lowest':
            cards.sort((a, b) => {
                const valueA = parsePrice(a.querySelector('#value').textContent);
                const valueB = parsePrice(b.querySelector('#value').textContent);
                return valueA - valueB;
            });
            break;

        case 'highest':
            cards.sort((a, b) => {
                const valueA = parsePrice(a.querySelector('#value').textContent);
                const valueB = parsePrice(b.querySelector('#value').textContent);
                return valueB - valueA;
            });
            break;

        case 'demand':
            cards.sort((a, b) => {
                const demandA = a.querySelector('.demand').textContent.trim();
                const demandB = b.querySelector('.demand').textContent.trim();
                const valueA = mapDemandToValue(demandA);
                const valueB = mapDemandToValue(demandB);
                return valueB - valueA;
            });
            break;

        default:
            // No Filters or unknown filter option
            // Do nothing, cards will stay as they are
            break;
    }

    // Clear the cards container
    cardsContainer.innerHTML = '';

    // Re-append the sorted cards to the container
    cards.forEach(card => cardsContainer.appendChild(card));
}

function switchToBrulee() {
    const cardsContainer = document.querySelector('.cards');
    const cards = Array.from(cardsContainer.getElementsByClassName('card'));

    cards.forEach(card => {
        const valueElement = card.querySelector('#value');
        if (valueElement) {
            const originalValue = parsePrice(valueElement.getAttribute('data-original-value'));
            if (isBruleeMode) {
                // Switch back to original value
                valueElement.textContent = `$${originalValue.toLocaleString()}`;
            } else {
                // Switch to Brulee value
                const bruleeValue = originalValue / 10000000;
                valueElement.textContent = `$${bruleeValue.toFixed(2)}`;
            }
        }
    });

    // Toggle the mode
    isBruleeMode = !isBruleeMode;
}

refresh(0)
