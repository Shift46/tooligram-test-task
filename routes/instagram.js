const express = require('express');
const router = express.Router();
const instagram = new (require('../modules/utils/instagram'))();
const db = new (require("../modules/models/instagram"))();

router.get('/get', async (req, res) => {
    let proxy_login = req.query.proxy_login;
    let proxy_pass = req.query.proxy_pass;
    let proxy_port = req.query.proxy_port;
    let proxy_host = req.query.proxy_host;
    let insta_login = req.query.insta_login;
    let force = req.query.force;

    if(insta_login){
        insta_login = insta_login.trim();

        try{
            let data;

            if(proxy_login && proxy_pass && proxy_port && proxy_host){
                if(force){
                    data = await instagram.getUser({
                        proxy_login,
                        proxy_pass,
                        proxy_port,
                        proxy_host,
                        insta_login});

                    db.add(insta_login, data);
                }else{
                    data = await db.get(insta_login);

                    if(data === null){
                        data = await instagram.getUser({
                            proxy_login,
                            proxy_pass,
                            proxy_port,
                            proxy_host,
                            insta_login});

                        db.add(insta_login, data);
                    }
                }
            }else{
                data = await db.get(insta_login);

                if(data === null){
                    throw new Error("ID отсутствует в базе данных");
                }
            }

            res.send({
                success: true,
                data: JSON.parse(data)
            });
        }catch(err){
            res.send({
                success: false,
                error: err.toString()
            });
        }
    }else{
        res.send({
            success: false,
            error: "Какой-то из параметров отсутствует"
        });
    }
});

module.exports = router;
