import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import "../App.css";
import { Spinner } from "@blueprintjs/core";

const FlakeIdGen = require("flake-idgen");
const intformat = require("biguint-format");
//const id = new FlakeIdGen().next();

const Upload = () => {
  let [file, setFile] = useState("");
  let [msg, setMsg] = useState("");
  let [name, setName] = useState("");
  let [loc, setLoc] = useState("");
  let [spin, setSpin] = useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  //console.log(id);
  const API = () => {
    const id = new FlakeIdGen().next();
    let form_data = new FormData();
    form_data.append("file", file);
    console.log(intformat(id, "dec"));
    form_data.append("id", intformat(id, "dec"));
    form_data.append("name", name);
    form_data.append("loc", loc);
    form_data.append("fileChanged", "true");
    form_data.append("edit", "false");
    form_data.append(
      "date",
      new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(selectedDate)
    );
    // axios
    //   .post("https://robotic-charmer-291501.wl.r.appspot.com/upload", form_data, {
    //     headers: { "Content-Type": "multipart/form-data" },
    //   })
    axios
      .post("http://localhost:5000/upload", form_data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.data.response.length > 0) {
          setSpin(false);
          setMsg("Successfully uploaded");
          setName("");
          setLoc("");
        }
      });
  };
  // console.log(selectedDate.toLocaleDateString());
  const uploadInput = (e) => {
    setFile(e.target.files[0]);
  };
  const uploadButton = () => {
    setSpin(true);
    API();
  };
  return (
    <div className="d-flex justify-content-center mt-4">
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
          <div className="mt-1">
            {/* <TextField
              id="outlined-basic"
              label="Date"
              fullWidth={true}
              variant="outlined"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            /> */}
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justify="flex-start">
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date"
                  label="Date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e)}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
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
        {spin ? (
          <Spinner className="mt-3" size="40" intent="success" />
        ) : (
          <div className="mt-4">{msg}</div>
        )}
      </div>
    </div>
  );
};
export default Upload;
