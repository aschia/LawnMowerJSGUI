import React from "react";
import "./App.css";
import FileUpload from "./components/FileUpload";

const App = () => {
  return (
    <div className="container mt-12">
      <h4 className="display-4 text-center mb-4">
        <i className="fab fa-react">Mower File Upload App</i>
      </h4>

      <FileUpload />
    </div>
  );
};

export default App;
