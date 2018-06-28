import qs from "qs";
class ajax {
    constructor(host) {
        this.methodType = {
            get: "get",
            post: "post"
        };
        this.baseURL = host;
    }

    xmlHttp(option) {
        option.async = ~option.async === -2;
        option.url = option.url.startsWith("http") ? option.url : this.baseURL + option.url;
        // if (option.type === this.methodType.get) {
        //     if (option.data) {
        //         option.url += "?" + qs.stringify(option.data);
        //         option.data = null;
        //     }
        // } else if (!(option.data instanceof FormData)) {
        //     //option.data = qs.stringify(option.data);
        //     option.data = JSON.stringify(option.data);
        // }

        if (option.data) {
                    // option.url += "?" + qs.stringify(option.data);
                    option.data = JSON.stringify(option.data)
                }

        
		
        const xhr = new XMLHttpRequest();
        !option.async && (xhr.timeout = 0);
        xhr.open(option.type, option.url, option.async);
        xhr.withCredentials = true;
        xhr.setRequestHeader("Accept", "*");
        xhr.setRequestHeader("Cache-Control", "no-cache");
        option.contentType && xhr.setRequestHeader("Content-Type", option.contentType);
        //xhr.responseType = option.dataType;
        xhr.onload = () => {
            if (xhr.status === 200) {
                if(option.restype==1){
                	option.success && option.success(xhr.response);
                	return ;
                }
                option.success && option.success(JSON.parse(xhr.response));
            } else {
                option.error && option.error(...[xhr.response.ExceptionMessage, xhr.response.Message]);
            }
        }
        xhr.send(option.data);
    }

    get(url, param, success, error) {
        this.xmlHttp({
            url: url,
            type: this.methodType.get,
            data: param,
            async: true,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded",
            success: success,
            error: error,
            
        });
    }

    post(url, data, restype,success, error) {
        this.xmlHttp({
            url: url,
            type: this.methodType.post,
            data: data,
            restype:restype,
            async: true,
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            success: success,
            error: error
        });
    }

    postFile(url, file, success, error) {
        const formData = new FormData();
        formData.append("file", file);
        this.post(url, formData, success, error);
    };

    uploadFile(url, fileId, callBack) {
        var formData = new FormData();
        formData.append("file", document.getElementById(fileId).files[0]);
        this.post1(url, formData, callBack)

    }
    
    postData(url, data, callBack) {
        var formData = new FormData();
        formData.append("data", JSON.stringify(data));
        this.post1(url, formData, callBack)

    }

    post1(url, data, fn) {
        var that=this;
        var obj = new XMLHttpRequest();
        obj.open("POST", url.substring(0, 7) == 'http://' ? url : 'http://test.xueli.cc:81/api/' + url, true);
        //  obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // 发送信息至服务器时内容编码类型
        obj.onreadystatechange = function () {
            if (obj.readyState == 4 && obj.status == 200) {  // 304未修改
                that.httpResult(obj.responseText, fn);
            }
        };
        obj.send(data);
    }

//	host() {
//      var result = "http://";
//      if (window.location.host.indexOf("localhost") > -1)
//          result += "test.xueli.cc:81";
//      else
//          result += window.location.host;
//
//      result += /api/;
//      return result;
//  }
	
    httpResult(text, callBack) {
       
        var data = null;
        try {
            data = JSON.parse(text);
        } catch (e) {

        }
        if (!data)
            data = text;
        //断线超时

        if (data.code == 2) {
//          toast(data.msg);

            //  localStorage.setItem("systemMsg", data.msg);
//         return window.location.href = "/";
        }
        if (data.msg) {
            if (data.code > 0) {
//              console.log("服务端返回错误:", data.code, ",信息:", data.msg);
//              toast(data.msg);
                return;
            }
            else {
                //  if (callBack != undefined)
                //       localStorage.setItem("systemMsg", data.msg);
                //   else
//              toast(data.msg);
            }
        }

        if (callBack != undefined)
            callBack.call(this, data);
    }
    

    postForm(url, form, success, error) {
        this.post(url, new FormData(form), success, error);
    }
}

export default ajax;
