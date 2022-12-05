const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");
const docxpdf = require("docx-pdf");
const pdfparse = require("pdf-parse");
const fs = require("fs");
// const { PythonShell } = require("python-shell");

const app = express();

// Use the middleware of bodyParser

app.use(bodyParser.urlencoded({ extended: true }));

//Python shell options
// let options = {
//   scriptPath: "E:/resume-reader/readfile",
//   args: [],
// };

let nameFile = "";
let pdfname = "";
let ext = "";


//Configure multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    //Name for a pdf file
    pdfname = file.fieldname + "-" + req.headers["name"] + ".pdf";

    //Name of the original uploaded file
    nameFile =
      file.fieldname +
      "-" +
      req.headers["name"] +
      path.extname(file.originalname);

    //Options to pass as an argument to python file
    // options["args"] = [`./uploads/${nameFile}`];

    //Extension of the file
    ext = path.extname(file.originalname);
    console.log(ext);
    cb(null, nameFile);
  },
});

var upload = multer({
  storage: storage,
});


//CREATING API
app.post("/upload", upload.single("resume"), async function (req, res, next) {

  let {name} = req.body

  let pdffile;
  let textdata = '';

  //Creating a promise object
  let pdfPromise = new Promise(function (resolve, reject) {
    let rd;
    docxpdf(
      `./uploads/${nameFile}`,
      `./uploads/${pdfname}`,
      function (err, result) {
        if (err) {
          rd = err.message;
          reject(new Error("Cannot create pdf"));
        }
        rd = result;
        resolve();
      }
    );
  });

  // Convert the file to pdf if the file is docx
  if (ext !== ".pdf") {
    pdfPromise.then((rd) => {
      pdffile = fs.readFileSync(__dirname + `\\uploads\\${pdfname}`);

      // Convert pdf to text
      // pdfparse(pdffile).then(data => textdata = data.text);

      pdfparse(pdffile).then(function(data) {
        textdata = data.text

        //Extract email and phone with regex
        let rgMail = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
        let rgNum1 = /[\+]?\d{12}|\d{10}|\(\d{3}\)\s?-\d{6}/;

        console.log("Phone", textdata.match(rgNum1)[0]);
        console.log("Email", textdata.match(rgMail)[0]);
      })
    });
  } else {
    // Get pdf file
    pdffile = fs.readFileSync(__dirname + `\\uploads\\${pdfname}`);

    // Convert pdf to text
    // pdfparse(pdffile).then(data => textdata = data.text)
    pdfparse(pdffile).then(function(data) {
      textdata = data.text

      //Extract email and phone with regex
      let rgMail = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
      let rgNum1 = /[\+]?\d{12}|\d{10}|\(\d{3}\)\s?-\d{6}/;

      console.log("Phone", textdata.match(rgNum1)[0]);
      console.log("Email", textdata.match(rgMail)[0]);
    })
    
  }

  // let contact = {
  //   email: "",
  //   phone: "",
  // };


  // PythonShell.run("np.py", options, function (err, results) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log(results);
  //   }
  // });

  res.send('File uploaded');
});

const port = 6000;
app.listen(port, console.log(`Application started on port ${port}`));
