import React, { useState, useEffect } from "react";
import axios from "axios";
import PhotoCard from "./PhotoCard";

const PhotoBookTemplate = (props) => {
  return (
    <div className="container">
      <div className="row">
        {props.categories.map((value, index) => (
          <div className="col" key={index}>
            <PhotoCard categories={value} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoBookTemplate;
