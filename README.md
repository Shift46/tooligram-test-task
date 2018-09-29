Запуск сервера `docker-compose up -d`

Файл конфигурации `/modules/utils/config.js`

# Входные данные

Запрос для получения данных instagram выглядит следующим образом
`http://localhost:3000/instagram/get?insta_login=insta_login&proxy_login=proxy_login&proxy_pass=proxy_pass&proxy_port=proxy_port&proxy_host=proxy_host`, 
где

`insta_login` - Логин в instagram

`proxy_login` - Логин прокси сервера

`proxy_pass` - Пароль прокси сервера

`proxy_port` - Порт прокси сервера

`proxy_host` - IP адрес прокси сервера

Опционально, можно указать параметр `force`, чтобы обновить данные аккаунта принудительно.

Данные аккаунта сохраняются на 6 часов.

Если указан только параметр `insta_login` без прокси (`proxy_login`, `proxy_pass`, `proxy_port`, `proxy_host`), то данные берутся только из базы данных. При этом параметр `force` игнорируется.

Примеры запросов к серверу

`http://localhost:3000/instagram/get?insta_login=instatestacc22&proxy_login=a&proxy_pass=a&proxy_port=8080&proxy_host=95.87.255.120`

`http://localhost:3000/instagram/get?insta_login=instatestacc22&proxy_login=a&proxy_pass=a&proxy_port=8080&proxy_host=95.87.255.120&force=1`

`http://localhost:3000/instagram/get?insta_login=instatestacc22`

# Выходные данные

Возвращается JSON объект.

Удачный запрос:

```
{
    success: true,
    data: ... // Данные из instagram
}
```

Запрос с ошибкой


```
{
    success: false,
    error: "Текст ошибки"
}
```