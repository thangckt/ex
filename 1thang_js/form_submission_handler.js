// Using Google App Mail: https://github.com/dwyl/learn-to-send-email-via-google-script-html-no-server
// Define js script

(function () {
    // Get all data in form and return an object
    function getFormData(form) {
        var elements = form.elements;
        var honeypot;

        var fields = Object.keys(elements).filter(function (k) {
            if (elements[k].name === "honeypot") {
                honeypot = elements[k].value;
                return false;
            }
            return true;
        }).map(function (k) {
            if (elements[k].name !== undefined) {
                return elements[k].name;
                // Special case for Edge's HTML collection
            } else if (elements[k].length > 0) {
                return elements[k].item(0).name;
            }
        }).filter(function (item, pos, self) {
            return self.indexOf(item) === pos && item;
        });

        var formData = {};
        fields.forEach(function (name) {
            var element = elements[name];

            // Singular form elements just have one value
            formData[name] = element.value;

            // When our element has multiple items, get their values
            if (element.length) {
                var data = [];
                for (var i = 0; i < element.length; i++) {
                    var item = element.item(i);
                    if (item.checked || item.selected) {
                        data.push(item.value);
                    }
                }
                formData[name] = data.join(', ');
            }
        });

        // Add form-specific values into the data
        formData.formDataNameOrder = JSON.stringify(fields);
        formData.formGoogleSheetName = form.dataset.sheet || "responses"; // Default sheet name
        formData.formGoogleSendEmail = form.dataset.email || ""; // No email by default

        return { data: formData, honeypot: honeypot };
    }

    function handleFormSubmit(event) {  // Handles form submit without any jQuery
        event.preventDefault();           // We are submitting via xhr below
        var form = event.target;
        var formData = getFormData(form);

        // If a honeypot field is filled, assume it was done so by a spam bot.
        if (formData.honeypot) {
            return;  // Do not submit the form
        }

        var data = formData.data;

        // Hide the form elements
        var formElements = form.querySelector(".form-elements")
        if (formElements) {
            formElements.style.display = "none";
        }

        // Show the sending message
        var sendingMessage = form.querySelector(".sending_message");
        if (sendingMessage) {
            sendingMessage.style.display = "block";
        }

        disableAllButtons(form);
        var url = form.action;
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        // xhr.withCredentials = true;
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                form.reset();

                // Hide the sending message
                if (sendingMessage) {
                    sendingMessage.style.display = "none";
                }

                // Show thank you message
                var thankYouMessage = form.querySelector(".thankyou_message");
                if (thankYouMessage) {
                    thankYouMessage.style.display = "block";
                }
            }
        };
        // URL encode form data for sending as POST data
        var encoded = Object.keys(data).map(function (k) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
        }).join('&');
        xhr.send(encoded);
    }

    function loaded() {
        // Bind to the submit event of our form
        var forms = document.querySelectorAll("form.gform");
        for (var i = 0; i < forms.length; i++) {
            forms[i].addEventListener("submit", handleFormSubmit, false);
        }
    }
    document.addEventListener("DOMContentLoaded", loaded, false);

    function disableAllButtons(form) {
        var buttons = form.querySelectorAll("button");
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }
    }
})();
