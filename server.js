const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '/public/')));
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

mongoose.connect('mongodb://localhost:27017/TysiacLatKorony');

const teamNameSchema = new mongoose.Schema({
    teamName: String,         
    description: String,
    latitude: Number,
    longitude: Number,
    approved: Boolean         // (true/false)
});

const TeamName = mongoose.model('TeamName', teamNameSchema, 'teamnames');

// Get all approved team names
app.get('/teamnames', async (req, res) => {
    try {
        const teamNames = await TeamName.find({ approved: true });
        res.json(teamNames);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch team names' });
    }
});

// Upload team name to mongodb
app.post('/upload-team-name', upload.single('teamName'), async (req, res) => {
    try {
        const { teamName, description, latitude, longitude} = req.body;
        if (!teamName || !description || latitude == null || longitude == null) {
            return res.status(400).json({ success: false, error: "Missing required fields" });
        }

        const newTeamName = new TeamName({
            teamName,
            description,
            latitude,
            longitude,
            approved: true
        });
        
        await newTeamName.save();

        res.json({ success: true, message: "Team name uploaded successfully!" });
    } catch (error) {
        console.error("Error uploading team name:", error);
        res.status(500).json({ success: false, error: "Error uploading team name" });
    }
});

app.get('/api/team-names', async (req, res) => {
    try {
        const teamNames = await TeamName.distinct("teamName");
        res.json(teamNames);
    } catch (error) {
        console.error("Error fetching team names:", error);
        res.status(500).json({ error: "Failed to fetch team names" });
    }
});

const HeroSchema = new mongoose.Schema({
    teamName: String,
    name: String,         
    description: String,
    virtues: [String],
    latitude: Number,
    longitude: Number,
    approved: Boolean         // (true/false)
});

const Hero = mongoose.model('Hero', HeroSchema, 'heronames');

// Get all approved heroes
app.get('/heros', async (req, res) => {
    try {
        const heros = await Hero.find({ approved: true });
        res.json(heros);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch heros' });
    }
});

// Upload hero to mongodb
app.post('/upload-hero', upload.single('hero-name'), async (req, res) => {
    try {
        const { teamName, name, description, latitude, longitude } = req.body;
        
        if (!teamName || !name || !description || latitude == null || longitude == null) {
            return res.status(400).json({ success: false, error: "Missing required fields" });
        }

        const newHero = new Hero({
            teamName,
            name,
            description,
            latitude,
            longitude,
            virtues: req.body.virtues || [],
            approved: true
        });
        
        await newHero.save();

        res.json({ success: true, message: "Hero uploaded successfully!" });
    } catch (error) {
        console.error("Error uploading hero:", error);
        res.status(500).json({ success: false, error: "Error uploading hero" });
    }
});

const mediaFileSchema = new mongoose.Schema({
    teamName: String,         
    description: String,
    videoPaths: [String],
    latitude: Number,
    longitude: Number,
    approved: Boolean,        // (true/false)
});

const MediaFile = mongoose.model('MediaFile', mediaFileSchema, 'mediafiles');

// Get all approved media files
app.get('/media-files', async (req, res) => {
    try {
        const mediaFiles = await MediaFile.find({ approved: true });
        res.json(mediaFiles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch media files' });
    }
});

// Upload media files to mongodb
app.post('/upload-media-files', upload.array('mediaFiles', 10), async (req, res) => {
    try {
        const { teamName, description, latitude, longitude} = req.body;
        const videoPaths = req.files.map(file => `/uploads/${file.filename}`);

        if (!teamName || !description || latitude == null || longitude == null || videoPaths.length === 0) {
            return res.status(400).json({ success: false, error: "Missing required fields" });
        }

        const newMediaFiles = new MediaFile({
            teamName,
            description,
            videoPaths,
            latitude,
            longitude,
            approved: true,
        });
        
        await newMediaFiles.save();

        res.json({ success: true, message: "Media files uploaded successfully!" });
    } catch (error) {
        console.error("Error uploading media file:", error);
        res.status(500).json({ success: false, error: "Error uploading media file" });
    }
});

const targetFileSchema = new mongoose.Schema({
    teamName: String,         
    description: String,
    videoPaths: [String],
    latitude: Number,
    longitude: Number,
    approved: Boolean,        // (true/false)
});

const TargetFile = mongoose.model('TargetFile', targetFileSchema, 'targetfiles');

// Get all approved target files
app.get('/target-files', async (req, res) => {
    try {
        const targetFiles = await TargetFile.find({ approved: true });
        res.json(targetFiles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch target files' });
    }
});

// Upload target files to mongodb
app.post('/upload-target-files', upload.array('targetFiles', 10), async (req, res) => {
    try {
        const { teamName, description, latitude, longitude} = req.body;
        const videoPaths = req.files.map(file => `/uploads/${file.filename}`);
        
        if (!teamName || !description || latitude == null || longitude == null || videoPaths.length === 0) {
            return res.status(400).json({ success: false, error: "Missing required fields" });
        }

        const newTargetFiles = new TargetFile({
            teamName,
            description,
            videoPaths,
            latitude,
            longitude,
            approved: true,
        });
        
        await newTargetFiles.save();

        res.json({ success: true, message: "Target files uploaded successfully!" });
    } catch (error) {
        console.error("Error uploading target file:", error);
        res.status(500).json({ success: false, error: "Error uploading target file" });
    }
});

app.use('/uploads', express.static('uploads'));

// app.get('/map', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
