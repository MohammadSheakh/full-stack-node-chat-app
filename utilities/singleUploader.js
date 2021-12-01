//external imports
const e = require("express");
const multer = require("multer");
const path = require("path");

function uploader(subforderPath, allowedFileTypes, maxFileSize, errorMsg) {
    //🔵 make upload object // multer er upload object banate hobe .. sheta ekhan theke return kore dibo
    const uploadsFolder = `${__dirname}/../../public/uploads/${subforderPath}/`;

    // define the storage
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            // cb stands for callback
            cb(null, uploadsFolder);
        },
        filename: (req, file, cb) => {
            // filename dynamically generate korte hobe .. jeno unique hoy ..
            const fileExt = path.extname(file.originalname);
            const fileName =
                file.originalname
                    .replace(fileExt, "")
                    .toLowerCase()
                    .split(" ")
                    .join("-") +
                "-" +
                Date.now();
            cb(null, fileName + fileExt); // fileName ta pathiye dilo ..
        },
    });

    //🔵 storage er pore finally amar kaj holo upload object ta banano
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: maxFileSize,
        },
        fileFilter: (req, file, cb) => {
            if (allowedFileTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(createError(errorMsg)); //http error package dia handle kortesi
            }
        },
    });

    return upload;
}

module.exports = uploader;
