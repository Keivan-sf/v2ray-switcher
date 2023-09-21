# v2ray-switcher

A simple app to get v2ray servers from a list of subscriptions, and always expose a good one at `4080` as a socks5 proxy.

#### The app currently only works in linux-x64 systems

## To use:

1.  Run `npm i && npm run build`
2.  Add your subscription links into `subscriptions.txt` (one line each)
3.  Run `npm start`

A socks5 proxy will be exposed at `4080` once a good connection is established

## Supported formats

-   Vmess
-   Vless
