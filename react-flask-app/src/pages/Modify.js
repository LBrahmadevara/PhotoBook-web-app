import React, { useEffect } from "react";
import axios from "axios";
import { Input } from "@material-ui/core";

const Modify = (props) => {
  console.log(typeof props.match.params.id);
  useEffect(() => {
    let body = {
      id: props.match.params.id,
    };
    axios.post("/edit", body).then((res) => console.log(res.data));
  }, []);
  return (
    <div className="d-flex flex-column">
      Edit Information
      <div className="d-flex">
        <div className="mr-1">Photographer:</div>
        <div>
          <Input value="name" />
        </div>
      </div>
      <div className="d-flex">
        <div className="mr-1">Name:</div>
        <div>
          <Input value="name" />
        </div>
      </div>
      <div className="d-flex">
        <div className="mr-1">Place:</div>
        <div>
          <Input value="name" />
        </div>
      </div>
      <div className="d-flex">
        <div className="mr-1">Date:</div>
        <div>
          <Input value="name" />
        </div>
      </div>
      <div className="d-flex">
        <div className="mr-1">Label:</div>
        <div>
          <Input value="name" />
        </div>
      </div>
      <div className="d-flex">
        {/* <div className="mr-1">Place:</div> */}
        <div>
          <input type="file" />
        </div>
      </div>
    </div>
  );
};

export default Modify;
