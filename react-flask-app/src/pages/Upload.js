import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import axios from "axios";

const Upload = () => {
  let [file_nm, setFile_nm] = useState("");

  //   axios.get("/time").then((res) => console.log(res.data.time));

  const API = () => {
    let body = {
      name: file_nm,
    };
    axios.post("/demo", body).then((res) => console.log(res.data));
  };

  const uploadInput = (e) => {
    // console.log(e.target.files[0].name);
    setFile_nm(e.target.files[0].name);
  };
  const uploadButton = () => {
    console.log(file_nm);
    API();
  };
  return (
    <div className="d-flex justify-content-center mt-4">
      <div className="mt-4 mr-3">
        <input type="file" onChange={uploadInput} />
      </div>
      <div className="mt-4 ml-4">
        <Button color="primary" variant="contained" onClick={uploadButton}>
          Upload
        </Button>
      </div>
    </div>
  );
};
export default Upload;
