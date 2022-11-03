const multer = require('multer');

const storage = multer.diskStorage({
    
    destination: (req, file, callback) =>{
        callback(null, 'public')
    },
    filename: (req, file, callback) =>{
        const ext = file.mimetype.split('/')[1]
        callback(null, `img-${Date.now()}.${ext}`)
    }
})
const isImage = (req, file, callback) =>{
    if (file.mimetype.startsWith('image')) {
        callback(null, true)
    }else{
        callback(new Error('Only image is allowed'))
    }
}
const upload = multer({
    storage:storage,
    fileFilter: isImage,
    limits: { fieldSize: 10 * 1024 * 1024 }
})

exports.uploadFile = upload.single('image')

exports.upload = (req, res) =>{
    console.log(req.file);

    res.status(200).send('upload success')
}