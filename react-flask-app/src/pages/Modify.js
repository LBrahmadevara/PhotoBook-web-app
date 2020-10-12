import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Spinner } from "@blueprintjs/core";

const Modify = (props) => {
  let [file, setFile] = useState("");
  let [spin, setSpin] = useState(false);
  let [msg, setMsg] = useState("");
  let [name, setName] = useState("");
  let [loc, setLoc] = useState("");
  let [timeChanged, setTimeChanged] = useState(false);
  let [fileChanged, setFileChanged] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  let [newFile, setNewFile] = useState('');
  let [label, setLabel] = useState("");
  let [render, setRender] = useState('');
  useEffect(() => {
    let body = {
      id: props.match.params.id,
    };
    axios.post("https://robotic-charmer-291501.wl.r.appspot.com/edit", body).then((res) => {
      setFile(res.data.response[0]["url"]);
      setLabel(res.data.response[0]["category"]);
      setName(res.data.response[0]["name"]);
      setLoc(res.data.response[0]["location"]);
      setSelectedDate(res.data.response[0]["date"]);
      console.log(res.data.response[0]["date"]);
    });
  }, [render]);
  const uploadInput = (e) => {
    setNewFile(e.target.files[0]);
    setFileChanged(true);
  };
  const uploadButton = () => {
    setSpin(true);
    let form_data = new FormData();
    form_data.append("id", props.match.params.id);
    if (fileChanged) {
      form_data.append("fileChanged", "true");
      form_data.append('file', newFile);
    } else {
      form_data.append("fileChanged", "false");
      form_data.append('file', file);
    }
    form_data.append("name", name);
    form_data.append("loc", loc);
    form_data.append("label", label);
    if (timeChanged) {
      form_data.append(
        "date",
        new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        }).format(selectedDate)
      );
    } else {
      form_data.append("date", selectedDate);
    }
    console.log(render)
    axios
      .post("https://robotic-charmer-291501.wl.r.appspot.com/upload", form_data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        setSpin(false);
        setMsg("Updated Succesfully");
        setRender('render');
      });
  };
  const labelChanged = (e) => {
    setLabel(e.target.value);
  };
  return (
    <div className="d-flex justify-content-center mt-4">
      <div className="d-flex flex-column mt-2">
        <form className="mt-4 d-flex-column">
          <div className="d-flex">
            <div>
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
                      onChange={(e) => {
                        setSelectedDate(e);
                        setTimeChanged(true);
                      }}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>
              </div>
              <div className="mt-3">
                <InputLabel>Label</InputLabel>
                <Select value={label} onChange={labelChanged}>
                  <MenuItem value="Animal">Animal</MenuItem>
                  <MenuItem value="People">People</MenuItem>
                  <MenuItem value="Flower">Flower</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              </div>
              <div className="mt-4 mr-3">
                <input type="file" onChange={uploadInput} />
              </div>
              {/* <div className="mt-4 ml-4">
                <Button
                  color="primary"
                  variant="contained"
                  onClick={uploadButton}
                >
                  Update
                </Button>
              </div> */}
            </div>
            <div className="m-3 ml-4 pl-4">
              <img src={file} alt="No Image" className="update-image" />
            </div>
          </div>
          <div className="mt-4 ml-4">
                <Button
                  color="primary"
                  variant="contained"
                  onClick={uploadButton}
                >
                  Update
                </Button>
              </div>
        </form>
        <div>
          {spin ? (
            <Spinner intent="success" size="40" className="mt-2" />
          ) : (
            <div className="mt-4 pt-2">{msg}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modify;
