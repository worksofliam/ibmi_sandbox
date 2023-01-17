const { DBPool } = require('idb-pconnector');
const pool = new DBPool('*LOCAL', {
    debug: true
});

let ibmi = (function () {
    let module = {};

    // cb format: err, result
    module.runSql = async function (sql, cb) {
        console.log('Running sql ' + sql); try {
            let results = await pool.runSql(sql);
            if (results) {
                console.log(`results:\n ${JSON.stringify(results)}`);
            }
            cb(null, results);

        } catch (error) {
            cb(error, null);
        }
    };

    module.createBooksTable = function (cb) {
        const createTable = `CREATE OR REPLACE TABLE
                       Books(bookId INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY(START WITH 1, INCREMENT BY 1),
                       title VARCHAR(30) NOT NULL,
                       isbn VARCHAR(20) NOT NULL,
                       amount DECIMAL(10 , 2) NOT NULL, PRIMARY KEY (bookId))`;
        module.runSql(createTable, function (createTableErr, result) {
            // after createTable concluded and there is no error call passport callback
            if (createTableErr) cb(createTableErr, null);
            else cb(null, user);
        });
    };

    return module;
})();

module.exports = ibmi;
