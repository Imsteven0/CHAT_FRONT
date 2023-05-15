import axios from "axios";

export async function executeRequest(url, method, data = null, params = null) {
  const options = {
    url: "https://clinica-calderon.cyclic.app" + url,
    method: method,
    headers: {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("token"),
    },
    data: data,
    params: params,
  };

  return axios(options)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        localStorage.removeItem("idRol");
        localStorage.removeItem("token");
        window.location.replace("/login");
      } else {
        return { error: error.message };
      }
    });
}
