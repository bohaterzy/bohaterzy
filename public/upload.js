// Function to upload media (image or video)
function uploadMedia() {
    var name = document.getElementById('name').value;
    var description = document.getElementById('description').value;
    const mediaFiles = document.getElementById('mediaFiles').files;
    var teamName = document.getElementById('teamName').value;
    var virtues = document.getElementById('virtues').value.split(',').map(v => v.trim());
    var approved = document.getElementById('approved').checked;
    var lat = document.getElementById('latitude').value;
    var lng = document.getElementById('longitude').value;

    if (!name || !description || !teamName || virtues.length === 0 || mediaFiles.length === 0) {
        showToast("Please fill in all fields and select a media file.", "error");
        return;
    }

    var formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('teamName', teamName);
    formData.append('virtues', JSON.stringify(virtues));
    formData.append('approved', approved);
    formData.append('latitude', lat);
    formData.append('longitude', lng);
    // formData.append('mediaFile', mediaFile);
    for (let i = 0; i < mediaFiles.length; i++) {
        formData.append('mediaFiles', mediaFiles[i]);
    }

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
