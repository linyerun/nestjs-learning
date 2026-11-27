import axios from "axios";

axios.defaults.baseURL = "/api";

export interface User {
  id: number;
  name: string;
  desc: string;
}

export interface SearchUserOptions {
  keyword: string;
  page: number;
  pageSize: number;
}

export const addUser = (data: Partial<User>) =>
  axios.post("/user", data).then((res) => res.data);

export const getList = (data: Partial<SearchUserOptions>) =>
  axios.get("/user", { params: data }).then((res) => res.data);

export const delUser = (id: number) =>
  axios.delete(`/user/${id}`).then((res) => res.data);

export const updateUser = (data: Partial<User>) =>
  axios.patch(`/user/${data.id}`, data).then((res) => res.data);

export const addTags = (id: number, tags: string[]) =>
  axios.post(`/user/${id}/tags`, tags).then((res) => res.data);
