import React, { useEffect } from "react";
import axios from "axios";
import { API_URL } from "./config";

function Api() {

  useEffect(() => {
    axios.get(`${API_URL}/products`)
      .then((res: any) => console.log(res.data))
      .catch((err: any) => console.log(err));
  }, []);

  return <h1>Check console</h1>;
}

export default Api;
