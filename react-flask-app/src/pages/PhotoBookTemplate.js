import React from "react";
import PhotoCard from "./PhotoCard";

const PhotoBookTemplate = (props) => {
  return (
    <div className="container">
      <div className="row justify-content-start">
        {props.categories.map((value, index) => (
          <div className="col-4" key={index}>
            <PhotoCard categories={value} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoBookTemplate;
