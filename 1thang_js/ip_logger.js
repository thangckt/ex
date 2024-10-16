// Source: https://github.com/Matti-Krebelder/Website-IP-Logger
// Thang modifications:
// - With the help from GPT
// - Change from using `sendToDiscord` to `sendDataToGoogleSheet`
// ref: Using Google App Mail: https://github.com/dwyl/learn-to-send-email-via-google-script-html-no-server


const URL = 'https://script.google.com/macros/s/AKfycby9h0uGt8GR2OWOwX8j3HCevnMJwFX0J3WMOAl8DGQW65TIYRGS8FQc7DaiNmq37R5m/exec'; // AppScriptURL



async function sendDataToGoogleSheet(jsonData) {
    try {
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify(jsonData),
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.text();
        console.log('Success:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}


async function getVisitorInfo() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error retrieving visitor information:', error);
        return null;
    }
}


function getBrowserInfo() {
    const ua = navigator.userAgent;
    let tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: 'IE', version: tem[1] || '' };
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge?)\/(\d+)/);
        if (tem != null) return { name: tem[1].replace('OPR', 'Opera'), version: tem[2] };
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return { name: M[0], version: M[1] };
}


async function logVisitor() {
    const visitorInfo = await getVisitorInfo();
    const timestamp = new Date().toISOString();
    const browserInfo = getBrowserInfo();

    if (visitorInfo) {
        const message = `
                    New Visitor:
                    IP-Adress: ${visitorInfo.ip}
                    Timestramp: ${timestamp}
                    City: ${visitorInfo.city}
                    Region: ${visitorInfo.region}
                    Country: ${visitorInfo.country_name}
                    postal code: ${visitorInfo.postal}
                    Latitude: ${visitorInfo.latitude}
                    Longitude: ${visitorInfo.longitude}
                    ISP: ${visitorInfo.org}
                    Browser: ${browserInfo.name} ${browserInfo.version}
                    Operating system: ${navigator.platform}
                    User-Agent: ${navigator.userAgent}
                `;

        const jsonData = {
            content: message
        };

        sendDataToGoogleSheet(jsonData);
    }
}

window.onload = logVisitor;