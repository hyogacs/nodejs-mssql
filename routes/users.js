var express = require('express');
var router = express.Router();
var userDao = require('../dao/userDao');

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('User API');
});

//router.get('/queryAll', userDao.queryAll);

//router.get('/queryById', userDao.queryById);



router.route('/queryAll')
    .get(userDao.queryAll);



module.exports = router;
