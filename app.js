//Commenting here just as I'm learning and so others can follow what's
//  going on.
//  dotenv seems to be the nodejs standard for doing this, so the file
//  is a .env file. Do this first so .env file variables are loaded
//This loads a local env file containing things like API cert keys to
//  the Riot API.  This allows the code to use the API key without having
//  to check in the key to GitHub, which is a security risk.  You may
//  have to create this file locally.
require('dotenv').config();

//Express is the web server that runs on nodejs.  it serves both the
//  angular front end as well as the api that angular calls.  That api
//  makes calls to Riot's API as well as caching/saving data to a local
//  DB to reduce calls to riot
const express = require('express');

//Required for express to serve up stuff
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');

//3rd party node.js library that wraps calls to Riot's API in an node object
//  Can be found at https://github.com/cnguy/kayn
const { Kayn, REGIONS } = require('kayn');
const kayn = Kayn(process.env.RIOT_LOL_API_KEY);

// logging library for Node
const logger = require('morgan');

// Initializing a bunch of stuff
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Create link to Angular build directory.  I believe this sets the public dir
//  at the root and serves its contents as static files (express.static(publicDir)
//  This allows us to serve front end/web stuff, while futher below we'll set up
//  some API stuff.  Things here won't have their routing done through express,
//  however, since this is probably a single page app we can let Angualr handle
//  all of the 'routing' once index.html is loaded
app.use(express.static(path.join(__dirname, 'public')));

//Router will set up the api calls.  It reads in all the http traffic and 'routes'
//  it to specific endpoints
const router = express.Router();  // get an instance of the express Router

//All of our routes will be prefixed with /api.  Since the front end stuff is in
//  /public and thus at root, it can follow its own heiarchry, while everything with
//  /api will follow the heiarchry we define in router
app.use('/api', router);

//every router bounce call will go through here.  We can use this to set up basic
//  logging or configuration of headers or what ever needs to be done on all api
//  calls.  The next() allows the call to continue through to the requested route
router.use(function(req, res, next) {
    next();
});

/* GET /api/ping */
//Our first API call, will simply return a silly little string.  Good for smoke
//  testing if the server is running correctly or not.
router.route('/ping')
    .get(function(req, res) {
        res.json({message: 'Ping! I am alive'});
    });

module.exports = app;
