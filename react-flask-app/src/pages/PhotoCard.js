import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
} from "@material-ui/core";
import { Icon } from "@blueprintjs/core";
import { Link } from "react-router-dom";
import "./PhotoBook.css";

const PhotoCard = (props) => {
  return (
    <Card className="m-3">
      <CardContent>
        <div className="d-flex flex-column justify-content-center">
          <div className="image-url">
            <img
              src={props.categories.url}
              alt="No-Image"
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
              <div className="card-details ml-2">
                Place: {props.categories.location}
              </div>
            </div>
            <div className="d-flex">
              <div>
                <Icon icon="calendar" intent="success" />
              </div>
              <div className="card-details ml-2">
                Date: {props.categories.date}
              </div>
            </div>
            <div className="d-flex">
              <div>
                <Icon icon="tag" intent="success" />
              </div>
              <div className="card-details ml-2">
                Label: {props.categories.category}
              </div>
            </div>
          </div>
        </div>
        <CardActions>
          <Link to={`/edit/${props.categories.id}`}>
            <Button>Edit</Button>
          </Link>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default PhotoCard;
