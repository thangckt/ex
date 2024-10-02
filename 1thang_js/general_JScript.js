
// Add Youtube frame
function addYoutubeFrame(url, style = "", containerID = null) {
    // Define HTML for YouTube frame //
    var html_str = `
    <div style=${style}>
        <div style="position:relative; padding-bottom:56.25%">
            <iframe
                style="position:absolute; left:0px; top:0px; width:100%; height:100%;" frameborder="0" allowfullscreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation allow-presentation"
                src=${url} >
            </iframe>
        </div>
    </div>`;

    // Add HTML to div-container
    var container;
    if (containerID) {
        container = document.getElementById(containerID);
    } else {
        container = document.currentScript.parentNode;
    }
    container.innerHTML = html_str;
}
