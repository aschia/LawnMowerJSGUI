const express = require("express");
const fileUpload = require("express-fileupload");
const sharp = require("sharp");
const fabric = require("fabric");
const { Client } = require("node-scp");
var fs = require('fs');

const app = express();
app.use(fileUpload());

// Upload Endpint
  app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const file = req.files.file;
  const bwThreshold = parseInt(req.body.bwThreshold);

  console.log(bwThreshold);
  // We need unique file name to save it in folder and then use filename to access it. I have replace space with - and concatinated file name with Date String. We can also used uuid package as well.
  const processedFileName = `processed.${new Date().getTime()}-${file.name.replaceAll(
    " ",
    "-"
  )}`;

  let fileWithPath = `${__dirname}/client/public/uploads/${file.name}`;
  let processedFileWithPath = `${__dirname}/client/public/uploads/${processedFileName}`;
  file.mv(fileWithPath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    }

    let processImageMessage = "";
    resizeImageAndGrayscale(fileWithPath, bwThreshold, processedFileWithPath).then(
      (result) => {
        processImageMessage = result;
      }
    );

    let transferMessage = "";
    /*
    // the function has to be asynchronous, so we have to return the message via then()
    transferTheFile(processedFileWithPath).then((result) => {
      transferMessage = result;

      res.json({
        fileName: file.name,
        filePath: `/uploads/${file.name}`,
        processImageMessage: processImageMessage,
        processedFileName,
        processedFilePath: `/uploads/${processedFileName}`,
        transferMessage,
      });
    });
    */
   // send result back to the web page 
   res.json({
      fileName: file.name,
      filePath: `/uploads/${file.name}`,
      processImageMessage: processImageMessage,
      processedFileName,
      processedFilePath: `/uploads/${processedFileName}`,
      transferMessage,
    });
    
  });
});

// after we send the file, we will remove it from the server
app.post("/sendFile", (req, res) => {
  if (req.body.processedFileName === null) {
    return res.status(400).json({ message: "No processedFileName" });
  }
    // the path of the processed file we are going to send to the lawnmower
    const fileWithPathToSend = req.body.processedFilePath;
    const filenameToSend = req.body.processedFileName;
    let processedFileWithPath = `${__dirname}/client/public/uploads/${filenameToSend}`;

    let transferMessage = "";
    let deleteFileWhenDone = true;
    // the function has to be asynchronous, so we have to return the message via then()
    transferTheFile(processedFileWithPath, deleteFileWhenDone).then((result) => {
      transferMessage = result;

      // return this to the web page
      res.json({
        transferMessage,
      });
    });
  });

  app.post("/processFile", (req, res) => {
    if (req.body.processedFileName === null) {
      return res.status(400).json({ message: "No file uploaded" });
    }
      // the path of the processed file we are going to send to the lawnmower
      // const fileWithPathToSend = req.body.processedFilePath;
      const fileName = req.body.fileName;
      let originalFileWithPath = `${__dirname}/client/public/uploads/${fileName}`;
      const processedFileName = req.body.processedFileName;
      let processedFileWithPath = `${__dirname}/client/public/uploads/${processedFileName}`;

      const bwThreshold = parseInt(req.body.bwThreshold);

      let processImageMessage = "";
      resizeImageAndGrayscale(originalFileWithPath, bwThreshold, processedFileWithPath).then(
        (result) => {
          processImageMessage = result;
        }
      );
  
        // return this to the web page
        res.json({
          fileName: fileName,
          filePath: `/uploads/${fileName}`,
          processImageMessage,
          processedFileName,
          processedFilePath: `/uploads/${processedFileName}`,
        });

    });



const resizeImageAndGrayscale = async (
  originalFilePathAndName,
  bwThreshold,
  processedFilePathAndName
) => {
  let message = "ok";
  try {
    await sharp(originalFilePathAndName)
      /*.resize({
        width: 640,
        height: 480,
      })*/
      .resize(512, 512, {
        kernel: sharp.kernel.nearest,
        fit: 'contain',
        position: 'right top',
        background: { r: 255, g: 255, b: 255, alpha: 0.5 }
      })
      .grayscale()
      //.sharpen({ sigma: 2 })
      .threshold(bwThreshold) //bwThreshold) // != null ? bwThreshold : 123)
      //.toFormat("jpeg", { mozjpeg: true })
      .toFile(processedFilePathAndName);
  } catch (error) {
    message = error.message;
    console.log(error);
  }

  return message;
};

const transferTheFile = async (filename, onlyDeleteFileWhenSuccessful) => {
  let message = "start";
  let deleteErrorMessage = "";
  let success = false;

  try {
    // TODO: put the rasp pi scp details here at some point
    const client = await Client({
      host: "pitunnel.com", //"34.125.170.180",
      port: 15768,
      username: "RoboMower",
      password: "RobotMower2022!",
      // privateKey: fs.readFileSync('./key.pem'),
      // passphrase: 'your key passphrase',
    });
    await client.uploadFile(
      `./${filename}`,
      `./${filename}`
      // options?: TransferOptions
    );

    client.close(); // remember to close connection after you finish
    success = true;
  } catch (e) {
    message = e.message;
    console.log(e);
    success = false;
  }

    // TODO:  When we have the endpoint available, use this
    //if (onlyDeleteFileWhenSuccessful && success){
    // delete it everytime for now
    if (onlyDeleteFileWhenSuccessful){
    fs.unlink(filename,
       (err) => { deleteErrorMessage = err })
       ;
  }


  return message + deleteErrorMessage;
};

app.listen(5000, () => console.log("Server started..."));
