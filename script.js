let countdownTimer;
let countdownValue = 5;

let userLatitude = null;
let userLongitude = null;

// ========================================
// ADD CONTACT
// ========================================

function addContact() {

```
const contacts =
    document.getElementById("contacts");

const contact =
    document.createElement("div");

contact.className = "contact";

contact.innerHTML = `

    <input
        type="checkbox"
        checked
    >

    <input
        type="text"
        class="contact-name"
        placeholder="Name"
    >

    <input
        type="tel"
        class="contact-number"
        placeholder="Phone number"
    >

`;

contacts.appendChild(contact);
```

}

// ========================================
// GET LOCATION
// ========================================

function getLocation() {

```
const status =
    document.getElementById("locationStatus");


status.innerText =
    "📍 Getting your location...";


// Check browser support

if (!navigator.geolocation) {

    status.innerText =
        "❌ Geolocation is not supported.";

    return;
}


navigator.geolocation.getCurrentPosition(

    function(position) {

        userLatitude =
            position.coords.latitude;

        userLongitude =
            position.coords.longitude;


        status.innerText =
            "✅ Location detected";


        console.log(
            "Latitude:",
            userLatitude
        );

        console.log(
            "Longitude:",
            userLongitude
        );

    },


    function(error) {

        console.log(
            "Location error:",
            error
        );


        status.innerText =
            "❌ Could not get your location.";

    },


    {
        enableHighAccuracy: true,

        timeout: 10000,

        maximumAge: 0
    }

);
```

}

// ========================================
// START ALERT
// ========================================

function startAlert() {

```
const selectedContacts =
    getSelectedContacts();


// Check contacts

if (
    selectedContacts.length === 0
) {

    alert(
        "Please select at least one emergency contact."
    );

    return;
}


// Check location

if (
    userLatitude === null ||
    userLongitude === null
) {

    alert(
        "Please get your location first."
    );

    getLocation();

    return;
}


// Start countdown

countdownValue = 5;


const countdownBox =
    document.getElementById(
        "countdownBox"
    );


const countdown =
    document.getElementById(
        "countdown"
    );


countdownBox.classList.remove(
    "hidden"
);


countdown.innerText =
    countdownValue;


countdownTimer =
    setInterval(function() {

        countdownValue--;


        countdown.innerText =
            countdownValue;


        if (
            countdownValue <= 0
        ) {

            clearInterval(
                countdownTimer
            );


            sendAlert(
                selectedContacts
            );

        }

    }, 1000);
```

}

// ========================================
// CANCEL ALERT
// ========================================

function cancelAlert() {

```
clearInterval(
    countdownTimer
);


document
    .getElementById(
        "countdownBox"
    )
    .classList.add("hidden");


document
    .getElementById("status")
    .innerText =
    "✅ Alert cancelled.";
```

}

// ========================================
// GET SELECTED CONTACTS
// ========================================

function getSelectedContacts() {

```
const contacts =
    document.querySelectorAll(
        ".contact"
    );


const selected = [];


contacts.forEach(
    function(contact) {

        const checkbox =
            contact.querySelector(
                'input[type="checkbox"]'
            );


        const name =
            contact.querySelector(
                ".contact-name"
            ).value;


        const number =
            contact.querySelector(
                ".contact-number"
            ).value;


        if (
            checkbox &&
            checkbox.checked
        ) {

            selected.push({

                name:
                    name.trim() ||
                    "Emergency Contact",

                number:
                    number.trim()

            });

        }

    }
);


return selected;
```

}

// ========================================
// SEND ALERT
// ========================================

function sendAlert(contacts) {

```
document
    .getElementById(
        "countdownBox"
    )
    .classList.add("hidden");


// ====================================
// CREATE GOOGLE MAP LINK
// ====================================

const mapLink =
    "https://www.google.com/maps?q=" +
    userLatitude +
    "," +
    userLongitude;


// ====================================
// CREATE EMERGENCY MESSAGE
// ====================================

const message =
    "🚨 SAFEWALK EMERGENCY ALERT 🚨\n\n" +
    "I may need help.\n\n" +
    "My current location:\n" +
    mapLink;


// ====================================
// SAVE DATA
// ====================================

const alertData = {

    message: message,

    latitude: userLatitude,

    longitude: userLongitude,

    mapLink: mapLink,

    contacts: contacts,

    time: new Date().toLocaleString()

};


localStorage.setItem(
    "safeWalkAlert",
    JSON.stringify(alertData)
);


// ====================================
// OPEN NEW ALERT PAGE
// ====================================

window.location.href =
    "alert.html";
```

}
