import axios from "axios";

const axiosCli = axios.create({
  baseURL: "/api",
});

// 不开启这个默认是不携带cookie发带服务端的
axiosCli.defaults.withCredentials = true;

// 还可以定义拦截器
// axiosCli.interceptors.request.use(); // 请求拦截器
// axiosCli.interceptors.response.use(); // 响应拦截器

export default axiosCli;
