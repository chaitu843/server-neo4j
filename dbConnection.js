let neo4j = require('neo4j-driver').v1;

const URL = 'bolt://10.150.93.11:7687', username = 'neo4j', password = 'password';

let driver = neo4j.driver(URL, neo4j.auth.basic(username, password));

module.exports = driver;