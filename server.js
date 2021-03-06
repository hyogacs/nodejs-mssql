/**
 * Created by sai on 2016/05/10.
 */
var http = require('http');
var express = require('express');
var morgan = require('morgan');
var database = require('./server/connect_aws.js');
var routes = require('./routes/index');
var users = require('./routes/users');
var openHttpConnections = {};
var app;
var httpServer;

process.on('uncaughtException', function(err) {
    console.error('Uncaught exception ', err);

    shutdown();
});

process.on('SIGTERM', function () {
    console.log('Received SIGTERM');

    shutdown();
});

process.on('SIGINT', function () {
    console.log('Received SIGINT');

    shutdown();
});

initApp();
//
function initApp() {
    app = express();
    httpServer = http.Server(app);

    app.use(morgan('combined')); //logger

    //app.use('/api', api.getRouter());
    app.use('/users', users);

    app.use(handleError);

    httpServer.on('connection', function(conn) {
        var key = conn.remoteAddress + ':' + (conn.remotePort || '');

        openHttpConnections[key] = conn;

        conn.on('close', function() {
            delete openHttpConnections[key];
        });
    });

    database.createPool()
        .then(function() {
            httpServer.listen(3000, function() {
                console.log('Webserver listening on localhost:3000');
            });
        })
        .catch(function(err) {
            console.error('Error occurred creating database connection pool', err);
            console.log('Exiting process');
            process.exit(0);
        });

}

function handleError(err, req, res, next) {
    console.error(err);
    res.status(500).send({error: 'An error has occurred, please contact support if the error persists'});
    shutdown();//process would usually be restarted via something like https://github.com/foreverjs/forever
}

function shutdown() {
    console.log('Shutting down');
    console.log('Closing web server');

    httpServer.close(function () {
        console.log('Web server closed');

        database.terminatePool()
            .then(function() {
                console.log('node-oracledb connection pool terminated');
                console.log('Exiting process');
                process.exit(0);
            })
            .catch(function(err) {
                console.error('Error occurred while terminating node-oracledb connection pool', err);
                console.log('Exiting process');
                process.exit(0);
            });
    });

    for (key in openHttpConnections) {
        openHttpConnections[key].destroy();
    }
}