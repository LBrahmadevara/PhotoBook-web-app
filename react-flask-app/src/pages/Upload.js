import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import axios from "axios";

const Upload = () => {
//   let [file, setFile] = useState("");

  //   axios.get("/time").then((res) => console.log(res.data.time));

//     const API = () => {
//       let form_data = new FormData();
//       console.log(file);
//       form_data.append("file", file);
//       for (var key of form_data.entries()) {
//           console.log(key[0] + ', ' + key[1]);
//       }
//       axios
//         .post("http://localhost:5000/upload", form_data, {
//           headers: { "Content-Type": "multipart/form-data" },
//         })
//         .then((res) => console.log(res.data));
//     };

//   const uploadInput = (e) => {
//     // console.log(e.target.files[0].name);
//     setFile(e.target.files[0]);
//   };
//   const uploadButton = () => {
//     // console.log(file);
//     API();
//   };
  return (
    <div className="d-flex justify-content-center mt-4">
      <form method="POST" action="/upload" encType="multipart/form-data">
        <input type="file" name="file" className="mt-4" />
        {/* <input type="submit" className="mt-4 ml-4" /> */}
        <Button
            color="primary"
            variant="contained"
            type="submit"
          >
            Upload
          </Button>
      </form>

      {/* <form>
        <div className="mt-4 mr-3">
          <input type="file" onChange={uploadInput} />
        </div>
        <div className="mt-4 ml-4">
          <Button
            color="primary"
            variant="contained"
            onClick={uploadButton}
            type="submit"
          >
            Upload
          </Button>
        </div>
      </form> */}
    </div>
  );
};
export default Upload;
