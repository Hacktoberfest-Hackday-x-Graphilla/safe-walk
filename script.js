function sendAlert() {

```
const status =
    document.getElementById("status");

status.innerText =
    "📍 Getting your current location...";


// Check if browser supports location

if (!navigator.geolocation) {

    status.innerText =
        "❌ Location is not supported by this browser.";

    return;
}


// Get current location

navigator.geolocation.getCurrentPosition(

    function(position) {

        const latitude =
            position.coords.latitude;

        const longitude =
            position.coords.longitude;


        // Create Google Maps link

        const mapLink =
            "https://www.google.com/maps?q=" +
            latitude +
            "," +
            longitude;


        // Create emergency message

        const message =
            "🚨 SAFEWALK EMERGENCY ALERT 🚨\n\n" +
            "I may need help.\n\n" +
            "📍 My present location:\n" +
            mapLink;


        // Save message

        localStorage.setItem(
            "safeWalkMessage",
            message
        );


        // Save coordinates

        localStorage.setItem(
            "safeWalkLatitude",
            latitude
        );

        localStorage.setItem(
            "safeWalkLongitude",
            longitude
        );


        // Save map link

        localStorage.setItem(
            "safeWalkMapLink",
            mapLink
        );


        // Open alert page

        window.location.href =
            "alert.html";

    },


    function(error) {

        console.log(error);

        status.innerText =
            "❌ Could not get your location. Please allow location access.";

    },


    {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    }

);
```

}
