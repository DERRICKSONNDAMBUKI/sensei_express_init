const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // upload forlder
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + ".png");
    },
});

const photoUpload = multer({
    storage: storage,
    // limits: 1*1000*1000
    fileFilter: (req, file, cb) => {
        let fileTypes = /jpg|jpeg|png/;
        var mimetype = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        if (mimetype && extname) {
            return cb(null, true);
        }

        cb("Error: File upload only support images of type: " + fileTypes);
    },
    // name of input field on form
});

module.exports = { photoUpload }

