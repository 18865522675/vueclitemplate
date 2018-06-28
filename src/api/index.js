import ajax from "../common/ajax";
let $ = new ajax("/"),
    globalConfig,
    apis;

$.getSync("/static/global.json", null, res => {
    const json = JSON.parse(JSON.stringify(res));
    $.baseURL = json.apiServer;
    globalConfig = json;
});

const api = {
    global: globalConfig
        // httpGet: $.get,
        // httpPost: $.post,
};
/**
 * @returns {String} api访问地址
 */
api.host = () => $.baseURL.replace(/api\/+$/, "");
//console.log( $.baseURL)

//身份授权接口
import auth from "./authorization";
api.auth = new auth($);

//基本信息接口
import baseConfig from "./baseConfig";
api.baseConfig = new baseConfig($);

//招生模块接口
import recruitStudent from "./recruitStudent";
api.recruitStudent = new recruitStudent($);

// 论文模块接口
import thesis from "./thesis";
api.thesis = new thesis($);


import commonData from "./commonData";
api.commonData = new commonData($);

// 学校管理
import schoolManager from "./schoolManager";
api.schoolManager = new schoolManager($);

// 教学管理
import teachingManager from "./teachingManager";
api.teachingManager = new teachingManager($);

// 系统管理
import system from "./system";
api.system = new system($);

import Student from "./Student";
api.Student = new Student($);

import ExamManager from "./ExamManager";
api.ExamManager = new ExamManager($);



export default api;