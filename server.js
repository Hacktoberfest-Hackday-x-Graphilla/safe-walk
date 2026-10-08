const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const twilio = require("twilio");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;


// ============================
// TWILIO
// ============================

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);


// ============================
// MIDDLEWARE
// ============================

app.use(express.json());

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// ============================
// SEND EMERGENCY ALERT
// ============================

app.post("/send-alert", async (req, res) => {

    try {

        const {
            contacts,
            latitude,
            longitude
        } = req.body;


        // Check contacts

        if (
            !contacts ||
            !Array.isArray(contacts) ||
            contacts.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "No emergency contacts selected."

            });

        }


        // Check location

        if (
            latitude === undefined ||
            longitude === undefined
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Location is required."

            });

        }


        // Google Maps location

        const mapLink =
            `https://www.google.com/maps?q=${latitude},${longitude}`;


        // SMS text

        const message =
            `🚨 SAFEWALK EMERGENCY ALERT 🚨\n\n` +

            `I may need help.\n\n` +

            `My current location:\n` +

            `${mapLink}`;


        // Store results

        const results = [];


        // Send SMS to every selected contact

        for (const contact of contacts) {

            try {

                const sms =
                    await client.messages.create({

                        body: message,

                        from:
                            process.env.TWILIO_PHONE_NUMBER,

                        to:
                            contact.number

                    });


                console.log(
                    `SMS sent to ${contact.name || contact.number}`
                );


                results.push({

                    name: contact.name,

                    number: contact.number,

                    success: true,

                    sid: sms.sid

                });


            } catch (error) {

                console.error(
                    `Failed to send to ${contact.number}:`,
                    error.message
                );


                results.push({

                    name: contact.name,

                    number: contact.number,

                    success: false,

                    error: error.message

                });

            }

        }


        // Check whether at least one SMS succeeded

        const successful =
            results.filter(
                result => result.success
            );


        if (successful.length === 0) {

            return res.status(500).json({

                success: false,

                message:
                    "Could not send the alert to any contact.",

                results: results

            });

        }


        res.json({

            success: true,

            message:
                `Alert sent to ${successful.length} contact(s).`,

            results: results

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            success: false,

            message:
                "Server error while sending alert."

        });

    }

});


// ============================
// START SERVER
// ============================

app.listen(PORT, () => {

    console.log(
        `SafeWalk running at http://localhost:${PORT}`
    );

});