// Source: https://github.com/Matti-Krebelder/Website-IP-Logger
// Thang modifications:
// - With the help from GPT
// - Change from using `sendToDiscord` to `sendDataToGoogleSheet`
// ref: Using Google App Mail: https://github.com/dwyl/learn-to-send-email-via-google-script-html-no-server


const URL = 'https://script.google.com/macros/s/AKfycbxw0DuxSyvZtUyVPAWECx15gxibYpqgevMV0L0YmIKOkkNNyLBe6bsrDLrRhzQRwlrB/exec'; // AppScriptURL


// Async function to send JSON data to Google Sheets via Google Apps Script
async function sendDataToGoogleSheet(jsonData) {
    try {
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify(jsonData),
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`Failed to send data: ${response.statusText}`);
        }

        const result = await response.text();
        console.log('Data successfully sent:', result);
    } catch (error) {
        console.error('Error sending data to Google Sheet:', error);
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
async function logVisitor() {
    const timestamp = new Date().toISOString();
    const browserInfo = getBrowserInfo();
    const visitorInfo = await getVisitorInfo();

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
            os: navigator.platform
        };

        // Send the collected data to Google Sheet
        await sendDataToGoogleSheet(jsonData);
    } else {
        console.error('Visitor information could not be retrieved.');
    }
}

// Trigger logVisitor when the window loads
window.onload = logVisitor;