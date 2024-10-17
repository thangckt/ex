// Using Google App Mail: https://github.com/dwyl/learn-to-send-email-via-google-script-html-no-server
// Refactor by Thang and GPT


const appScriptURL = "https://script.google.com/macros/s/AKfycbxmd9UxNXhJoBXFwksde4ip_G1YMofHVHOT4ZLOIpJ8mzYxneUa48sTK2X1GU6cnkfP/exec";

// Async function to send JSON data to Google Sheets via Google Apps Script
function sendDataToGoogleApp(jsonData, appScriptURL, onSuccess, onError) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', appScriptURL, true);

    // Set the request headers
    xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");

    // Handle the response
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log('Data successfully sent:', xhr.responseText);
                onSuccess(); // Call onSuccess callback if the request was successful
            } else {
                console.error(`Failed to send data: ${xhr.status} ${xhr.statusText}`);
                onError(); // Call onError callback if the request failed
            }
        }
    };

    // Handle network errors
    xhr.onerror = function () {
        console.error('Network error occurred while sending data to Google Sheet');
        onError(); // Call onError callback in case of network errors
    };

    // Convert JSON data to a URL-encoded string and send it
    const encodedData = Object.keys(jsonData)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(jsonData[key]))
        .join('&');
    xhr.send(encodedData);
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

// Function to handle form submission
function handleFormSubmit(event) {
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

    // Call the sendDataToGoogleApp function and handle success and error
    sendDataToGoogleApp(formData, appScriptURL,
        () => { // onSuccess callback
            if (sendingMessage) {
                sendingMessage.style.display = "none"; // Hide the sending message
            }
            const thankYouMessage = form.querySelector(".thankyou_message");
            if (thankYouMessage) {
                thankYouMessage.style.display = "block"; // Show thank you message
            }
            form.reset(); // Reset the form fields
        },
        () => { // onError callback
            alert('There was an error submitting the form. Please try again.');
            if (formElements) {
                formElements.style.display = "block"; // Show form elements again on error
            }
            if (sendingMessage) {
                sendingMessage.style.display = "none"; // Hide sending message on error
            }
        }
    );
}

// Function to bind form submission event when the document is ready
function loaded() {
    const forms = document.querySelectorAll("form.gform");
    forms.forEach(form => form.addEventListener("submit", handleFormSubmit, false));
}

document.addEventListener("DOMContentLoaded", loaded, false);