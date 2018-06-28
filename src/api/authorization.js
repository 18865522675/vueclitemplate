let $;
export default class auth {
    constructor(ajax) {
        $ = ajax;
    }

    /**
     * 根据siteCode获取配置信息
     * @param {String} siteCode
     */
    Setup = (params) => $.get("/Authorization/Setup", params);

    /**
     * 登录接口
     * @param {Object} 登录对象，包含用户名，密码，函授站点
     */
    Login = (params) => $.post("Authorization/Login", params);
}