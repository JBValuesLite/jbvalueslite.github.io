var selected = 1;
var history = [0, 0]; // vehicles | cosmetics

function filterCallback(sent) {
    if (selected == 1) {
        history[0] = sent;
    }
    if (selected == 2) {
        history[1] = sent;
    }
}

function hideSoonText() {
    const soonText = document.querySelector(".soonText");
    soonText.style.display = "none";
}

function switchToHypers() {
    selected = 3;
    const parentDiv = document.getElementsByClassName('cards')[0];
    document.querySelectorAll(".cards .card").forEach(card => {
        card.style.display = "none";
    })
    document.querySelector(".soonText").style.display = "block";
}  

function reloadVehicles() {
    for (vehicle in Object.keys(vehiclesList)) {
        const actualVehicle = Object.keys(vehiclesList)[vehicle];
        var actual = vehiclesList[actualVehicle]
        
        addCard(actual.name, actual.type, actual.image, actual.price) 
    }
}

function reloadCosmetics() {
    for (cosmetic in Object.keys(cosmeticsList)) {
        const actualCosmetic = Object.keys(cosmeticsList)[cosmetic];
        const actual = cosmeticsList[actualCosmetic];

        addCard(actual.name, actual.type, actual.image, actual.price)
    }
}

// bruh moment js (gonna try to make it smaller)
function hideCosmetics() {
    selected = 1; 
    const cards = document.querySelectorAll('.cards .card');
    document.querySelector('.filterDrop').selectedIndex = history[0];

    hideSoonText();


    reloadVehicles(); // actual functionality


    cards.forEach(card => {
        if (!card.querySelector('h2').textContent.includes("(Vehicle)")) {
            card.style.display = "none";
        } else {
            card.style.display = "block";
        }
    });

    sortCards(history[0])
}

function hideVehicles() {
    selected = 2;
    const cards = document.querySelectorAll('.cards .card');
    document.querySelector('.filterDrop').selectedIndex = history[1];
    
    hideSoonText();

    reloadCosmetics(); // actual functionality (too)

    cards.forEach(card => {
        if (card.querySelector('h2').textContent.includes("(Vehicle)")) {
            card.style.display = "none";
        } else {
            card.style.display = "block";
        }
    });
    
    sortCards(history[1])
}

function search(text) {
    const cards = document.querySelectorAll('.cards .card');
    if (document.getElementsByClassName("filter")[0].value.length === 0) {
        document.getElementsByClassName("filter")[0].value = "";
    }
    cards.forEach(card => {
        const h1 = card.querySelector('h1').textContent.trim(); // get the text content of the h1 element
        const h2 = card.querySelector('h2').textContent.trim();

        if (selected == 1 && h2 == "(Vehicle)") {
            if (!h1.toLowerCase().includes(text.toLowerCase())) {
                card.style.display = 'none'; 
            } else {
                card.style.display = 'block'; 
            }
        }
        if (selected == 2 && h2 != "(Vehicle)") {
            if (!h1.toLowerCase().includes(text.toLowerCase())) {
                card.style.display = 'none'; 
            } else {
                card.style.display = 'block'; 
            }
        }
    });
}


// add card dynamically \\
function addCard(name, type, imageSrc, price) {
    const parentDiv = document.getElementsByClassName('cards')[0];
    
    const newDiv = document.createElement('div');
    newDiv.classList.add('card');
    
    const h1 = document.createElement('h1');
    h1.textContent = name;
    newDiv.appendChild(h1);
    
    const h2 = document.createElement('h2');
    h2.textContent = type;
    newDiv.appendChild(h2);
    
    const imgHolder = document.createElement("div");
    imgHolder.className = "backHolder";
    newDiv.appendChild(imgHolder)

    const img = document.createElement('img');
    img.setAttribute('src', imageSrc);
    img.setAttribute('onerror', onerror = "this.onerror=null;this.src='https://a5.behance.net/4cec702805824ada0b02e354d3d29193c8ccdd9c/img/covers/808-blocked.png';")
    newDiv.appendChild(img);
    
    const p = document.createElement('p');
    p.textContent = price;
    newDiv.appendChild(p);
    if (!parentDiv.contains(newDiv)) {
        parentDiv.appendChild(newDiv);
    } else {
        newDiv.remove()
    }
}

let vehiclesList = {};
let cosmeticsList = {};

let vehiclesValueList = {};
let cosmeticsValueList = {};

function addVehicles(data) {
    const vehicles = data.vehicles;

    for (const key in vehicles) {
        const vehicle = vehicles[key];
        const name = vehicle.name;
        const type = `(${vehicle.type})`;
        const image = vehicle.image;
        const price = "Value: " + vehicle.value;
        // call your script with name, type, and price as arguments
        // vehiclesList[name] = [type, image, price];
        //addCard(name, type, image, price);
        vehiclesList[name] = {'name': name, 'type': type, 'image': image, 'price': price}
        vehiclesValueList[vehicle.name] = parseInt(vehicle.value.replaceAll(",", ""));
    }
}

