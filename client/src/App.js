import React from "react";
import "./App.css";
import FileUpload from "./components/FileUpload";

const App = () => {
  const backgroundImage = require('./pexels-matthew-montrone-1374295.jpg');
  const styles = {
    container: {
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh'
    }
};
  return (

    <div className="container mt-12 " style={styles.container}>
      <h4 className="display-4 text-center mb-4 title">
        Mower File Upload App
      </h4>

      <FileUpload />
    </div>
  );
};

export default App;
