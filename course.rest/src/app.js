const express = require('express');
const bodyParser = require('body-parser');
const packageJson = require('../package.json');
const File = require("./files/controller");

class App {
    constructor(place) {
        const app = express();
        const file = new File();

        app.use(bodyParser.urlencoded({
            extended: true
        }));
        app.use(bodyParser.json());

        var middlewareHttp = function (request, response, next) {
            response.setHeader('Api-version', packageJson.version);
            response.setHeader('Accept', "application/json; charset=utf-8")

            console.log(`${request.method} ${request.originalUrl}`);
            if (request.body && Object.keys(request.body).length >0) {
                console.log(`request.body ${JSON.stringify(request.body)}`);
            }
            next();
        };
        app.use(middlewareHttp);

        place.configure(app);
        file.configure(app);

        app.get('/api/version', function (request, response) {
            response.json({
                version: packageJson.version,
            });
        });

        // eslint-disable-next-line no-unused-vars
        app.use(function (error, request, response, next) {
            console.error(error.stack);
            response.status(500).json({
                key: '500 - server.error'
            });
        });

        app.use(function(request, response, next){
            response.status(404).json({
                key: 'server.error'
            });
        });
        
        this.app=app;
    }
}

module.exports = App;