function addCosmetics(data) {
    const cosmetics = data.cosmetics;


        for (const key in cosmetics) {
            const cosmetic = cosmetics[key];
            var name = cosmetic.name;
            const type = `(${cosmetic.type})`;
            // little fix
            const image = cosmetic.image;
            var  price = "Value: " + cosmetic.value; // oopsie
            // call your script with name, type, and price as arguments
            if (name == "Brickset" && type == "(Rim)"){
                name = "BricksetRim";
            }
            cosmeticsList[name] = {'name': name, 'type': type, 'image': image, 'price': price}
            cosmeticsValueList[name] = parseInt(cosmetic.value.replaceAll(",", ""));
            addCard(name, type, image, price);
        }
}

window.onload = function () {
    console.log('Loaded bare-bones page');
    // Load Vehicles
    fetch('https://jbvalues-app.herokuapp.com/itemdata2')
    .then(response => response.json())
    .then(data => {
        console.log('Loading vehicles...');

        addVehicles(data);
        addCosmetics(data)

        // add vehicle
        for (vehicle in Object.keys(vehiclesList)) {
            const actualVehicle = Object.keys(vehiclesList)[vehicle];
            var actual = vehiclesList[actualVehicle]
            
            addCard(actual.name, actual.type, actual.image, actual.price)
        }
    })
    .catch(error => console.error(error))
    .finally(() => {
        console.log("Loaded Vehicles!");
        hideSoonText();
        hideCosmetics();
        console.log("Loaded everything!")
    });
    
    console.log("Loaded everything!");
};

function hideCards() {
    document.querySelector('.filter').value = "";
    document.querySelectorAll(".cards .card").forEach(card => {
        card.remove()
    })
}

function sortCards(sortingType) {
    if (sortingType === 0) {
        hideCards();
        if (selected == 1) {
            for (vehicle in Object.keys(vehiclesList)) {
                const actualVehicle = Object.keys(vehiclesList)[vehicle];
                var actual = vehiclesList[actualVehicle]
                
                addCard(actual.name, actual.type, actual.image, actual.price) 
            }
        }
        
        if (selected == 2) {
            for (cosmetic in Object.keys(cosmeticsList)) {
                const actualCosmetic = Object.keys(cosmeticsList)[cosmetic];
                const actual = cosmeticsList[actualCosmetic];

                addCard(actual.name, actual.type, actual.image, actual.price)
            }
        }
    }

    if (sortingType === 1) {
        hideCards();
        if (selected == 1) {
            for (vehicle in Object.keys(vehiclesList)) {
                const actualVehicle = Object.keys(vehiclesList).sort()[vehicle];
                const actual = vehiclesList[actualVehicle]
                
                addCard(actual.name, actual.type, actual.image, actual.price)
            }
        }

        if (selected == 2) {
            for (cosmetic in Object.keys(cosmeticsList)) {
                const actualCosmetic = Object.keys(cosmeticsList).sort()[cosmetic];
                const actual = cosmeticsList[actualCosmetic];

                addCard(actual.name, actual.type, actual.image, actual.price)
            }
        }
    }

    /**
     * @TODO FIX SORTING METHOD BECAUSE IT DOESNT INCLUDES WHEN 2 KEYS HAS THE SAME VALUES
     */


    if (sortingType === 2) {
        hideCards();
        if (selected == 1) {
            var final = {}
            
            var bruh =  Object.fromEntries(Object.entries(vehiclesValueList).sort(([, valueA], [, valueB]) => valueA - valueB));

            var reversed = Object.entries(bruh).reverse();

            reversed.forEach(e => {
                final[e[0]] = e[1]
            })

            Object.keys(final).forEach(name => {
                const actualVehicle = vehiclesList[name]
                addCard(actualVehicle.name, actualVehicle.type, actualVehicle.image, actualVehicle.price)
            })
        }

        if (selected == 2) {
            var final = {}
            
            var bruh = Object.fromEntries(Object.entries(cosmeticsValueList).sort(([, valueA], [, valueB]) => valueA - valueB));
            var reversed = Object.entries(bruh).reverse();

            reversed.forEach(e => {
                final[e[0]] = e[1]
            })

            Object.keys(final).forEach(name => {
                const actualCosmetic = cosmeticsList[name]
                addCard(actualCosmetic.name, actualCosmetic.type, actualCosmetic.image, actualCosmetic.price)
            })
        }
    }

    if (sortingType === 3) {
        hideCards();
        if (selected == 1) {
            var final = {}
            
            var bruh = Object.fromEntries(Object.entries(vehiclesValueList).sort(([, valueA], [, valueB]) => valueA - valueB));
            var reversed = Object.entries(bruh);

            reversed.forEach(e => {
                final[e[0]] = e[1]
            })

            Object.keys(final).forEach(name => {
                const actualVehicle = vehiclesList[name]
                addCard(actualVehicle.name, actualVehicle.type, actualVehicle.image, actualVehicle.price)
            })
        }

        if (selected == 2) {
            var final = {}
            
            var bruh = Object.fromEntries(Object.entries(cosmeticsValueList).sort(([, valueA], [, valueB]) => valueA - valueB));
            var reversed = Object.entries(bruh);

            reversed.forEach(e => {
                final[e[0]] = e[1]
            })

            Object.keys(final).forEach(name => {
                const actualCosmetic = cosmeticsList[name]
                addCard(actualCosmetic.name, actualCosmetic.type, actualCosmetic.image, actualCosmetic.price)
            })
        }
    }
}
