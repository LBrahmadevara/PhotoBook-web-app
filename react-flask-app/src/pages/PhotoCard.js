import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Popover,
} from "@material-ui/core";
import axios from "axios";
import { Icon } from "@blueprintjs/core";
import "./PhotoBook.css";

const PhotoCard = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const Delete_button = () => {
    setAnchorEl(null);
    let body = {
      id: props.categories.id,
    };
    // axios.post("https://robotic-charmer-291501.wl.r.appspot.com/delete", body).then((res) => {
    axios.post("http://localhost:5000/delete", body).then((res) => {
      console.log(res.data);
      if (res.data.response === "success") {
        window.location.reload(true);
      }
    });
  };
  return (
    <Card className="m-3">
      <CardContent>
        <div className="d-flex flex-column justify-content-center">
          <div className="image-url">
            <img
              src={props.categories.url}
              alt="No picture"
              className="img-thumbnail"
            />
          </div>
          <div className="d-flex flex-column align-items-start ml-3 mt-1">
            <div className="d-flex">
              <div>
                <Icon icon="camera" intent="success" />
              </div>
              <div className="card-details ml-2 mt-1 mr-1">
                Photographer: {props.categories.name}
              </div>
            </div>
            <div className="d-flex">
              <div>
                <Icon icon="locate" intent="success" />
              </div>
              <div className="card-details mt-1 ml-2">
                Place: {props.categories.location}
              </div>
            </div>
            <div className="d-flex">
              <div>
                <Icon icon="calendar" intent="success" />
              </div>
              <div className="card-details mt-1 ml-2">
                Date: {props.categories.date}
              </div>
            </div>
            <div className="d-flex">
              <div>
                <Icon icon="tag" intent="success" />
              </div>
              <div className="card-details mt-1 ml-2">
                Label: {props.categories.category}
              </div>
            </div>
          </div>
        </div>
        <CardActions>
          <Link to={`/edit/${props.categories.id}`}>
            <Button>
              <Icon icon="edit" intent="success" className="mr-1" />
              EDIT
            </Button>
          </Link>
          <Button aria-describedby={id} onClick={handleClick} id="delete">
            <Icon icon="trash" intent="danger" className="mr-1" />
            Delete
          </Button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <div className="d-flex flex-column m-3">
              <div>
                <b>Confirm deletion</b>
              </div>
              <div className="mt-1 delete-content">
                Are you sure you want to delete these items?
              </div>
              <div className="delete-content">
                You won't be able to recover them.
              </div>
              <div className="d-flex mt-3 justify-content-around">
                <div>
                  <Button variant="contained" onClick={handleClose}>
                    Cancel
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    className="delete-button"
                    onClick={Delete_button}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </Popover>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default PhotoCard;
