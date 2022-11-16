# Challenge

## Repo
https://github.com/impxd/vue-coffe

## Main Technologies

- Vue.js (A Progressive JavaScript Framework for building UI)
- RxJS (A reactive programming library for JavaScript)

## Development enviroment

- Node.js (tested on v14.3.0)
- NPM (7.6.3)
- Vue CLI
- ESLint (lint on save)
- Prettier (auto format on save)

## General building process

- Resolve how to fetch de data with the Socket.io client and understand the Order events data flow
- Model all the Order Events data flow in a reactive way with RxJS for receive the Order events (Orders Service)
- Make some basic HTML
- Add the Refresh Rate (so the User have time to browse) and Filter (thinking on a usefull and easy way to navigate) features to the Orders service
- Think about performance. I thought about using a Web Worker as a background thread for improve the performance, but just because is a large amount of data that needs to be transferred it might be not worth it, so I just did some html/css changes that might be good.

## Folder structure

- `server`: Server with dto-dataset (I just added CORS support)
- `webclient`: The Front-end app
- `webclient/src`
  - `assets/styles:` Includes the utils.css file with common classes
  - `common:` JS files that contain most of the logic
  - `common/core.js:` Core main funcions thhat deal with the Orders
  - `common/utils.js:` Utility functions for Arrays, format strings and Dates
  - `common/types.js:` Naming conventions for the Order entity
  - `common/operators.rx.js:` Some RxJS utility operators
  - `common/services/index.js:` Services entry point that boots them
  - `common/services/orders.js:` The main file that manage the connection to the socket for Order Events and provides all the logic and data for the web client
  - `views/shell.vue:` The entry view for the SPA Shell model, it contains the header, nav, and refresh rate controller
  - `views/home.vue:` The view with the search bar and the data table
  - `tests/unit`: Core Unit tests

### See server README
### See webclient README
