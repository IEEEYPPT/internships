'use strict';

const Conf = require('./../knexfile.js');
const Knex = require('knex')(Conf);

Knex.migrate.latest([Conf]); 

module.exports = Knex;