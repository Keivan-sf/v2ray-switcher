# v2ray-switcher

A simple app automatically switch between v2ray servers and always expose a reliable socks5 proxy


## To use:

Clone the repository `git clone https://github.com/Keivan-sf/v2ray-switcher.git`

1.  Run `npm i && npm run dev:prepare`
2.  configure your `config.json` file located at `./src` like below

```js
{
    "subscription_urls": [
	    "https://yoursubscription-url.example"
    ],
    "servers": [
        "vmess://example_config_uri"
    ]
}
```

3.  Run `npm start`

A socks5 proxy will be exposed at `4080` once a good connection is established

## Setup password for socks5 proxy

In order to have authentication for your proxy, you can add the following properties to your `config.json`:
```js
{
    // ...rest of the config
    "auth": {
        "username": "user",
        "password": "pw"
    }
}
```


> Note that you must set both or neither

## Supported formats

-   Vmess
-   Vless
