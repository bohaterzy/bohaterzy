function uploadTeamName() {
    var teamName = document.getElementById('teamName').value;
    var description = document.getElementById('description').value;
    var lat = document.getElementById('latitude').value;
    var lng = document.getElementById('longitude').value;
    var approved = document.getElementById('approved').checked;

    if (!description || !teamName) {
        showToast("Proszę wypełnić wszystkie pola!", "error");
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
            showToast("Patrol został dodany do mapy!", "success");
            setTimeout(() => location.reload(), 1000);
        } else {
            showToast("Wystąpił błąd podczas dodawania patrolu.", "error");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast("Wystąpił błąd podczas dodawania patrolu.", "error");
    });
}

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
        showToast("Proszę wypełnić wszystkie pola.", "error");
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
    
    fetch('/upload-hero', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast("Bohater został dodany do mapy!", "success");
            setTimeout(() => location.reload(), 1000);
        } else {
            showToast("Wystąpił błąd podczas dodawania bohatera.", "error");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast("Wystąpił błąd podczas dodawania bohatera.", "error");
    });
}

function uploadMedia() {
    var teamName = document.getElementById('media-teamName').value;
    var description = document.getElementById('media-description').value;
    const mediaFiles = document.getElementById('mediaFiles').files;
    var lat = document.getElementById('latitude').value;
    var lng = document.getElementById('longitude').value;
    var approved = document.getElementById('approved').checked;

    if (!description || !teamName || mediaFiles.length === 0) {
        showToast("Proszę wypełnić wszystkie pola.", "error");
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

    fetch('/upload-media-files', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast("Kronika została dodana do mapy!", "success");
            setTimeout(() => location.reload(), 1000);
        } else {
            showToast("Wystąpił błąd podczas dodawania kroniki.", "error");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast("Wystąpił błąd podczas dodawania kroniki.", "error");
    });
}

function uploadTarget() {
    var teamName = document.getElementById('target-teamName').value;
    var description = document.getElementById('target-description').value;
    const targetFiles = document.getElementById('targetFiles').files;
    var lat = document.getElementById('latitude').value;
    var lng = document.getElementById('longitude').value;
    var approved = document.getElementById('approved').checked;

    if (!description || !teamName || targetFiles.length === 0) {
        showToast("Proszę wypełnić wszystkie pola.", "error");
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
            showToast("Cel wyprawy został dodany do mapy!", "success");
            setTimeout(() => location.reload(), 1000);
        } else {
            showToast("Wystąpił błąd podczas dodawania cely wyprawy.", "error");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast("Wystąpił błąd podczas dodawania celu wyprawy.", "error");
    });
}
