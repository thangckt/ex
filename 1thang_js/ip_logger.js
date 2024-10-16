// Source: https://github.com/Matti-Krebelder/Website-IP-Logger
// Thang modifications:
// - With the help from GPT
// - Change from using `sendToDiscord` to `sendDataToGoogleSheet`
// ref: Using Google App Mail: https://github.com/dwyl/learn-to-send-email-via-google-script-html-no-server


const URL = 'https://script.google.com/macros/s/AKfycbx4zkochU3fvZELu4J3Mfhv1gZBi7Md2LKxvMoq2iBKO2ELTRjHeOLP2S8AVFWhIt4/exec'; // AppScriptURL


// Async function to send JSON data to Google Sheets via Google Apps Script
function sendDataToGoogleSheet(jsonData) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', URL, true); // URL should be defined as your Google Apps Script URL

    // Set the request headers
    xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");

    // Set up the callback for when the request completes
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log('Data successfully sent:', xhr.responseText);
            } else {
                console.error(`Failed to send data: ${xhr.status} ${xhr.statusText}`);
            }
        }
    };

    // Handle network errors
    xhr.onerror = function () {
        console.error('Network error occurred while sending data to Google Sheet');
    };

    // Convert JSON data to string and send the request
    xhr.send(JSON.stringify(jsonData));
}


// Fetch visitor info using ipapi.co API
async function getVisitorInfo() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error(`Error fetching visitor info: ${response.statusText}`);

        return await response.json();
    } catch (error) {
        console.error('Error retrieving visitor information:', error);
        return null;
    }
}


// Get browser information from user agent string
function getBrowserInfo() {
    const ua = navigator.userAgent;
    const browserData = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    const browserInfo = { name: 'Unknown', version: 'Unknown' };

    if (/trident/i.test(browserData[1])) {
        const version = /\brv[ :]+(\d+)/g.exec(ua) || [];
        browserInfo.name = 'IE';
        browserInfo.version = version[1] || '';
    } else if (browserData[1] === 'Chrome') {
        const temp = ua.match(/\b(OPR|Edg)\/(\d+)/);
        if (temp) {
            browserInfo.name = temp[1] === 'OPR' ? 'Opera' : 'Edge';
            browserInfo.version = temp[2];
        } else {
            browserInfo.name = 'Chrome';
            browserInfo.version = browserData[2];
        }
    } else if (browserData[1]) {
        browserInfo.name = browserData[1];
        browserInfo.version = browserData[2];
    }

    return browserInfo;
}


// Log visitor information and send to Google Sheet
async function logVisitor(isClosing = false) {
    const timestamp = new Date().toUTCString();
    const browserInfo = getBrowserInfo();
    const visitorInfo = await getVisitorInfo();

    // Track initial and final URLs
    const initialUrl = sessionStorage.getItem('initialUrl') || window.location.href;
    const finalUrl = window.location.href;

    if (visitorInfo) {
        const jsonData = {
            timestamp: timestamp,
            ip: visitorInfo.ip,
            org: visitorInfo.org,
            city: visitorInfo.city,
            region: visitorInfo.region,
            country: visitorInfo.country_name,
            postal: visitorInfo.postal,
            latitude: visitorInfo.latitude,
            longitude: visitorInfo.longitude,
            asn: visitorInfo.asn,
            browser: `${browserInfo.name} ${browserInfo.version}`,
            os: navigator.platform,
            initialUrl: initialUrl,
            finalUrl: finalUrl
        };

        // Send the collected data to Google Sheet
        await sendDataToGoogleSheet(jsonData);
    } else {
        console.error('Visitor information could not be retrieved.');
    }

    // Clear the initial URL for future visits
    if (isClosing) {
        sessionStorage.removeItem('initialUrl');
    }
}

// Store the initial URL when the page loads
window.onload = function () {
    // Store the initial URL in session storage
    sessionStorage.setItem('initialUrl', window.location.href);
    logVisitor();
};

// Trigger logVisitor on window close
window.onbeforeunload = function () {
    logVisitor(true); // Pass true to indicate closing event
};