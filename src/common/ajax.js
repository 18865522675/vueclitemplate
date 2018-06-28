import axios from 'axios';
import qs from "qs";
class ajax {
  constructor(host) {
    this.methodType = {
      get: "get",
      post: "post"
    };

    this.baseURL = host;

    //axios.defaults.timeout = 0;
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    //允许跨域
    axios.defaults.withCredentials = true;

    //POST传参序列化
    axios.interceptors.request.use(this.requestSuccess, this.requestFail);
    //返回状态判断
    axios.interceptors.response.use(this.responseSuccess, this.responseFail);
  }

  set baseURL(url) {
    axios.defaults.baseURL = url;
  }

  get baseURL() {
    return axios.defaults.baseURL === "/" || !axios.defaults.baseURL ? `${window.location.protocol}//${window.location.host}` : axios.defaults.baseURL;
  }

  requestSuccess = config => {
//  console.log(config)
    config.baseUrl="localhost:8080/api/v1"
    let data = config.method === "get" ? config.params : config.data;
    if (data === undefined || data === null) return config;

    if (typeof data !== "object" || (config.method === "post" && data instanceof Array)) {
      data = config.method === "get" ? { id: data } : { "": data };
    }
    if (config.method === "get")
      config.params = data;
    else
      config.data = JSON.stringify(data);
    

//  console.log(config)
    return config;
  }

  requestFail = error => Promise.reject(error);

  responseSuccess = res => res.data;

  responseFail = (xhr, config) => {
    if (xhr.response && xhr.response.status === 401) {
      window.location.href = "/";
    }
    Promise.reject(xhr.message || "");
  };

  http = options => {
    const url = options.url;
    const type = options.type;
    const data = options.data;
    const dataType = options.dataType || "json";
//  const contentType = options.contentType;
		const contentType = options.contentType;
    const xhr = options.xhr;
    // console.log(contentType)
    const async=options.async;
    const axiosOption = {};
    url && (axiosOption.url = url);
    type && (axiosOption.method = type);
    data && (type === this.methodType.get ? (axiosOption.params = data) : (axiosOption.data = data));
    dataType && (axiosOption.responseType = dataType);
    xhr && (axiosOption.onUploadProgress = xhr);
    contentType && (axiosOption.headers = {
      "Accept": "*/*;",
      "Content-Type": `${contentType.replace(new RegExp(";+$"), "")};charset=utf-8`
    });
    // console.log(899898)
    return axios(axiosOption);
  }

  xmlHttp = (option) => {
    option.async = ~option.async === -2;
    option.url = option.url.startsWith("http") ? option.url : this.baseURL + option.url;
    if (option.type === this.methodType.get) {
      if (option.data) {
        option.url += "?" + qs.stringify(option.data);
        option.data = null;
      }
    } else if (!(option.data instanceof FormData)) {
      //option.data = qs.stringify(option.data);
      option.data = JSON.stringify(option.data);
    }

    const xhr = new XMLHttpRequest();
    // !option.async && (xhr.timeout = 0);
    // if(!option.async){
    //   xhr.timeout = 0;
    // }
    xhr.open(option.type, option.url, option.async);
    xhr.withCredentials = true;
    xhr.setRequestHeader("Accept", "*");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    option.contentType && xhr.setRequestHeader("Content-Type", option.contentType);
    //xhr.responseType = option.dataType;
    xhr.onload = () => {
      if (xhr.status === 200) {
        option.success && option.success(JSON.parse(xhr.response));
      } else if (xhr.status === 401) {
        window.location.href = "/";
      } else {
        option.error && option.error(...[xhr.response.ExceptionMessage, xhr.response.Message]);
      }
    }
    xhr.send(option.data);
  }

  /**
   * httpGet请求
   * @param {String} 请求地址，若不带http则使用默认地址
   * @param {Object} 请求参数，一个对象，若非对象则默认转成{id：data}
   * @returns {AxiosPromise}
   */
  get = (url, data) => this.http({
    url: url,
    type: this.methodType.get,
    data: data,
    dataType: "json",
    contentType: "application/x-www-form-urlencoded",
    async:true
  });

  /**
   * httpPost请求
   * @param {String} 请求地址，若不带http则使用默认地址
   * @param {Object} 请求参数，一个对象，若非对象则默认转成{""：data}
   * @returns {AxiosPromise}
   */
  post = (url, data) => this.http({
    url: url,
    type: this.methodType.post,
    data: data,
    dataType: "json",
    contentType: "application/json"
  });

  /**
   * httpPost请求上传文件
   * @param {String} 请求地址，若不带http则使用默认地址
   * @param {File} 请求参数，文件对象，使用FormData上传key="file",value=file
   * @returns {AxiosPromise}
   */
  postFile = (url, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return this.post(url, formData);
  };

  /**
   * httpPost请求上传文件
   * @param {String} 请求地址，若不带http则使用默认地址
   * @param {Dom} 请求参数Form表单Dom对象 
   * @returns {AxiosPromise}
   */
  postForm = (url, form) => this.post(url, new FormData(form));

  /**
   * http请求组，可以当做同步请求
   * @param {AxiosPromise} 参数1，可传入httpGet,httpPost,httpPostFile,httpPostForm
   * @param {Array} 与参数1相同，ES6不能直接使用params参数,所以使用扩展运算符调用
   * @returns {AxiosPromise}
   */
  httpAll = (option, ...options) => axios.all((Array.isArray(option) ? option : [option]).concat(options));

  getSync = (url, param, success, error) => this.xmlHttp({
    url: url,
    type: this.methodType.get,
    data: param,
    async: false,
    dataType: "json",
    contentType: "application/x-www-form-urlencoded",
    success: success,
    error: error
  });

  postSync = (url, data, success, error) => this.xmlHttp({
    url: url,
    type: this.methodType.post,
    data: data,
    async: false,
    dataType: "json",
    contentType: "application/json",
    success: success,
    error: error
  });
}

export default ajax;
