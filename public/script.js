// Initialize Leaflet Map
var map = L.map('map', {
    zoomControl: false // Disable default zoom control
}).setView([37.7749, -122.4194], 5);

// Add zoom control at the bottom right
L.control.zoom({
    position: 'bottomright'
}).addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var red_circle = null;

// Load existing media markers from MongoDB
fetch('/videos')
    .then(response => response.json())
    .then(mediaList => {
        mediaList.forEach(media => {
            if (media.latitude && media.longitude) {
                let marker = L.marker([media.latitude, media.longitude]).addTo(map);
                marker.on('click', function () {
                    openViewSidebar(media);
                    red_circle = L.circleMarker([media.latitude, media.longitude], {radius: 15, color: '#FF0000', fillColor: '#FF0000'}).addTo(map);
                });
            }
        });
    })
    .catch(error => console.error('Error fetching media:', error));

// Na kliku - dodaj nowy, a usun stary marker
var currentMarker = null;
map.on('click', function (e) {
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;

    // Usun poprzedni marker
    if (currentMarker) {
        map.removeLayer(currentMarker);
    }
    // Dodaj nowy marker
    currentMarker = L.marker([lat, lng], {draggable: true}).addTo(map);

    openAddSidebar(lat, lng)
});

// sidebars handling -------------------------------------------------

// Function to open a sidebar
function openSidebar(id) {
    document.getElementById(id).style.display = "block";
}

// Function to close any sidebar
function closeSidebar(id) {
    document.getElementById(id).style.display = "none";
    if (red_circle) {
        map.removeLayer(red_circle);
    }
}

// Funkcja otwiera sidebar ze szczegolami istniejacego bohatera
function openViewSidebar(media) {
    closeSidebar('add-sidebar'); // Ensure the other sidebar is closed

    document.getElementById("view-name").value = media.name;
    document.getElementById("view-teamName").value = media.teamName;
    document.getElementById("view-virtues").value = media.virtues;
    document.getElementById("view-description").value = media.description;
    
    let mediaContainer = document.getElementById("media-container");
    mediaContainer.innerHTML = ""; // Clear previous content

    if (media.videoPaths && media.videoPaths.length > 0) {
        media.videoPaths.forEach(path => {
            const fileExtension = path.split('.').pop().toLowerCase();
            if (['mp4', 'webm', 'ogg', 'mov'].includes(fileExtension)) {
                mediaContainer.innerHTML += `<video width="100%" controls autoplay muted>
                    <source src="${path}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>`;
            } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
                mediaContainer.innerHTML += `<img src="${path}" style="width:100%; border-radius: 5px;">`;
            }
        });
    }

    openSidebar('view-sidebar');
}

function openAddSidebar(lat, lng) {
    closeSidebar('view-sidebar'); // Ensure the other sidebar is closed
    
    document.getElementById("latitude").value = lat;
    document.getElementById("longitude").value = lng;

    openSidebar('add-sidebar');
}
