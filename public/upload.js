// Function to upload media (image or video)
function uploadTeamName() {
    var teamName = document.getElementById('teamName').value;
    var description = document.getElementById('description').value;
    var lat = document.getElementById('latitude').value;
    var lng = document.getElementById('longitude').value;
    var approved = document.getElementById('approved').checked;

    if (!description || !teamName) {
        showToast("Please fill in all fields.", "error");
        return;
    }

    var formData = new FormData();
    formData.append('teamName', teamName);
    formData.append('description', description);
    formData.append('latitude', lat);
    formData.append('longitude', lng);
    formData.append('approved', approved);

    fetch('/upload-team-name', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast("Team name uploaded successfully!", "success");
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

// Function to upload media (image or video)
function uploadHero() {
    var teamName = document.getElementById('hero-teamName').value;
    var name = document.getElementById('hero-name').value;
    var description = document.getElementById('hero-description').value;
    const selectedVirtues = Array.from(document.querySelectorAll('input[name="virtues"]:checked'))
        .map(checkbox => checkbox.value);
    var lat = document.getElementById('latitude').value;
    var lng = document.getElementById('longitude').value;
    var approved = document.getElementById('approved').checked;

    if (!teamName || !name || !description) {
        showToast("Please fill in all fields.", "error");
        return;
    }

    var formData = new FormData();
    formData.append('teamName', teamName);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('latitude', lat);
    formData.append('longitude', lng);
    formData.append('approved', approved);
    formData.append("virtues", JSON.stringify(selectedVirtues)); 
    console.log("Selected Virtues:", selectedVirtues);
    
    fetch('/upload-hero', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast("Hero uploaded successfully!", "success");
            setTimeout(() => location.reload(), 1000);
        } else {
            showToast("Error uploading hero.", "error");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast("Error uploading media.", "error");
    });
}

// Function to upload media (image or video)
function uploadMedia() {
    var teamName = document.getElementById('media-teamName').value;
    var description = document.getElementById('media-description').value;
    const mediaFiles = document.getElementById('mediaFiles').files;
    var lat = document.getElementById('latitude').value;
    var lng = document.getElementById('longitude').value;
    var approved = document.getElementById('approved').checked;

    if (!description || !teamName || mediaFiles.length === 0) {
        showToast("Please fill in all fields and select a media file.", "error");
        return;
    }

    var formData = new FormData();
    formData.append('teamName', teamName);
    formData.append('description', description);
    formData.append('latitude', lat);
    formData.append('longitude', lng);
    formData.append('approved', approved);
    for (let i = 0; i < mediaFiles.length; i++) {
        formData.append('mediaFiles', mediaFiles[i]);
    }

    console.log(formData);

    fetch('/upload-media-files', {
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

// Function to upload target (image or video)
function uploadTarget() {
    var teamName = document.getElementById('target-teamName').value;
    var description = document.getElementById('target-description').value;
    const targetFiles = document.getElementById('targetFiles').files;
    var lat = document.getElementById('latitude').value;
    var lng = document.getElementById('longitude').value;
    var approved = document.getElementById('approved').checked;

    if (!description || !teamName || targetFiles.length === 0) {
        showToast("Please fill in all fields and select a target file.", "error");
        return;
    }

    var formData = new FormData();
    formData.append('teamName', teamName);
    formData.append('description', description);
    formData.append('latitude', lat);
    formData.append('longitude', lng);
    formData.append('approved', approved);
    for (let i = 0; i < targetFiles.length; i++) {
        formData.append('targetFiles', targetFiles[i]);
    }

    fetch('/upload-target-files', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast("Target uploaded successfully!", "success");
            setTimeout(() => location.reload(), 1000);
        } else {
            showToast("Error uploading target.", "error");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast("Error uploading target.", "error");
    });
}


// // Function to upload media (image or video)
// function uploadTarget() {
//     var name = document.getElementById('name').value;
//     var description = document.getElementById('description').value;
//     const mediaFiles = document.getElementById('mediaFiles').files;
//     var teamName = document.getElementById('teamName').value;
//     var virtues = document.getElementById('virtues').value.split(',').map(v => v.trim());
//     var approved = document.getElementById('approved').checked;
//     var lat = document.getElementById('latitude').value;
//     var lng = document.getElementById('longitude').value;

//     if (!name || !description || !teamName || virtues.length === 0 || mediaFiles.length === 0) {
//         showToast("Please fill in all fields and select a media file.", "error");
//         return;
//     }

//     var formData = new FormData();
//     formData.append('name', name);
//     formData.append('description', description);
//     formData.append('teamName', teamName);
//     formData.append('virtues', JSON.stringify(virtues));
//     formData.append('approved', approved);
//     formData.append('latitude', lat);
//     formData.append('longitude', lng);
//     // formData.append('mediaFile', mediaFile);
//     for (let i = 0; i < mediaFiles.length; i++) {
//         formData.append('mediaFiles', mediaFiles[i]);
//     }

//     fetch('/upload-video', {
//         method: 'POST',
//         body: formData
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             showToast("Media uploaded successfully!", "success");
//             setTimeout(() => location.reload(), 1000);
//         } else {
//             showToast("Error uploading media.", "error");
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         showToast("Error uploading media.", "error");
//     });
// }
