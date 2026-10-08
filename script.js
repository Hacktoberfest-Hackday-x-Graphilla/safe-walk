let countdownTimer;
let countdownValue = 5;

let userLatitude = null;
let userLongitude = null;


// ============================
// ADD CONTACT
// ============================

function addContact() {

    const contacts =
        document.getElementById("contacts");

    const contact =
        document.createElement("div");

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


    // Get location before starting countdown

    if (
        userLatitude === null ||
        userLongitude === null
    ) {

        getLocation();

        alert(
            "Please wait for your location to be detected, then press Send Alert again."
        );

        return;
    }


    countdownValue = 5;


    const countdownBox =
        document.getElementById("countdownBox");

    const countdown =
        document.getElementById("countdown");


    countdownBox.classList.remove("hidden");

    countdown.innerText =
        countdownValue;


    countdownTimer =
        setInterval(function() {

            countdownValue--;


            countdown.innerText =
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
            checkbox &&
            checkbox.checked &&
            number.trim() !== ""
        ) {

            selected.push({

                name:
                    name.trim() ||
                    "Emergency Contact",

                number:
                    number.trim()

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
// CREATE SMS
// ============================

function createSMS(contacts) {

    const status =
        document.getElementById("status");


    // Google Maps location

    const mapLink =
        "https://www.google.com/maps?q=" +
        userLatitude +
        "," +
        userLongitude;


    // SMS message

    const message =
        "🚨 SAFEWALK EMERGENCY ALERT 🚨\n\n" +
        "I may need help.\n\n" +
        "My current location:\n" +
        mapLink;


    console.log(
        "Selected contacts:",
        contacts
    );


    console.log(
        "Message:",
        message
    );


    status.innerText =
        "✅ Alert message prepared.";


    // ============================
    // OPEN SMS APP
    // ============================

    if (contacts.length === 1) {

        const phone =
            contacts[0].number;


        const smsURL =
            "sms:" +
            encodeURIComponent(phone) +
            "?body=" +
            encodeURIComponent(message);


        window.location.href =
            smsURL;


    } else {

        // Multiple contacts

        status.innerText =
            "✅ Alert prepared for " +
            contacts.length +
            " contacts.";


        // Show the message

        alert(message);

    }
}