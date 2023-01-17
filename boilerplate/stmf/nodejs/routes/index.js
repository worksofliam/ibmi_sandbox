const router = require('express').Router();
const ibmi = require('../ibmi_utils.js');

//Respond with Static Book Table
router.get('/', async function(req, res) {
    console.log("hhhehehe"); 
    ibmi.runSql('SELECT * FROM BOOKSTORE.BOOKS', function(err, result) {
        res.render('staticTable.ejs', {title: 'View Books', data: result, error: null});
    })
});

module.exports = router;
