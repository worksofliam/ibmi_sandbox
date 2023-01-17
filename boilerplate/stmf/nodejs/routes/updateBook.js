const router = require('express').Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const ibmi = require('../ibmi_utils.js');

//register middleware
router.use(urlencodedParser);

//update an exsisting book
router.put('/', async (req, res) => {
    let title = req.body.title,
        isbn = req.body.isbn,
        amount = parseFloat(req.body.amount).toFixed(2),
        id = parseInt(req.body.id);
    let sql = `UPDATE BOOKS SET TITLE = '${title}', ISBN = '${isbn}', AMOUNT = ${amount} WHERE BOOKID = ${id}`;
    ibmi.runSql(sql, function(err, result) {
        if (err) res.status(400).send({message:'Unable to update book'});
        else res.send({message: 'update was successful'});
    });
});

module.exports = router;
