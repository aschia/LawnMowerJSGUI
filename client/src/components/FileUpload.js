import React, { Fragment, useState } from "react";
import Message from "./Message";
import Progress from "./Progress";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose File");
  const [uploadedFile, setUploadedFile] = useState({});
  const [sentFileToLawnmower, setSentFileToLawnmower] = useState({});
  const [message, setMessage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);

   // the Black and White Threshold
   const [bwThreshold, setBwThreshold] = useState(100);

   // This function is called when the first range slider changes
   const changeBwThreshold = (event) => {
    setBwThreshold(event.target.value);
   };

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  // TODO: Make sure the imege is refreshed on client
  const onUpdateThresholdClick = async (e) => {
    e.preventDefault();
    debugger;
    const formData = new FormData();
    formData.append("fileName", uploadedFile.fileName);
    formData.append("processedFileName", uploadedFile.processedFileName);

    formData.append("bwThreshold", bwThreshold);

    // if we have a filename

    if(uploadedFile.processedFileName == undefined || uploadedFile.processedFileName == null) {
      setMessage("There is no processedFileName.");
    }
    else {
      try {
        const res = await axios.post("/processFile", formData, {
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

        // TODO: Force file to refresh on the client
        
        setMessage(
          `File Processed: ${processImageMessage}. ${processedFileName}`
        );

        //setFile("");
        //setFilename("Choose File");
      } catch (error) {
        if (error.response.status === 500) {
          setMessage("There was a problem with the server");
        } else {
          setMessage(error.response.data.message);
        }
      }
    }
  };
  
  // TODO: Hide Threshold Slider and Update Threshold button
  const onSendToLawnmowerClick = async (e) => {
    e.preventDefault();
    debugger;
    const formData = new FormData();
    formData.append("processedFileName", uploadedFile.processedFileName);
    formData.append("processedFilePath", uploadedFile.processedFilePath);

    // if we have a filename

    if(uploadedFile.processedFileName == undefined || uploadedFile.processedFileName == null) {
      setMessage("There is no processedFileName.");
    }
    else {
      try {
        const res = await axios.post("/sendFile", formData, {
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
          transferMessage
        } = res.data;
/*
        setSentFileToLawnmower({
          fileName,
          filePath,
          processedFileName,
          processedFilePath,
        });
*/
        setMessage(
          `File Transfer: ${transferMessage}.`
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
  }
  };

  // TODO: After upload we can show the  Threshold slider, Update Threshold Button, and Send to Lawnmower buttons
  const onUploadClick = async (e) => {
    e.preventDefault();
    // debugger;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bwThreshold", bwThreshold);
    // if we have a filename
    if(filename && filename!==null) {
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
          `File Upload: ${processedFilePath}\nFile Processed: ${processImageMessage}\nFile Transfer: ${transferMessage}.`
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
  }
};

  return (
    <Fragment>
      {message && <Message msg={message} />}
      <form >
        <div class="row">
          <div className="col-sm-6">
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
         
          <div className="col-sm-6">
            <input
              type="submit"
              value="Upload"
              onClick={onUploadClick}
              className="btn btn-primary btn-block btn-custom"
            />
          </div>

        </div>
        <div class="row">
          <div className="col-sm-12 mt-4" >
            <Progress percentage={uploadPercentage} />
          </div>
        </div>

      </form>
      {uploadedFile ? (
        <div className="row mt-8">
          <div className="col-md-6 m-auto">
            {uploadedFile.processedFileName ?  (
              <h4 className="text-center">File Uploaded</h4>
              ) : null}
            <img
              style={{ width: "100%" }}
              src={uploadedFile.processedFilePath + `?t=${Date.now()}`}
              alt={uploadedFile.processedFileName}
            />
            <br/>
            <p>{bwThreshold}</p>
          <div className="col-sm-4">
                  <input
                      type='range'
                      onChange={changeBwThreshold}
                      min={1}
                      max={255}
                      step={10}
                      value={bwThreshold}
                      className='custom-slider'>
                  </input>
          </div>
          <div className="col-sm-6">
            <input
              type="submit"
              value="Update Threshold" 
              onClick={onUpdateThresholdClick}
              className="btn btn-primary btn-block btn-custom"
            />
          </div>
          <div className="col-sm-6">
            <input
              type="submit"
              value="Send To Lawnmower" 
              onClick={onSendToLawnmowerClick}
              className="btn btn-primary btn-block btn-custom"
            />
          </div>
          </div>
        </div>
      ) : 
      (
        <div class="row">
        <div className="col-sm-12 mt-4" ></div>
          <div className="col-sm-12 mt-4" ></div>
        </div>
      )
      }
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