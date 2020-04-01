const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const mongoose = require('mongoose');
const multer = require('multer');
const crossDomain = require('./middleware/crossDomain');
// const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 5000;
// const dbConnect = process.env.MONGODB_URI || 'mongodb://localhost:27017/qriousd';
const dbConnect = 'mongodb+srv://eddy777:eddy123@eddy01-l47pr.mongodb.net/eddy?retryWrites=true&w=majority';

// Storage engine for upload
const storage = multer.diskStorage({
    destination: './uploads/course_images',
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}_${file.originalname}`);
    }
})

const upload = multer({
    
    storage: storage
})

const startDb = async () => {
    try {
        const val = await mongoose.connect(dbConnect, { useNewUrlParser: true });
        console.log('connected to db');
    }
    catch (e) {
        console.log(e.message);
    }
}
startDb();
// const mainRoute = require('./routes/main');
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const quesRoute = require('./routes/questions');
const courseRoute = require('./routes/course');
const searchRoute = require('./routes/search');



app.use(crossDomain);
app.use('/courseImages', express.static('uploads/course_images'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/questions', quesRoute);
app.use('/api/course', upload.single('image'), courseRoute);
app.use('/api/search', searchRoute);
// app.use(cors());

server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));