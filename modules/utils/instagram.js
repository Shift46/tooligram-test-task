const FileCookieStore = require('tough-cookie-filestore2');
const Instagram = require('instagram-web-api');
let request = require('request');
const config = require('./config');

/**
 * Работа с API instagram
 */
const instagram = function() {
    /**
     * Хранилище cookie
     */
    let cookieStore = new FileCookieStore('./cookies.json');

    /**
     * Пройдена ли авторизация в instagram
     * @type {boolean}
     */
    let isAuthorized = false;

    /**
     * Авторизация в instagram
     * @param {String} [proxy] URL прокси сервера
     * @return {Promise<boolean>} Успешно ли пройдена авторизация
     */
    const login = async proxy => {
        let opts = {};

        if(proxy)
            opts.proxy = proxy;

        const client = new Instagram({ username: config.instagram.username, password: config.instagram.password, cookieStore  }, opts);
        let { authenticated }  = await client.login();
        isAuthorized = authenticated;
        return isAuthorized;
    };

    /**
     * Проверка пройдена ли авторизация, если нет, то производиться попытка авторизации
     * @param {String} proxy_url Адрес прокси сервера
     * @return {Promise<boolean>} Успешно ли пройдена авторизация
     */
    const Authorized = async proxy_url =>
        isAuthorized ||
        (await login()) ||
        (await login(proxy_url));

    /**
     * Сбор данных о пользователе
     * @param {String} insta_login ID в instagram
     * @param {String} proxy_url Адрес прокси сервера
     * @return {Promise<String>} Данные пользователя
     */
    const getUser = async ({insta_login, proxy_url}) => {
        return new Promise((resolve, reject) => {
            request.get({
                url: `https://www.instagram.com/${insta_login}/?__a=1`,
                proxy: proxy_url
            }, (error, response, body) => {
                if(!error && response.statusCode === 200){
                    resolve(body);
                }else{
                    reject(error ? error : response.statusCode);
                }
            });
        });
    };

    /**
     * Возвращает данные аккаунта instagram по логину
     * @param proxy_login {String} Логин прокси сервера
     * @param proxy_pass {String} Пароль прокси сервера
     * @param proxy_port {String} Порт прокси сервера
     * @param proxy_host {String} Адрес прокси сервера
     * @param insta_login {String} Логин instagram
     * @return {Promise<String>} Данные аккаунта instagram
     */
    this.getUser = async ({proxy_login, proxy_pass, proxy_port, proxy_host, insta_login}) => {

        //Проще, но формат данных немного отличается
        //return await client.getUserByUsername({ username: insta_login });

        let proxy_url = `http://${proxy_login}:${proxy_pass}@${proxy_host}:${proxy_port}`;

        if(await Authorized(proxy_url)){
            try{
                return await getUser({insta_login, proxy_url});
            }catch(err){
                isAuthorized = false;

                if(await Authorized(proxy_url)){
                    return await getUser({insta_login, proxy_url});
                }else{
                    throw new Error("Попытка входа не удалась, попробуйте позже");
                }
            }
        }else{
            throw new Error("Попытка входа не удалась, попробуйте позже");
        }
    };

    /**
     * Попытка авторизации в instagram при инициализации
     */
    (async function init(){
        request = request.defaults({jar: request.jar(cookieStore)});
        await login();
    })();
};

module.exports = instagram;