import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@material-ui/core";
import "./PhotoBook.css";
import PhotoBookTemplate from "./PhotoBookTemplate";

const PhotoBook = () => {
  let [categories, setCategories] = useState([]);
  let [loadingState, setLoadingState] = useState(false);
  useEffect(() => {
    fetch_api();
  }, []);

  const fetch_api = async () => {
    await axios.get("/all").then((res) => {
      setCategories(res.data.response);
      console.log(res.data.response)
      setLoadingState(true);
    });
  };

  const all_API = (e) => {
    // fetch_api();
    console.log(e.currentTarget.value)
  };

  // const API_call = (e) => {
  //   console.log(e.currentTarget.value)
  //   const body = {
  //     label: e.currentTarget.value
  //   }
  //   axios.post('/labels', body)
  //   .then(res => console.log(res))
  // }
  return (
    <div className="d-flex">
      <div className="d-flex flex-column align-items-start m-3">
        <div className="mb-3 mt-3">
          <b>Categories</b>
        </div>
        <div>
          <Button value="all" onClick={all_API}>All</Button>
        </div>
        <div>
          <Button value="animal">Animals</Button>
        </div>
        <div>
          <Button>Human</Button>
        </div>
        <div>
          <Button>Flowers</Button>
        </div>
        <div>
          <Button>Others</Button>
        </div>
      </div>
      <div className="m-3">
        {loadingState ? 
        <PhotoBookTemplate categories={categories} /> : <p>Loading..</p>}
      </div>
    </div>
  );
};
export default PhotoBook;
