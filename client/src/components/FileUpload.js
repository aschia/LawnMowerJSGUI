import React, { Fragment, useState } from "react";
import Message from "./Message";
import Progress from "./Progress";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose File");
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );

          // Clear percentage
          setTimeout(() => setUploadPercentage(0), 10000);
        },
      });
      //const { fileName, filePath, processImageMessage } = res.data;
      //setUploadedFile({ fileName, filePath });
      //setMessage(`File Uploaded ${processImageMessage}` );
      const {
        fileName,
        filePath,
        processImageMessage,
        processedFileName,
        processedFilePath,
        transferMessage,
      } = res.data;

      setUploadedFile({
        fileName,
        filePath,
        processedFileName,
        processedFilePath,
      });

      setMessage(
        `File Uploaded: ${processedFilePath}... Process: ${processImageMessage}.  Transfer: ${transferMessage}.`
      );

      setFile("");
      setFilename("Choose File");
    } catch (error) {
      if (error.response.status === 500) {
        setMessage("There was a problem with the server");
      } else {
        setMessage(error.response.data.message);
      }
    }
  };

  return (
    <Fragment>
      {message && <Message msg={message} />}
      <form onSubmit={onSubmit}>
        <div class="row">
          <div className="col-sm-4">
            <input
              type="file"
              id="customFile"
              className="custom-file-input"
              onChange={onChange}
            />
            <label htmlFor="customFile" className="custom-file-label">
              {filename}
            </label>
          </div>
          <div className="col-sm-4">
            <input
              type="submit"
              value="Upload"
              className="btn btn-primary btn-block mt-4"
            />
          </div>
        </div>
        <Progress percentage={uploadPercentage} />
      </form>
      {uploadedFile ? (
        <div className="row mt-8">
          <div className="col-md-6 m-auto">
            <h4 className="text-center">{uploadedFile.processedFileName}</h4>
            <img
              style={{ width: "100%" }}
              src={uploadedFile.processedFilePath}
              alt={uploadedFile.processedFileName}
            />
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default FileUpload;


/*


<div className="col-sm-2">
            <label>
              <input
                type="checkbox"
                id="chkProcessFile"
                value="checked"
                label="Do Processing"
                className="btn btn-primary btn-block mt-4"
              />
              Process File
            </label>
          </div>


          */