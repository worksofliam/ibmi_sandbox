const router = require('express').Router();
const ibmi = require('../ibmi_utils.js');

//Respond with Static Book Table
router.get('/', async function(req, res) {
    ibmi.runSql('SELECT * FROM BOOKS', function(err, result) {
        res.render('staticTable.ejs', {title: 'View Books', data: result, error: null});
    })
});

module.exports = router;
