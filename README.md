# v2ray-switcher
A simple app to get v2ray servers from a list of subscriptions, and always expose a good one at `4080` as a socks5 proxy.

#### The app is still user development
- The app currently only works in linux-x64 systems

## To use:

 1. Create a `subscription.txt` file at root, and add your subscription links into it (one line each)
 2. Run `npm i && npm start`
 3. A socks5 proxy will be exposed at `4080` once a good connection is established
