// Load sidebars from sidebars.html
window.addEventListener('DOMContentLoaded', () => {
    fetch('sidebars.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('sidebars-container').innerHTML = html;
        })
        .catch(error => console.error('Failed to load sidebars:', error));
});

//odswiezenie pozycji po przeniesieniu pinezki w inne miejsce
var onDrag = function (e) {
    var latlng = currentMarker.getLatLng();
    document.getElementById('latitude').value = latlng.lat;
    document.getElementById('longitude').value = latlng.lng;
};

var map = L.map('map', {
    zoomControl: false
}).setView([52.114339, 19.423672], 7);

var geoIcon = L.icon({
    iconUrl: 'svg/geo-alt-fill.svg',
    iconSize: [36, 54]
});

var currentMarker = null;

L.control.scale({
    position: 'bottomright',
    imperial: false
}).addTo(map);

L.control.zoom({
    position: 'bottomright'
}).addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var searchLayer = L.layerGroup().addTo(map);

var searchControl = L.control.search({
    layer: searchLayer,
    position:'topleft',		
    initial: false,
    collapsed: false,
    textCancel: 'Wyczyść pole wyszukiwania',
    textPlaceholder: 'Wyszukaj nazwę patrolu lub bohatera...',
    zoom: 13,
    textErr: 'Nic nie znaleziono!',
    minLength: 4
}).addTo(map);

L.easyButton({
    id: 'polozenie-startowe',  // an id for the generated button
    position: 'topright',      // inherited from L.Control -- the corner it goes in
    leafletClasses: true,     // use leaflet classes to style the button?
    states:[{                 // specify different icons and responses for your button
      stateName: 'pozycja-startowa',
      onClick: function(button, map){
        map.setView([52.114339, 19.423672], 7);
      },
      title: 'połoźenie startowe',
      icon: '<img src="/svg/house.svg">'
    }]
  }).addTo(map);

L.easyButton({
    id: 'dodaj-patrol-button',  // an id for the generated button
    position: 'topright',      // inherited from L.Control -- the corner it goes in
    leafletClasses: true,     // use leaflet classes to style the button?
    states:[{                 // specify different icons and responses for your button
      stateName: 'dodaj-patrol',
      onClick: function(button, map){
        // Na kliku - dodaj nowy, a usun stary marker
        var lat = map.getCenter().lat;
        var lng = map.getCenter().lng;

        // Usun poprzedni marker
        if (currentMarker) {
            map.removeLayer(currentMarker);
        }
        // Dodaj nowy marker
        currentMarker = L.marker([lat, lng], {
            draggable: true, 
            icon: geoIcon
        }).addTo(map);

        currentMarker.on('dragend', onDrag);

        openAddSidebar('add-team-sidebar', lat, lng)
        map.setView([lat, lng])
      },
      title: 'dodaj patrol',
      icon: '<img src="/svg/people-fill.svg">'
    }]
  }).addTo(map);

L.easyButton({
    id: 'dodaj-bohatera-button',  // an id for the generated button
    position: 'topright',      // inherited from L.Control -- the corner it goes in
    leafletClasses: true,     // use leaflet classes to style the button?
    states:[{                 // specify different icons and responses for your button
        stateName: 'dodaj-bohatera',
        onClick: function(button, map){
            // Na kliku - dodaj nowy, a usun stary marker
            var lat = map.getCenter().lat;
            var lng = map.getCenter().lng;

            // Usun poprzedni marker
            if (currentMarker) {
                map.removeLayer(currentMarker);
            }
            // Dodaj nowy marker
            currentMarker = L.marker([lat, lng], {
                draggable: true, 
                icon: geoIcon
            }).addTo(map);

            currentMarker.on('dragend', onDrag);
            
            openAddSidebar('add-hero-sidebar', lat, lng)
            map.setView([lat, lng])
        },
        title: 'dodaj bohatera',
        icon: '<img src="/svg/person-standing.svg">'
    }]
    }).addTo(map);

