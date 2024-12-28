import axios from "axios";
import { Diaries, NewDiaries } from "../types";

const baseUrl = 'http://localhost:3000/api/diaries/'

export const getAllDiaries = () => {
  return axios
  .get<Diaries[]>(baseUrl)
  .then(response => response.data)
}

export const createDiaries = (object: NewDiaries) => {
  return axios
  .post<Diaries>(baseUrl, object)
  .then(response => response.data)
}