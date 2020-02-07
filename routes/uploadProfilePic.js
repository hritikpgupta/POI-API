const { User } = require('../models/user')
const express = require('express')
const auth = require('../middleware/authenticate')
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer')
const fs = require('fs')
const config = require('config')


// cloudinary.config({
//     cloud_name: config.get('cloudName'),
//     api_key: config.get('api_key'),
//     api_secret: config.get('api_secret')
// });
cloudinary.config({
    cloud_name: 'buuzuu',
    api_key: '813843356588537',
    api_secret: 'F-SoOYvo-BDMB0701qL0FvkP3M0'
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

router.post('/:id', auth, async (req, res, next) => {
    const upload = multer({ storage: storage, limits: { fileSize: 2 * 1048576 } }).single('profile_image')


    upload(req, res, function (err) {
        if (err) return res.send(err)
        const path = req.file.path
        const uniqueFilename = req.params.id

        cloudinary.uploader.upload(
            path,
            {
                public_id: uniqueFilename, tags: 'profile_pic', overwrite: true, folder: "POI-Profile",
            },
            async function (err, image) {
                if (err) return res.send(err)
                fs.unlinkSync(path)
                let user = await User.findOne({ mobileNumber: { $eq: req.params.id } })
                user.profileImage = image.url
                await user.save()
                res.send({ success: image.url })
            }
        )
    })
})

module.exports = router;