L.easyButton({
    id: 'dodaj-kronike-button',  // an id for the generated button
    position: 'topright',      // inherited from L.Control -- the corner it goes in
    leafletClasses: true,     // use leaflet classes to style the button?
    states:[{                 // specify different icons and responses for your button
        stateName: 'dodaj-kronike',
        onClick: function(button, map){
            // Na kliku - dodaj nowy, a usun stary marker
            var lat = map.getCenter().lat;
            var lng = map.getCenter().lng;

            // Usun poprzedni marker
            if (currentMarker) {
                map.removeLayer(currentMarker);
            }
            // Dodaj nowy marker
            currentMarker = L.marker([lat, lng], {
                draggable: true, 
                icon: geoIcon
            }).addTo(map);

            currentMarker.on('dragend', onDrag);
            
            openAddSidebar('add-media-sidebar', lat, lng)
            map.setView([lat, lng])
        },
        title: 'dodaj kronikę',
        icon: '<img src="/svg/person-workspace.svg">'
    }]
    }).addTo(map);

L.easyButton({
    id: 'dodaj-cel-wyprawy-button',  // an id for the generated button
    position: 'topright',      // inherited from L.Control -- the corner it goes in
    leafletClasses: true,     // use leaflet classes to style the button?
    states:[{                 // specify different icons and responses for your button
        stateName: 'dodaj-cel-wyprawy',
        onClick: function(button, map){
            // Na kliku - dodaj nowy, a usun stary marker
            var lat = map.getCenter().lat;
            var lng = map.getCenter().lng;

            // Usun poprzedni marker
            if (currentMarker) {
                map.removeLayer(currentMarker);
            }
            // Dodaj nowy marker
            currentMarker = L.marker([lat, lng], {
                draggable: true, 
                icon: geoIcon
            }).addTo(map);

            currentMarker.on('dragend', onDrag);
            
            openAddSidebar('add-target-sidebar', lat, lng)
            map.setView([lat, lng])
        },
        title: 'dodaj cel wyprawy',
        icon: '<img src="/svg/flag-fill.svg">'
    }]
    }).addTo(map);

    L.easyButton({
        id: 'dodaj-cel-wyprawy-button',  // an id for the generated button
        position: 'topright',      // inherited from L.Control -- the corner it goes in
        leafletClasses: true,     // use leaflet classes to style the button?
        states:[{                 // specify different icons and responses for your button
            stateName: 'dodaj-cel-wyprawy',
            onClick: function(button, map){
                var lat = map.getCenter().lat;
                var lng = map.getCenter().lng;
                // create a red polyline from an array of LatLng points
                var latlngs = [
                    [lat,lng],
                    [lat+1, lng+1],
                    [lat-2, lng+3]
                ];

                var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);

                // zoom the map to the polyline
                map.fitBounds(polyline.getBounds());
            },
            title: 'dodaj cel wyprawy',
            icon: '<img src="/svg/activity.svg">'
        }]
        }).addTo(map);    

var red_circle = null;

// Load existing media markers from MongoDB
fetch('/teamnames')
    .then(response => response.json())
    .then(mediaList => {
        mediaList.forEach(media => {
            if (media.latitude && media.longitude) {
                let marker = L.marker([media.latitude, media.longitude], {
                    title: media.teamName,
                    draggable: false,
                    icon: geoIcon
                })
                .addTo(searchLayer)
                .bindTooltip(`Patrol : ${media.teamName}`, {
                    permanent: false,
                    direction: 'top',
                    opacity: 0.9
                })
                .bindPopup(`<b>Patrol :</b><br> ${media.teamName} <br><i> ${media.description}</i>`);
                marker.on('click', function () {
                    if (red_circle) {
                        map.removeLayer(red_circle);
                    }                
                    red_circle = L.circleMarker([media.latitude, media.longitude], 
                        {
                            radius: 15, color: '#FF0000', fillColor: '#FF0000'
                        })
                        .addTo(map);
                    // map.setView([media.latitude, media.longitude]);
                });
            }
        });
    })
    .catch(error => console.error('Error fetching media:', error));

fetch('/heros')
    .then(response => response.json())
    .then(mediaList => {
        mediaList.forEach(media => {
            if (media.latitude && media.longitude) {
                let marker = L.marker([media.latitude, media.longitude], {
                    title: media.name + media.virtues,
                    draggable: false,
                    icon: geoIcon
                })
                .addTo(searchLayer)
                .bindTooltip(`Bohater: ${media.name} dodany przez patrol: ${media.teamName}`, {
                    permanent: false,
                    direction: 'top',
                    opacity: 0.9
                })
                .bindPopup(`<b>Bohater:</b><br> ${media.name} <br><i> ${media.description}</i><br><b>Cechy charaktery:</b><br><i>${media.virtues}</i><br><b>Patrol:</b><br><i> ${media.teamName} </i>`);
                marker.on('click', function () {
                    if (red_circle) {
                        map.removeLayer(red_circle);
                    }                
                    red_circle = L.circleMarker([media.latitude, media.longitude], 
                        {
                            radius: 15, color: '#FF0000', fillColor: '#FF0000'
                        })
                        .addTo(map);
                    // map.setView([media.latitude, media.longitude]);
                });
            }
        });
    })
    .catch(error => console.error('Error fetching media:', error));

