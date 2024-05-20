let multer = require("multer");
const path = require("path");

// MULTER SETUP
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "file") {
            cb(null, path.join(__dirname, "../../public"));
        }
    },
    filename: (req, file, cb) => {
        let fileName = file.originalname.split(".");
        cb(null, Date.now() + "." + fileName[fileName.length - 1]);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === "file") {
        cb(null, true);
    } else {
        throw new Error(
            "Form Data should only contain songThumbnail and songFile Fields"
        );
    }
};

// MULTER INSTANCE
let upload = multer({ storage, fileFilter });

// MIDDLWARE FOR MULTER
let uploadMiddleware = upload.fields([{ name: "file", maxCount: 1 }]);

async function uploadHandler(req, res) {
    console.log(req.files);
    res.status(200);
    res.json({
        isSuccess: true,
        message: "File uploaded successfully",
        data: {
            fileUrl: req.files["file"][0].filename,
        },
    });
}

module.exports = { uploadMiddleware, uploadHandler };
