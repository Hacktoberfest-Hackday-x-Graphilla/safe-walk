let countdownTimer;
let countdownValue = 5;

let userLatitude = null;
let userLongitude = null;


// ============================
// ADD CONTACT
// ============================

function addContact() {

    const contacts = document.getElementById("contacts");

    const contact = document.createElement("div");

    contact.className = "contact";

    contact.innerHTML = `
        <input type="checkbox" checked>

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
}


// ============================
// GET LOCATION
// ============================

function getLocation() {

    const status = document.getElementById("locationStatus");

    status.innerText = "📍 Getting your location...";

    if (!navigator.geolocation) {

        status.innerText =
            "❌ Your browser does not support location.";

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

            status.innerText =
                "❌ Could not get your location.";

            console.log(error);
        }

    );
}


// ============================
// START ALERT
// ============================

function startAlert() {

    const selectedContacts =
        getSelectedContacts();


    if (selectedContacts.length === 0) {

        alert(
            "Please select at least one emergency contact."
        );

        return;
    }


    countdownValue = 5;

    document
        .getElementById("countdownBox")
        .classList.remove("hidden");


    document
        .getElementById("countdown")
        .innerText = countdownValue;


    countdownTimer =
        setInterval(function() {

            countdownValue--;

            document
                .getElementById("countdown")
                .innerText =
                countdownValue;


            if (countdownValue <= 0) {

                clearInterval(countdownTimer);

                sendAlert(selectedContacts);
            }

        }, 1000);
}


// ============================
// CANCEL ALERT
// ============================

function cancelAlert() {

    clearInterval(countdownTimer);

    document
        .getElementById("countdownBox")
        .classList.add("hidden");


    document
        .getElementById("status")
        .innerText =
        "✅ Alert cancelled.";
}


// ============================
// GET SELECTED CONTACTS
// ============================

function getSelectedContacts() {

    const contacts =
        document.querySelectorAll(".contact");


    const selected = [];


    contacts.forEach(function(contact) {

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
            checkbox.checked &&
            number.trim() !== ""
        ) {

            selected.push({
                name: name,
                number: number
            });

        }

    });


    return selected;
}


// ============================
// SEND ALERT
// ============================

function sendAlert(contacts) {

    document
        .getElementById("countdownBox")
        .classList.add("hidden");


    // If location hasn't been obtained,
    // try to get it now.

    if (
        userLatitude === null ||
        userLongitude === null
    ) {

        navigator.geolocation.getCurrentPosition(

            function(position) {

                userLatitude =
                    position.coords.latitude;

                userLongitude =
                    position.coords.longitude;

                createSMS(contacts);
            },

            function() {

                alert(
                    "Location permission is required to send your location."
                );

            }

        );

    } else {

        createSMS(contacts);
    }
}


// ============================
// CREATE SMS
// ============================

function createSMS(contacts) {

    const mapLink =
        "https://www.google.com/maps?q=" +
        userLatitude +
        "," +
        userLongitude;


    const message =
        "🚨 SAFEWALK EMERGENCY ALERT 🚨\n\n"}