const express = require("express");
const fileUpload = require("express-fileupload");
const sharp = require("sharp");
const fabric = require("fabric");
const { Client } = require("node-scp");

const app = express();
app.use(fileUpload());

// Upload Endpint
app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const file = req.files.file;
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
    resizeImageAndGrayscale(fileWithPath, processedFileWithPath).then(
      (result) => {
        processImageMessage = result;
      }
    );

    let transferMessage = "";
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
  });
});

const resizeImageAndGrayscale = async (
  originalFilePathAndName,
  processedFilePathAndName
) => {
  let message = "ok";
  try {
    await sharp(originalFilePathAndName)
      .resize({
        width: 640,
        height: 480,
      })
      .grayscale()
      //.toFormat("jpeg", { mozjpeg: true })
      .toFile(processedFilePathAndName);
  } catch (error) {
    message = error.message;
    console.log(error);
  }

  return message;
};

const transferTheFile = async (filename) => {
  let message = "start";
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
  } catch (e) {
    message = e.message;
    console.log(e);
  }

  return message;
};

app.listen(5000, () => console.log("Server started..."));
