const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer storage configuration
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

mongoose.connect('mongodb://localhost:27017/myDatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const videoSchema = new mongoose.Schema({
    name: String,
    description: String,
    videoPath: String, // Save file path instead of link
    latitude: Number,
    longitude: Number
});

const Video = mongoose.model('Video', videoSchema, 'videos');

// Get all videos
app.get('/videos', async (req, res) => {
    try {
        const videos = await Video.find();
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});

// Upload video and save details
app.post('/upload-video', upload.single('videoFile'), async (req, res) => {
    try {
        const { name, description, latitude, longitude } = req.body;
        const videoPath = req.file ? `/uploads/${req.file.filename}` : null;

        if (!name || !description || !videoPath || latitude == null || longitude == null) {
            return res.status(400).json({ success: false, error: "Missing required fields" });
        }

        const newVideo = new Video({ name, description, videoPath, latitude, longitude });
        await newVideo.save();

        res.json({ success: true, message: "Video uploaded successfully!", videoPath });
    } catch (error) {
        console.error("Error uploading video:", error);
        res.status(500).json({ success: false, error: "Error uploading video" });
    }
});

// Serve uploaded video files
app.use('/uploads', express.static('uploads'));

app.get('/map', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
