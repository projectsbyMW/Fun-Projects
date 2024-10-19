const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const { uploadDocument, uploadReplacement } = require('../controllers/doccontroller');
const { protect } = require('../middleware/authmiddleware');

// Initialize S3 Client
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {

        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Configure multer storage using multer-s3
const upload = multer({
    storage: multerS3({
        s3: s3Client, // Use the initialized S3 client
        bucket: 'mernprojectbucket123',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            cb(null, Date.now().toString() + file.originalname);
        },
    }),
});

const router = express.Router();

// Upload KYC Documents route
router.post('/upload', upload.single('fileUpload'), protect, uploadDocument);
router.post('/uploadreplacement', upload.single('fileUpload'), protect, uploadReplacement);

module.exports = router;