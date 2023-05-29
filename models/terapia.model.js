const { executeQuery, executeQueryOne } = require("../helpers/utils")


const getAll = () => {

    return executeQuery('select * from terapias')
};


const getById = (id) => {

    return executeQueryOne('select * from terapias where id = ?', [id]);
};

module.exports = {
    getAll,
    getById
}