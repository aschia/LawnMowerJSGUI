import React from "react";
import "./App.css";
import FileUpload from "./components/FileUpload";

const App = () => {
  return (
    <div className="container mt-12 custom-background">
      <h4 className="display-4 text-center mb-4 title">
        Mower File Upload App
      </h4>

      <FileUpload />
    </div>
  );
};

export default App;
