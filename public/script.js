// Initialize Leaflet Map
var map = L.map('map').setView([37.7749, -122.4194], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Function to show toast messages
function showToast(message, type) {
    const toastContainer = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerText = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Load existing media markers from MongoDB
fetch('/videos')
    .then(response => response.json())
    .then(mediaList => {
        mediaList.forEach(media => {
            if (media.latitude && media.longitude) {
                let mediaPopup = `<b>${media.name}</b><br>${media.description}`;

                if (media.videoPath) {
                    const fileExtension = media.videoPath.split('.').pop().toLowerCase();
                    if (['mp4', 'webm', 'ogg', 'mov'].includes(fileExtension)) {
                        mediaPopup += `<br><video width="200" controls autoplay muted>
                                <source src="${media.videoPath}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>`;
                    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
                        mediaPopup += `<br><img src="${media.videoPath}" style="width:100%; border-radius: 5px;">`;
                    }
                }

                L.circleMarker([media.latitude, media.longitude])
                    .addTo(map)
                    .bindPopup(mediaPopup);
            }
        });
    })
    .catch(error => console.error('Error fetching media:', error));

// Click event to create a marker and open the sidebar
var currentMarker = null;
map.on('click', function (e) {
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;

    // Remove previous marker if exists
    if (currentMarker) {
        map.removeLayer(currentMarker);
    }

    // Create new marker
    currentMarker = L.marker([lat, lng]).addTo(map);

    // Show sidebar and fill in lat/lng
    document.getElementById("sidebar").style.display = "block";
    document.getElementById("latitude").value = lat;
    document.getElementById("longitude").value = lng;
});

// Function to upload media (image or video)
function uploadMedia() {
    var name = document.getElementById('name').value;
    var description = document.getElementById('description').value;
    var mediaFile = document.getElementById('mediaFile').files[0];
    var lat = document.getElementById('latitude').value;
    var lng = document.getElementById('longitude').value;

    if (!name || !description || !mediaFile) {
        showToast("Please fill in all fields and select a media file.", "error");
        return;
    }

    var formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('latitude', lat);
    formData.append('longitude', lng);
    formData.append('mediaFile', mediaFile);

    fetch('/upload-video', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast("Media uploaded successfully!", "success");
            setTimeout(() => location.reload(), 1000);
        } else {
            showToast("Error uploading media.", "error");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast("Error uploading media.", "error");
    });
}
