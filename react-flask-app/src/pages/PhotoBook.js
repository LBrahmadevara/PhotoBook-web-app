import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@material-ui/core";
import "./PhotoBook.css";
import PhotoBookTemplate from "./PhotoBookTemplate";
import { NonIdealState, Spinner } from "@blueprintjs/core";

const PhotoBook = () => {
  let [categories, setCategories] = useState([]);
  let [loadingState, setLoadingState] = useState(false);
  let [emptyCheck, setEmptyCheck] = useState("");
  useEffect(() => {
    fetch_api();
  }, []);

  const fetch_api = async () => {
    await axios.get("/all").then((res) => {
      setCategories(res.data.response);
      setLoadingState(true);
    });
  };

  const all_API = (e) => {
    fetch_api();
  };

  const API_call = (e) => {
    const body = {
      label: e.currentTarget.value,
    };
    axios.post("/labels", body).then((res) => {
      setCategories(res.data.response);
      if (res.data.response.length === 0) {
        setEmptyCheck("empty");
      } else {
        setEmptyCheck("not empty");
      }
    });
  };
  return (
    <div className="d-flex">
      <div className="d-flex flex-column align-items-start m-3">
        <div className="mb-3 mt-3">
          <b>Categories</b>
        </div>
        <div>
          <Button value="all" onClick={all_API} className="category-button">
            All
          </Button>
        </div>
        <div>
          <Button value="Animal" onClick={API_call} className="category-button">
            Animals
          </Button>
        </div>
        <div>
          <Button value="Human" onClick={API_call} className="category-button">
            Humans
          </Button>
        </div>
        <div>
          <Button value="Flower" onClick={API_call} className="category-button">
            Flowers
          </Button>
        </div>
        <div>
          <Button value="Others" onClick={API_call} className="category-button">
            Others
          </Button>
        </div>
      </div>
      <div className="m-3 photo-book">
        {emptyCheck === "empty" ? (
          <div className="m-4 p-4">
            {" "}
            <NonIdealState icon="clean" title="No photos found.." />{" "}
          </div>
        ) : loadingState ? (
          <PhotoBookTemplate categories={categories} />
        ) : (
          <div className="d-flex justify-content-center m-4 p-4 spinner-head">
            <Spinner intent="success" />
          </div>
        )}
      </div>
    </div>
  );
};
export default PhotoBook;
