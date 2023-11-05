import axios from "axios";

const config = {
  header: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:3000",
  },
};

const API_URL = "http://localhost:8080/api";

export const createUser = async (user) => {
  const url = API_URL + "/user";
  return await axios.post(url, user, config);
};

export const loginUser = async (user) => {
  const url = API_URL + "/user/login";
  return await axios.post(url, user, config);
};
