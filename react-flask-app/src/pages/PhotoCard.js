import React,{useState,useEffect} from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@material-ui/core";
import { Icon } from "@blueprintjs/core";
import "./PhotoBook.css";

const PhotoCard = (props) => {
  let [categories, setCategories] = useState({});
  let [loadingState, setLoadingState] = useState(false);
  useEffect(() => {
    setCategories(props.category);
    setLoadingState(true);
  },[])

  return (
    <Card className="m-3">
      {loadingState ?
      <CardContent>
        <div className="d-flex flex-column justify-content-center">
          <div className='image-url'>
            <img src={categories.url} alt="No-Image" className="img-thumbnail" />
          </div>
          <div className="d-flex flex-column align-items-start ml-3 mt-1">
            <div className="d-flex">
              <div>
                <Icon icon="camera" intent="success" />
              </div>
              <div className="card-details ml-2 mt-1">Photographer: {categories.name}</div>
            </div>
            <div className="d-flex">
              <div>
                <Icon icon="locate" intent="success" />
              </div>
              <div className="card-details ml-2">Place: {categories.location}</div>
            </div>
            <div className="d-flex">
              <div>
                <Icon icon="calendar" intent="success" />
              </div>
              <div className="card-details ml-2">Date: {categories.date}</div>
            </div>
            <div className="d-flex">
              <div>
                <Icon icon="tag" intent="success" />
              </div>
              <div className="card-details ml-2">Label: {categories.category}</div>
            </div>
          </div>
        </div>
        <CardActions>
          <Button>Edit</Button>
        </CardActions>
      </CardContent> : <p></p>}
    </Card>
  );
};

export default PhotoCard;
