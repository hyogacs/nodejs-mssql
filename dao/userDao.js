/**
 * Created by sai on 2016/05/10.
 */
var json2html = require('node-json2html');
var sql = require('mssql');


var transform1 = {
    tag: 'td',"html": "${name}"
};

var transform2 = {
    tag: 'tr',
    children: [{
        "tag": "td",
        "html": "${CORP_CD}"
    }, {
        "tag": "td",
        "html": "${TT_CD}"
    }, {
        "tag": "td",
        "html": "${TT_NAME_SEI}"
    }, {
        "tag": "td",
        "html": "${TT_NAME_MEI}"
    }]
};

var transform3 = {
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
    queryAll2 : function(req, res, next) {
        new sql.Request()
            .query('select * from n01.t_user')
            .then(function(recordset) {
                
                var html = '<table border="1" cellspacing="1" cellpadding="1" >';
                html += json2html.transform(recordset,transform3);
                html += '</table>';
                res.send(html);

                console.dir(recordset);
        }).catch(function(err) {
            next(err);
        });
    }
};

