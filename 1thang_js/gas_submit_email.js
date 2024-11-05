// Using Google App Mail: https://github.com/dwyl/learn-to-send-email-via-google-script-html-no-server
// Refactor by Thang and GPT

// NOTE: notice about var_name in all js files

(function () {
    const ScriptId = 'AKfycbwNDSlWS7t9BuJl1-gmrRC1noEERNHjfY3DLzJg-Z9_fuSxYmuVZW_62LKYSEQCfLlB';
    const URL = `https://script.google.com/macros/s/${ScriptId}/exec`;

    // Async function to send JSON data to Google Sheets via Google Apps Script
    async function sendDataToGoogleApp(jsonData) {
        try {
            await fetch(URL, {
                method: 'POST',
                body: JSON.stringify(jsonData),
                headers: { 'Content-Type': "text/plain;charset=utf-8" },
                redirect: 'follow',
            });
        } catch (error) {
            console.error('Error while sending data to Google App:', error);
        }
    }

    function getTimestamp() {
        const options = {
            timeZone: "Asia/Seoul",
            year: 'numeric',
            month: 'short',  // short: "Jan", long: "January"
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // 24-hour format
        };
        const timestamp = new Date().toLocaleString("en-US", options);
        return timestamp.replace(/ at /, ', ');
    }

    // Get all data from the form and return JSON-data
    function getFormData(form) {
        const jsonData = {};
        jsonData.timestamp = getTimestamp()
        jsonData.name = form.querySelector('input[name="name"]').value;
        jsonData.email = form.querySelector('input[name="email"]').value;
        jsonData.subject = form.querySelector('input[name="subject"]').value;
        jsonData.message = form.querySelector('textarea[name="message"]').value;
        jsonData.honeypot = form.querySelector('input[name="honeypot"]').value;
        return jsonData;
    }

    // Disable all buttons in the form while submission is happening
    function disableSentButton(form) {
        const buttons = form.querySelectorAll("button, input[type='submit']");
        buttons.forEach(button => button.disabled = true);
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

        disableSentButton(form); // Disable all buttons in the form

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

        try {
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
            console.log('Form submitted successfully');

        } catch (error) {
            alert('There was an error submitting the form. Please try again.');
        }
    }

    // Function to bind form submission event when the document is ready
    function loaded() {
        const forms = document.querySelectorAll("form.gform");
        forms.forEach(form => form.addEventListener("submit", handleFormSubmit, false));
    }

    document.addEventListener("DOMContentLoaded", loaded, false);

})();