const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimtype === "image/jpg" || "image/png" || "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use("images", express.static(path.join(__dirname, "images")));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.post("/upload-img", async (req, res) => {
  try {
    if (!req.file) {
      const err = new Error("Gambar harus diupload");
      err.errorStatus = 422;
      throw err;
    }
    const title = req.body.title;
    const img = req.file.path;
    console.log(img);

    console.log("uploading..");
    const newData = await pool.query(
      "INSERT INTO image (title, img) VALUES ($1,$2) RETURNING *",
      [title, img]
    );

    res.json(newData);
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(8000, () => {
  console.log("server is running");
});
