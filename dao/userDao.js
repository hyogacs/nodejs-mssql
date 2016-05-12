/**
 * Created by sai on 2016/05/10.
 */
var json2html = require('node-json2html');
var sql = require('mssql');

var transform = {
    tag: 'tr',
    children: [{
        "tag": "td",
        "html": "${id}"
    }, {
        "tag": "td",
        "html": "${name}"
    }]
};

module.exports = {    
    queryAll : function(req, res, next) {
        new sql.Request()
            .query('select * from n01.t_user')
            .then(function(recordset) {
                
                var html = '<table border="1" cellspacing="1" cellpadding="1" >';
                html += json2html.transform(recordset,transform);
                html += '</table>';
                res.send(html);

                console.dir(recordset);
        }).catch(function(err) {
            next(err);
        });
    }
};

