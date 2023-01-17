const express = require('express');
const bodyParser = require('body-parser');
const ibmi = require('./ibmi_utils.js'); 
const flash = require('connect-flash');


const PORT = process.env.PORT || 10;
const APP_HOSTNAME = process.env.APP_HOSTNAME || require('os').hostname();
 
//
// app setup
//
function isLoggedIn(req, res, next) {
    return true;
}

let app = express();

//parse req body & cookies
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); 

// view engine
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
app.use('/assets', express.static(`${__dirname}/public`));

//
// app urls
//

const indexRouter = require('./routes/index');
const editRouter = require('./routes/edit');
const addBookRouter = require('./routes/addBook');
const getBookRouter = require('./routes/getBook');
const deleteBookRouter = require('./routes/deleteBook');
const updateBookRouter = require('./routes/updateBook');

app.get('/', indexRouter);
app.use('/books', indexRouter);
app.use('/edit', editRouter);
app.use('/addbook', addBookRouter);
app.use('/getbook', getBookRouter);
app.use('/deletebook', deleteBookRouter);
app.use('/updatebook', updateBookRouter);

app.get('/login', function(req, res, next) {
    return res.render('login', { dsns });
});

// display 404 for any mismatch routes
app.use(function(req, res, next) {
    return res.status(404).sendFile('404.html', {root: `${__dirname}/public/html`});
});

app.listen(PORT, function() {
    console.log(`\nServer listening @ http://${APP_HOSTNAME}:${PORT}\n`);
});
