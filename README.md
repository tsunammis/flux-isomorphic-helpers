flux-isomorphic-helpers
================

Differents helpers to build an isomorphic Web Application with React and Flux.

## Installation

    $ npm install flux-isomorphic-helpers --save

## How to use (with ExpressJS)

To build an isomorphic Web application with React, Flux and Express.JS, I suggest to you to install the [express-state](https://github.com/yahoo/express-state)
module to forward the state from the server side to the client side.

    $ npm install express-state --save

### How retrieve on the client the same context as in the server ?

Server side
```javascript
var express = require('express');
var expressState = require('express-state');
var fluxIsomorphicHelpers = require('./flux-isomorphic-helpers');
var ProfileStore = require('stores/ProfileStore');

// load express etc ...
// var server = express();

// Add the server to the "express-state" module
server.set('state namespace', 'ReactCtx');
expressState.extend(server);

// Create a manager with the stores you want to share with the cient
var storeManager = new fluxIsomorphicHelpers.StoreManager();
storeManager.add(ProfileStore);

server.get('/yourRoute', function(req, res) {

    // Make your business with React !
    // ...

    // Dump the stores context before render the view
    res.expose(storeCollection.dumpContext(), 'Stores');

    res
        .status(200)
        .header("Content-Type", "text/html")
        .render('index');
});

```

Client side
```javascript
// import React, Flux, Stores, Compoenent etc ...
// ...
var fluxIsomorphicHelpers = require('./flux-isomorphic-helpers');
var ProfileStore = require('stores/ProfileStore');
var Profile = require('component/Profile');

// Create a manager with the stores you want to share with the cient
var storeManager = new fluxIsomorphicHelpers.StoreManager();
storeManager.add(ProfileStore);

// express-state push the context inside the "root" variable
// We set the "ReactCtx" key for our context on the server.js file
// To get the root constant on your client, you have to call the state from the response object
// See more details directly on the express-state repository -> [https://github.com/yahoo/express-state](https://github.com/yahoo/express-state)
storeCollection.loadContext(root.ReactCtx.Stores);
React.createElement(Profile());
React.render(component, document.getElementById('root'));

```