fetch('/media-files')
    .then(response => response.json())
    .then(mediaList => {
        mediaList.forEach(media => {
            if (media.latitude && media.longitude) {
                let marker = L.marker([media.latitude, media.longitude], {
                    title: media.description,
                    draggable: false,
                    icon: geoIcon
                })
                .addTo(searchLayer)
                .bindTooltip(`Kronika dodana przez patrol: ${media.teamName}`, {
                    permanent: false,
                    direction: 'top',
                    opacity: 0.9
                })
                .bindPopup(`<b>Kronika:</b><br><i> ${media.description}</i><br><b>Patrol:</b><br><i> ${media.teamName} </i>`);
                marker.on('click', function () {
                    if (red_circle) {
                        map.removeLayer(red_circle);
                    }                
                    red_circle = L.circleMarker([media.latitude, media.longitude], 
                        {
                            radius: 15, color: '#FF0000', fillColor: '#FF0000'
                        })
                        .addTo(map);
                    openViewSidebar(media);
                    // map.setView([media.latitude, media.longitude]);
                });
            }
        });
    })
    .catch(error => console.error('Error fetching media:', error));

fetch('/target-files')
    .then(response => response.json())
    .then(mediaList => {
        mediaList.forEach(media => {
            if (media.latitude && media.longitude) {
                let marker = L.marker([media.latitude, media.longitude], {
                    title: media.description,
                    draggable: false,
                    icon: geoIcon
                })
                .addTo(searchLayer)
                .bindTooltip(`Cel wyprawy dodany przez patrol: ${media.teamName}`, {
                    permanent: false,
                    direction: 'top',
                    opacity: 0.9
                })
                .bindPopup(`<b>Cel wyprawy:</b><br><i> ${media.description}</i><br><b>Patrol:</b><br><i> ${media.teamName} </i>`);
                marker.on('click', function () {
                    if (red_circle) {
                        map.removeLayer(red_circle);
                    }                
                    red_circle = L.circleMarker([media.latitude, media.longitude], 
                        {
                            radius: 15, color: '#FF0000', fillColor: '#FF0000'
                        })
                        .addTo(map);
                    openViewSidebar(media);
                    // map.setView([media.latitude, media.longitude]);
                });
            }
        });
    })
.catch(error => console.error('Error fetching media:', error));

async function loadTeamNames() {
    try {
        const response = await fetch('/api/team-names');
        const teamNames = await response.json();

        const teamNames_ids = ["hero-teamName", "media-teamName", "target-teamName"];
        teamNames_ids.forEach(teamName_id => {
            const teamSelect = document.getElementById(teamName_id);
            teamSelect.innerHTML = '<option value="">Wybierz patrol</option>';
    
            teamNames.forEach(team => {
                const option = document.createElement("option");
                option.value = team;
                option.textContent = team;
                teamSelect.appendChild(option);
            });
        });
    } catch (error) {
        console.error("Error loading team names:", error);
    }
}
// Call function on page load
document.addEventListener("DOMContentLoaded", loadTeamNames);

// sidebars handling -------------------------------------------------

// Function to open a sidebar
function openSidebar(id) {
    document.getElementById(id).style.display = "block";
}

// Function to close any sidebar
function closeSidebar(id) {
    document.getElementById(id).style.display = "none";
}

// Funkcja otwiera sidebar ze szczegolami patrolu, bohatera, kroniki lub celu wyprawy
function openViewSidebar(media) {
    closeSidebar('add-team-sidebar');
    closeSidebar('add-hero-sidebar');
    closeSidebar('add-media-sidebar');
    closeSidebar('add-target-sidebar');

    document.getElementById("view-teamName").innerHTML = media.teamName;
    document.getElementById("view-description").innerHTML = media.description || "";
    
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

function openAddSidebar(id, lat, lng) {
    closeSidebar('view-sidebar'); // Ensure the other sidebar is closed
    
    document.getElementById("latitude").value = lat;
    document.getElementById("longitude").value = lng;

    openSidebar(id);
}
