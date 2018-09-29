const redis = require("redis");
const config = require("../utils/config");

/**
 * База данных
 */
const db = function(){
    /**
     * Клиент redis
     */
    let client;

    /**
     * Добавление записи в БД
     * @param {String} key Ключ записи
     * @param {String} value Значение записи
     * @return {*}
     */
    this.add = (key, value) => client.set(key, value, 'EX', config.info_expire);

    /**
     * Получает значение в БД по ключу
     * @param {String} key Ключ записи
     * @return {Promise<String>} Значение записи по ключу. null, если ключ отсутствует в БД
     */
    this.get = async key => {
        return new Promise((resolve, reject) => {
            client.get(key, function(err, reply) {
                if(err)
                    reject(err);
                else
                    resolve(reply);
            });
        });
    };

    /**
     * Подключение к БД
     */
    (function init(){
        client = redis.createClient({
            host: "redis"
        });

        client.on("error", err => {
            console.error(err);
        });
    })();
};

module.exports = db;