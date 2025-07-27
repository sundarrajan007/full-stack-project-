const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const eventController = require('../controllers/eventController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // ensrs the img get strd with unique fle name 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post('/', upload.single("image"), eventController.createEvent);
router.get('/', eventController.getAllEvents);
router.put('/:id', upload.single("image"), eventController.updateEvent); 
router.delete('/:id', eventController.deleteEvent);
router.post('/share', eventController.shareEvent); 

module.exports = router;
