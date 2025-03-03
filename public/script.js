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
    position:'topright',		
    initial: false,
    collapsed: false,
    textCancel: 'Wyczyść pole wyszukiwania',
    textPlaceholder: 'Wyszukaj nazwę patrolu lub bohatera...',
    zoom: 13,
    textErr: 'Nic nie znaleziono!',
    minLength: 4
}).addTo(map);

L.easyButton({
    id: 'polozenie-startowe',  
    position: 'bottomright',      
    leafletClasses: true,     
    states:[{                 
      stateName: 'pozycja-startowa',
      onClick: function(button, map){
        map.setView([52.114339, 19.423672], 7);
      },
      title: 'połoźenie startowe',
      icon: '<img src="/svg/house.svg">'
    }]
  }).addTo(map);

var red_circle = null;
var green_circle = null;

fetch('/teamnames')
    .then(response => response.json())
    .then(mediaList => {
        mediaList.forEach(media => {
            if (media.latitude && media.longitude) {
                let marker = L.marker([media.latitude, media.longitude], {
                    title: media.teamName,
                    icon: geoIcon
                })
                .addTo(searchLayer)
                .bindTooltip(`Patrol : ${media.teamName}`, {
                    permanent: false,
                    direction: 'top',
                    opacity: 0.9
                })
                .bindPopup(`<b>Patrol :</b><br> ${media.teamName} <br><i> ${media.description}</i>`);
                marker.on('click', function () { show_red_circle(media, false); } );
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
                    icon: geoIcon
                })
                .addTo(searchLayer)
                .bindTooltip(`Bohater: ${media.name} dodany przez patrol: ${media.teamName}`, {
                    permanent: false,
                    direction: 'top',
                    opacity: 0.9
                })
                .bindPopup(`<b>Bohater:</b><br> ${media.name} <br><i> ${media.description}</i><br><b>Cechy charaktery:</b><br><i>${media.virtues}</i><br><b>Patrol:</b><br><i> ${media.teamName} </i>`);
                marker.on('click', function () { show_red_circle(media, false); } );
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
                    icon: geoIcon
                })
                .addTo(searchLayer)
                .bindTooltip(`Kronika dodana przez patrol: ${media.teamName}`, {
                    permanent: false,
                    direction: 'top',
                    opacity: 0.9
                })
                .bindPopup(`<b>Kronika:</b><br><i> ${media.description}</i><br><b>Patrol:</b><br><i> ${media.teamName} </i>`);
                marker.on('click', function () { show_red_circle(media, true); } );
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
                    icon: geoIcon
                })
                .addTo(searchLayer)
                .bindTooltip(`Cel wyprawy dodany przez patrol: ${media.teamName}`, {
                    permanent: false,
                    direction: 'top',
                    opacity: 0.9
                })
                .bindPopup(`<b>Cel wyprawy:</b><br><i> ${media.description}</i><br><b>Patrol:</b><br><i> ${media.teamName} </i>`);
                marker.on('click', function () { show_red_circle(media, true); } );
            }
        });
    })
.catch(error => console.error('Error fetching media:', error));

function show_red_circle(media, open) {
    if (red_circle) {
        map.removeLayer(red_circle);
    }                
    red_circle = L.circleMarker([media.latitude, media.longitude], 
        {
            radius: 15, color: '#FF0000', fillColor: '#FF0000'
        })
        .addTo(map);
    if (open) {
        openViewSidebar(media);
    }
}

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

// Funkcja otwiera sidebar ze szczegolami kroniki lub celu wyprawy
function openViewSidebar(media) {

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
    sidebar.enablePanel('view-details');
    sidebar.open("view-details");
}

// --------------------------------------------------------------------

function addMarkerToMap() {
    // Funkcja wolana gdy kliknieto w dodanie rzeczy na sidebar - dodaj nowy, a usun stary marker
    var lat = map.getCenter().lat;
    var lng = map.getCenter().lng;

    document.getElementById("latitude").value = lat;
    document.getElementById("longitude").value = lng;

    if (currentMarker) {
        map.removeLayer(currentMarker);
    }
    currentMarker = L.marker([lat, lng], {
        draggable: true, 
        icon: geoIcon
    }).addTo(map);
               
    green_circle = L.circleMarker([lat, lng], 
        {
            radius: 15, color: '#00FF00', fillColor: '#00FF00'
        })
        .addTo(map);
    setTimeout(() => {
        map.removeLayer(green_circle);
    }, 2000);
    
    currentMarker.on('dragend', onDrag);
    map.setView([lat, lng], 10);
}

var sidebar = L.control.sidebar({
    autopan: true,
    closeButton: true,
    container: 'sidebar',
    position: 'left',
})
.addTo(map);

sidebar.on('closing', function(e) {
    sidebar.disablePanel("view-details");
})

fetch('sidebar-home.html')
    .then(response => response.text())
    .then(homeHTML => {
        sidebar.addPanel({
            id: 'home',
            tab: '<i class="fa fa-bars active"></i>',
            title: "Mam charakter - gra terenowa",
            pane: homeHTML
        }); 
        sidebar.open("home");       
    })
    .then(res => {
        return fetch('sidebar-teamname.html')
    })
    .then(response => response.text())
    .then(teamnameHtml => {
        sidebar.addPanel({
            id: 'teamname',
            tab: '<i class="fa fa-user"></i>',
            title: "dodaj patrol",
            button: function (event) { 
                addMarkerToMap();
                sidebar.open("teamname");
            },
            pane: teamnameHtml
        });       
    })
    .then(res => {
        return fetch('sidebar-hero.html')
    })
    .then(response => response.text())
    .then(heroHtml => {
        sidebar.addPanel({
            id: 'hero',
            tab: '<i class="fa fa-btc"></i>',
            title: "dodaj bohatera",
            button: function (event) { 
                addMarkerToMap();
                sidebar.open("hero");
            },
            pane: heroHtml
        });   
    })
    .then(res => {
        return fetch('sidebar-media.html')
    })
    .then(response => response.text())
    .then(mediaHtml => {
        sidebar.addPanel({
            id: 'media',
            tab: '<i class="fa fa-book"></i>',
            title: "dodaj kronikę",
            button: function (event) { 
                addMarkerToMap();
                sidebar.open("media");
            },
            pane: mediaHtml
        });
               
    })
    .then(res => {
        return fetch('sidebar-target.html')
    })
    .then(response => response.text())
    .then(targetHtml => {
        sidebar.addPanel({
            id: 'target',
            tab: '<i class="fa fa-flag-checkered"></i>',
            title: "dodaj cel wyprawy",
            button: function (event) { 
                addMarkerToMap();
                sidebar.open("target");
            },
            pane: targetHtml
        });
               
    })
    .then(res => {
        return fetch('sidebar-view.html')
    })
    .then(response => response.text())
    .then(viewHtml => {
        sidebar.addPanel({
            id: 'view-details',
            tab: '<i class="fa fa-eye"></i>',
            title: "wyprawa",
            pane: viewHtml,
            disabled: true
        });   
    })
    .then(res => {
        loadTeamNames();
    })
    .catch(error => console.error('Failed to load sidebar:', error));
