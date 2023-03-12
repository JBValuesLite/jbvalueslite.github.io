let everything = new Array();

function switchToHypers() {
    const parentDiv = document.getElementsByClassName('cards')[0];
    document.querySelectorAll(".cards .card").forEach(card => {
        card.style.display = "none";
    })

    addCard("Hyper Red LVL5", "color", "", "4 Torpedos")
    addCard("Hyper Green LVL5", "color", "", "3 Torpedos + Beam")
    addCard("Hyper Blue LVL5", "color", "", "3 Torpedos + Arachnid")
    addCard("Hyper Pink LVL5", "color", "", "2 Torpedos + Icebreaker")
    addCard("Hyper Diamond LVL5", "color", "", "2 Torpedos + Brulee")
    addCard("Hyper Purple LVL5", "color", "", "2 Torpedos")
    addCard("Hyper Orange LVL5", "color", "", "Torpedo + Checker")
    addCard("Hyper Yellow LVL5", "color", "", "Torpedo + Icebreaker")

    addCard("Red Lvl 4", "color", "",	"2 Torpedos")
    addCard("Green Lvl 4", "color", "",	"Torpedo + Arachnid")
    addCard("Blue Lvl 4", "color", "",	"Torpedo + Checker")
    addCard("Pink Lvl 4", "color", "",	"Torpedo + Concept")
    addCard("Diamond Lvl 4", "color", "",	"Torpedo")
    addCard("Purple Lvl 4", "color", "",	"Beam Hybrid + Javelin")
    addCard("Orange Lvl 4", "color", "",	"Arachnid")
    addCard("Yellow Lvl 4", "color", "",	"Checker")
}  

// bruh moment js (gonna try to make it smaller)
function hideCosmetics() {
    const cards = document.querySelectorAll('.cards .card'); // get all card elements within the "cards" div
    document.getElementsByClassName("filter")[0].value = "";
    cards.forEach(card => {
        if (!card.querySelector('h2').textContent.includes("(Vehicle)")) {
            card.style.display = "none";
        } else {
            card.style.display = "block";
        }
    });
}

function hideVehicles() {
    const cards = document.querySelectorAll('.cards .card'); // get all card elements within the "cards" div
    document.getElementsByClassName("filter")[0].value = "";
    cards.forEach(card => {
        if (card.querySelector('h2').textContent.includes("(Vehicle)")) {
            card.style.display = "none";
        } else {
            card.style.display = "block";
        }
    });
}

function search(text) {
    const cards = document.querySelectorAll('.cards .card'); // get all card elements within the "cards" div
    if (document.getElementsByClassName("filter")[0].value.length === 0) {
        document.getElementsByClassName("filter")[0].value = "";
    }
    cards.forEach(card => {
        const h1 = card.querySelector('h1'); // get the h1 element within the card
        const h1Text = h1.textContent.trim(); // get the text content of the h1 element
        if (!h1Text.toLowerCase().includes(text.toLowerCase())) { // check if the h1 text does not include the search text (case-insensitive)
            card.style.display = 'none'; // hide the card
        } else {
            card.style.display = 'block'; // show the card (in case it was previously hidden)
        }
    });
}

// add card dynamically \\
function addCard(name, type, imageSrc, price) {
    const parentDiv = document.getElementsByClassName('cards')[0];
    const h1 = document.createElement('h1');
    const h2 = document.createElement('h2');
    const img = document.createElement('img');
    const p = document.createElement('p');

    const newDiv = document.createElement('div');
    newDiv.classList.add('card');

    h1.textContent = name;
    newDiv.appendChild(h1);

    h2.textContent = type;
    newDiv.appendChild(h2);

    img.setAttribute('src', imageSrc);
    img.setAttribute('onerror', onerror = "this.onerror=null;this.src='https://a5.behance.net/4cec702805824ada0b02e354d3d29193c8ccdd9c/img/covers/808-blocked.png';")
    newDiv.appendChild(img);

    p.textContent = price;
    newDiv.appendChild(p);
    parentDiv.appendChild(newDiv);
}

window.onload = function () {
    console.log('Loaded bare-bones page');
    console.log('Loading vehicles...');
    // Load Vehicles
    fetch('https://jbvalues-app.herokuapp.com/itemdata2')
        .then(response => response.json())
        .then(data => {
            const vehicles = data.vehicles;
            for (const key in vehicles) {
                const vehicle = vehicles[key];
                const name = vehicle.name;
                const type = `(${vehicle.type})`;
                const image = vehicle.image;
                const price = "Value: " + vehicle.value;
                // call your script with name, type, and price as arguments
                addCard(name, type, image, price);
            }
        })
        .catch(error => console.error(error))
        .finally(() => console.log("Loaded Vehicles!"));
    // Load Cosmetics
    console.log("Loading Cosmetics...");
    fetch('https://jbvalues-app.herokuapp.com/itemdata2')
        .then(response => response.json())
        .then(data => {
            const cosmetics = data.cosmetics;
            for (const key in cosmetics) {
                const vehicle = cosmetics[key];
                const name = vehicle.name;
                const type = `(${vehicle.type})`;
                const image = vehicle.image;
                const price = "Value: " + vehicle.value; // oopsie
                // call your script with name, type, and price as arguments
                //cosmeticsCards[name] = [name, type, image, price, false]
                addCard(name, type, image, price);
            }
        })
        .catch(error => console.error(error))
        .finally(() => {
            hideCosmetics(); // we dont want to show everything at first
        });
    console.log("Loaded everything!");
};
