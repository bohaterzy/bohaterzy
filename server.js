const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files in 'uploads' folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage });

mongoose.connect('mongodb://localhost:27017/myDatabase');

const videoSchema = new mongoose.Schema({
    name: String,
    description: String,
    latitude: Number,
    longitude: Number,
    teamName: String,         // New field
    virtues: [String],        // List of virtues (array of strings)
    videoPaths: [String],
    approved: Boolean         // Approval status (true/false)
});

const Video = mongoose.model('Video', videoSchema, 'videos');

// Get all videos
app.get('/videos', async (req, res) => {
    try {
        const videos = await Video.find({ approved: true });
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});

// Upload video and save details
app.post('/upload-video', upload.array('mediaFiles', 10), async (req, res) => {
    try {
        const { name, description, latitude, longitude, teamName, virtues } = req.body;
        const videoPaths = req.files.map(file => `/uploads/${file.filename}`);

        if (!name || !description || latitude == null || longitude == null || videoPaths.length === 0) {
            return res.status(400).json({ success: false, error: "Missing required fields" });
        }

        const newVideo = new Video({
            name,
            description,
            latitude,
            longitude,
            teamName,
            virtues: JSON.parse(virtues),
            approved: true,
            videoPaths
        });
        
        await newVideo.save();

        res.json({ success: true, message: "Video uploaded successfully!", videoPaths });
    } catch (error) {
        console.error("Error uploading video:", error);
        res.status(500).json({ success: false, error: "Error uploading video" });
    }
});

// Serve uploaded video files
app.use('/uploads', express.static('uploads'));

// app.get('/map', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
