var sql = require('mssql');

var config = {
    user: 'sai',
    password: 'sqlserver@2016',
    server: 'ec2-54-199-226-156.ap-northeast-1.compute.amazonaws.com',
    database: 'nodedb',
    connectionTimeout: 3000,
    options: {
        encrypt: false // Use this if you're on Windows Azure
    }
};

function createPool() {
    return new Promise(function(resolve, reject) {
        sql.connect(config).then(function () {
            console.log("sqlserver is connected.");
            resolve();
        }).catch(function (err) {
            console.error(err);
            return reject(err);
        });
    });
}

module.exports.createPool = createPool;

function terminatePool() {
    return new Promise(function(resolve, reject) {        
        sql.close(function(err) {
            if (err) {
                return reject(err);
            }
            resolve();
        });        
    });
}

module.exports.terminatePool = terminatePool;


