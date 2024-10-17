// Source: https://github.com/Matti-Krebelder/Website-IP-Logger
// Thang modifications:
// - With the help from GPT
// - Change from using `sendToDiscord` to `sendDataToGoogleApp`
// ref: Using Google App Mail: https://github.com/dwyl/learn-to-send-email-via-google-script-html-no-server


const appScriptURL = 'https://script.google.com/macros/s/AKfycbx4zkochU3fvZELu4J3Mfhv1gZBi7Md2LKxvMoq2iBKO2ELTRjHeOLP2S8AVFWhIt4/exec';


// Async function to send JSON data to Google Sheets via Google Apps Script
// function sendDataToGoogleApp(jsonData) {
//     const xhr = new XMLHttpRequest();
//     xhr.open('POST', appScriptURL, true); // URL should be defined as your Google Apps Script URL
//     xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");

//     // Set up the callback for when the request completes
//     xhr.onreadystatechange = function () {
//         if (xhr.readyState === XMLHttpRequest.DONE) {
//             if (xhr.status === 200) {
//                 console.log('Data successfully sent:', xhr.responseText);
//             } else {
//                 console.error(`Failed to send data: ${xhr.status} ${xhr.statusText}`);
//             }
//         }
//     };

//     // Handle network errors
//     xhr.onerror = function () {
//         console.error('Network error occurred while sending data to Google Sheet');
//     };

//     // Convert JSON data to string and send the request
//     xhr.send(JSON.stringify(jsonData));
// }

async function sendDataToGoogleApp(jsonData) {
    try {
        const response = await fetch(appScriptURL, {
            method: 'POST', // Specify the method
            headers: {
                'Content-Type': 'application/json', // 'application/x-www-form-urlencoded'
                'Access-Control-Allow-Origin': '*' // CORS header
            },
            body: JSON.stringify(jsonData) // Convert the JSON object to a string
        });

        if (!response.ok) {
            throw new Error(`Failed to send data: ${response.status} ${response.statusText}`);
        }

        const data = await response.text(); // Parse the response text
        console.log('Data successfully sent:', data); // Log the response from the server
    } catch (error) {
        console.error('Network error occurred while sending data to Google Sheet:', error);
    }
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
    const timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });
    const browserInfo = getBrowserInfo();
    const visitorInfo = await getVisitorInfo();
    const initialUrl = window.location.href;

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
        };
        await sendDataToGoogleApp(jsonData);
    }
}

// Store the initial URL when the page loads
window.onload = async function () {
    await logVisitor();
};

// // Trigger logVisitor on window close
// window.onbeforeunload = function () {
//     logVisitor(true); // Pass true to indicate closing event
// };