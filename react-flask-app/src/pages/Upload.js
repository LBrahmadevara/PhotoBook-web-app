import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";
import axios from "axios";

const Upload = () => {
  let [file, setFile] = useState("");
  let [msg, setMsg] = useState("");
  let [name, setName] = useState("");
  let [loc, setLoc] = useState("");
  let [date, setDate] = useState("");

  // const Bu = () => {
  //   // axios.get("/time").then((res) => console.log(res.data.time));
  //   let body={
  //     'x': 'x'
  //   }
  //   axios.post('/time', body)
  //   .then(res => console.log(res.data))
  // }

  const API = () => {
    let form_data = new FormData();
    form_data.append("file", file);
    form_data.append("name", name);
    form_data.append("loc", loc);
    form_data.append("date", date);
    axios
      .post("/upload", form_data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.response.length > 0) {
          setMsg("Successfully uploaded");
          setName("");
          setLoc("");
          setDate("");
        }
      });
  };

  const uploadInput = (e) => {
    setFile(e.target.files[0]);
  };
  const uploadButton = () => {
    API();
  };
  return (
    <div className="d-flex justify-content-center mt-4">
      {/* <form method="POST" action="/upload" encType="multipart/form-data">
        <input type="file" name="file" className="mt-4" /> */}
      {/* <input type="submit" className="mt-4 ml-4" /> */}
      {/* <Button
            color="primary"
            variant="contained"
            type="submit"
          >
            Upload
          </Button>
      </form> */}
      <div className="d-flex flex-column">
        <form className="mt-4">
          <div className="mt-3">
            <TextField
              id="outlined-basic"
              label="Name of the Photographer"
              fullWidth={true}
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <TextField
              id="outlined-basic"
              label="Location"
              fullWidth={true}
              variant="outlined"
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <TextField
              id="outlined-basic"
              label="Date"
              fullWidth={true}
              variant="outlined"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="mt-4 mr-3">
            <input type="file" onChange={uploadInput} />
          </div>
          <div className="mt-4 ml-4">
            <Button color="primary" variant="contained" onClick={uploadButton}>
              Upload
            </Button>
            {/* <Button onClick={Bu}>Time</Button> */}
          </div>
        </form>
        <div className="mt-4">{msg}</div>
      </div>
    </div>
  );
};
export default Upload;
