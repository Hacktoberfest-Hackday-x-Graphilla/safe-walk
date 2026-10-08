    const saveBtn = document.getElementById("saveBtn");
const dangerBtn = document.getElementById("dangerBtn");
const cancelBtn = document.getElementById("cancelBtn");

const dangerMode = document.getElementById("dangerMode");
const locationStatus = document.getElementById("locationStatus");
const emergencyActions = document.getElementById("emergencyActions");


// SAVE CONTACTS
saveBtn.addEventListener("click", () => {

    const parentName =
        document.getElementById("parentName").value;

    const parentPhone =
        document.getElementById("parentPhone").value;

    const emergencyName =
        document.getElementById("emergencyName").value;

    const emergencyPhone =
        document.getElementById("emergencyPhone").value;


    if (!parentPhone || !emergencyPhone) {
        alert("Please enter the required phone numbers.");
        return;
    }


    const contacts = {
        parentName,
        parentPhone,
        emergencyName,
        emergencyPhone
    };


    localStorage.setItem(
        "safeWalkContacts",
        JSON.stringify(contacts)
    );


    alert("Emergency contacts saved successfully!");
});


// DANGER MODE
dangerBtn.addEventListener("click", () => {

    dangerMode.classList.remove("hidden");

    locationStatus.textContent =
        "Getting your location...";

    getLocation();
});


// GET LOCATION
function getLocation() {

    if (!navigator.geolocation) {

        locationStatus.textContent =
            "Location is not supported by this browser.";

        return;
    }


    navigator.geolocation.getCurrentPosition(

        (position) => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            const mapLink =
                `https://www.google.com/maps?q=${latitude},${longitude}`;


            locationStatus.innerHTML =
                `📍 Location detected.<br>
                <a href="${mapLink}" target="_blank">
                    View my location
                </a>`;


            showEmergencyActions(mapLink);
        },


        () => {

            locationStatus.textContent =
                "Unable to get your location.";

            showEmergencyActions(null);
        }
    );
}


function showEmergencyActions(mapLink) {

    const contacts = JSON.parse(
        localStorage.getItem("safeWalkContacts")
    );

    if (!contacts) {

        emergencyActions.innerHTML =
            "<p>No emergency contacts saved.</p>";

        return;
    }

    const message =
        `I am in danger. Please help me.
Location: ${mapLink || ""}`;

    emergencyActions.innerHTML = `

        <div class="danger-card">

            <h3>💬 Alert Message Sent</h3>

            <p>
                Emergency message sent successfully.
            </p>

        </div>


        <div class="danger-card">

            <h3>👨‍👩‍👧 Parent / Guardian</h3>

            <p>
                <strong>Name:</strong>
                ${contacts.parentName || "Parent"}
            </p>

            <p>
                <strong>Phone:</strong>
                ${contacts.parentPhone}
            </p>

            <a href="tel:${contacts.parentPhone}">
                📞 Call
            </a>

            <br><br>

            <a href="sms:${contacts.parentPhone}?body=${encodeURIComponent(message)}">
                💬 Send SMS
            </a>

        </div>


        <div class="danger-card">

            <h3>🚔 Emergency Service</h3>

            <p>
                <strong>Name:</strong>
                ${contacts.emergencyName || "Emergency"}
            </p>

            <p>
                <strong>Phone:</strong>
                ${contacts.emergencyPhone}
            </p>

            <a href="tel:${contacts.emergencyPhone}">
                🚨 Call Emergency
            </a>

        </div>


        <div class="danger-card">

            <h3>📍 Live Location Shared</h3>

            <p>
                Your location has been attached to the alert.
            </p>

            ${
                mapLink
                ?
                `
                <a
                    href="${mapLink}"
                    target="_blank"
                >
                    🗺️ View Location
                </a>
                `
                :
                "Location unavailable"
            }

        </div>
    `;
}


// CANCEL
cancelBtn.addEventListener("click", () => {

    dangerMode.classList.add("hidden");

});