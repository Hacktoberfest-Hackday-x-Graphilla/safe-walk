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
            placeholder="+9779812345678"
        >
    `;

    contacts.appendChild(contact);
}


// ============================
// GET LOCATION
// ============================

function getLocation() {

    const status =
        document.getElementById("locationStatus");

    status.innerText =
        "📍 Getting your location...";

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
        .innerText =
        countdownValue;


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
                name: name.trim(),
                number: number.trim()
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
    // get it now.

    if (
        userLatitude === null ||
        userLongitude === null
    ) {

        document
            .getElementById("status")
            .innerText =
            "📍 Getting your location...";


        if (!navigator.geolocation) {

            alert(
                "Your browser does not support location."
            );

            return;
        }


        navigator.geolocation.getCurrentPosition(

            function(position) {

                userLatitude =
                    position.coords.latitude;

                userLongitude =
                    position.coords.longitude;

                createSMS(contacts);
            },

            function(error) {

                console.log(error);

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
// SEND SMS THROUGH BACKEND
// ============================

async function createSMS(contacts) {

    const status =
        document.getElementById("status");


    status.innerText =
        "📤 Sending emergency alert...";


    const mapLink =
        "https://www.google.com/maps?q=" +
        userLatitude +
        "," +
        userLongitude;


    try {

        const response =
            await fetch("/send-alert", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    contacts: contacts,

                    latitude: userLatitude,

                    longitude: userLongitude,

                    mapLink: mapLink

                })

            });


        const data =
            await response.json();


        if (data.success) {

            status.innerText =
                "✅ Emergency alert sent successfully!";

            console.log(
                "SMS result:",
                data
            );

        } else {

            status.innerText =
                "❌ " + data.message;

        }


    } catch (error) {

        console.error(error);

        status.innerText =
            "❌ Could not connect to the alert server.";

    }
}