import axios from "axios";

export async function executeRequest(url, method, data = null, params = null) {
  const options = {
    url: "http://127.0.0.1:8000" + url,
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
    params: params,
  };

  return axios(options)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      //console.log(error);
    });
}
