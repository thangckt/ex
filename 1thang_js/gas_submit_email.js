// Using Google App Mail: https://github.com/dwyl/learn-to-send-email-via-google-script-html-no-server
// Refactor by Thang and GPT


const appScriptURL = "https://script.google.com/macros/s/AKfycbxmd9UxNXhJoBXFwksde4ip_G1YMofHVHOT4ZLOIpJ8mzYxneUa48sTK2X1GU6cnkfP/exec";

// Async function to send JSON data to Google Sheets via Google Apps Script
async function sendDataToGoogleApp(jsonData) {
    try {
        const response = await fetch(appScriptURL, {
            method: 'POST', // Specify the method
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify(jsonData) // Convert the JSON object to a string
        });

        const data = await response.text(); // Parse the response text
        console.log('Data successfully sent:', data); // Log the response from the server
    } catch (error) {
        console.error('Network error occurred while sending data to Google Sheet:', error);
    }
}


// Get all data from the form and return JSON-data
function getFormData(form) {
    const formData = {};

    // Collect input field values
    formData.name = form.querySelector('input[name="name"]').value;
    formData.email = form.querySelector('input[name="email"]').value;
    formData.subject = form.querySelector('input[name="subject"]').value;
    formData.message = form.querySelector('textarea[name="message"]').value;

    // Honeypot field for spam protection
    formData.honeypot = form.querySelector('input[name="honeypot"]').value;

    return formData;
}

// Disable all buttons in the form while submission is happening
function disableAllButtons(form) {
    const buttons = form.querySelectorAll("button, input[type='submit']");
    buttons.forEach(button => button.disabled = true);
}

// Enable all buttons in the form (used for error handling)
function enableAllButtons(form) {
    const buttons = form.querySelectorAll("button, input[type='submit']");
    buttons.forEach(button => button.disabled = false);
}

// Function to handle form submission
async function handleFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    const form = event.target;
    const formData = getFormData(form);

    // If honeypot is filled, we assume it's a spam bot
    if (formData.honeypot) {
        return; // Do not submit the form
    }

    // Hide the form elements
    const formElements = form.querySelector(".form-elements");
    if (formElements) {
        formElements.style.display = "none";
    }

    // Show the sending message
    const sendingMessage = form.querySelector(".sending_message");
    if (sendingMessage) {
        sendingMessage.style.display = "block";
    }

    disableAllButtons(form); // Disable all buttons in the form

    try {
        // Send the form data
        await sendDataToGoogleApp(formData);

        // Hide the sending message
        if (sendingMessage) {
            sendingMessage.style.display = "none";
        }

        // Show the thank you message
        const thankYouMessage = form.querySelector(".thankyou_message");
        if (thankYouMessage) {
            thankYouMessage.style.display = "block";
        }

        form.reset(); // Reset the form fields

    } catch (error) {
        alert('There was an error submitting the form. Please try again.');

        // Show form elements again on error
        if (formElements) {
            formElements.style.display = "block";
        }

        // Hide sending message on error
        if (sendingMessage) {
            sendingMessage.style.display = "none";
        }

        enableAllButtons(form); // Enable buttons again on error
    }
}

// Function to bind form submission event when the document is ready
function loaded() {
    const forms = document.querySelectorAll("form.gform");
    forms.forEach(form => form.addEventListener("submit", handleFormSubmit, false));
}

document.addEventListener("DOMContentLoaded", loaded, false);