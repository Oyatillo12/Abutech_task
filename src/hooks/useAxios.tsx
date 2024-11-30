import axios from "axios";
import { API } from "./useEnv";

export const useAxios = (withAuth = true) => {
  const accessToken = localStorage.getItem('token');

  const instance = axios.create({
    baseURL: API, 
  });

  if (withAuth && accessToken) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  }

  return instance;
};
