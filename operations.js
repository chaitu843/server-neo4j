let driver,
    session,
    neo4j = require('neo4j-driver').v1;

let database = {

    /*
     * openConnection()
     * opens the connection with database
     */
    openConnection() {
        driver = require('./dbConnection');
        session = driver.session();
    },

    /*
     * addNode()
     * Takes label and properties as parameters
     * Returns the node properties which has been added 
     */
    addNode(label, body) {
        let string = '{', records = [];
        Object.keys(body).forEach(key => {
            if(typeof(body[key]) == 'number')  string+=` ${key}: ${neo4j.int(body[key])},`
            else string+=` ${key}: '${body[key]}',`
        });
        string = string.slice(0,-1) + '}';
        return session.run(`MERGE (N:${label}${string}) RETURN N`)
            .then((result) => {
                 let props = createFlatProps(result.records[0].get('N').properties);
                    records.push(props);
                    session.close();
                    return records;
                })
            .catch(error => console.log(error))
    },

    /*
     * update()
     * Takes label and properties as parameters (properties contain id and then properties needs to be updated)
     * since using WHERE clause need different queries for different labels
     * Returns the whole node properties
     */
    updateNode(label, body) {
        let task;
        if (label == 'PERSON') task = session.run(`MATCH (n:${label})
                                                WHERE n.name = '${body.name}'
                                                SET n.age = ${neo4j.int(body.age)}
                                                RETURN n`)
        else if (label == 'MOVIE') task = session.run(`MATCH (n:${label})
                                                        WHERE n.title = '${body.title}'
                                                        SET n.year = ${neo4j.int(body.year)}
                                                        RETURN n`)
        return task
            .then((result) => {
                let records = [], props = createFlatProps(result.records[0].get('N').properties);
                records.push(props);
                session.close();
                return records;
            })
            .catch(error => console.log(error))
    },

    /*
     * getAllNodesWithLabel()
     * Takes label as parameter
     * Returns all the nodes with that label
     */
    getAllNodesWithLabel(label) {
        let task = session.run(`MATCH (N:${label}) RETURN N` ), records = [];
        return task.then(result => {
            result.records.forEach(record => createFlatProps(records.push(record.get('N').properties)));
            return records;
        })
    },

    /*
     * getANodeWithLabelAndIdentity()
     * Takes label and identity as parameter
     * since using WHERE clause need different queries for different labels
     * Returns the node with that label and identity
     */
    getANodeWithLabelAndIdentity(label, identity) {
        let task;
        if(label == 'PERSON') task = session.run(`MATCH (N:${label}) WHERE N.name = '${identity}' RETURN N `)
        else if(label == 'MOVIE') task = session.run(`MATCH (N:${label}) WHERE N.title = '${identity}' RETURN N`)
        return task.then(result => createFlatProps(result.records[0].get('N').properties));
    },

    /*
     * deleteAllNodesWithLabel()
     * Takes label as parameter
     * deletes all nodes with label
     * Returns task promise
     */
    deleteAllNodesWithLabel(label){
        let task = session.run(`MATCH (N:${label}) DETACH DELETE N`);
        return task;
    },

    /*
     * deleteANodeWithLabelAndIdentity()
     * Takes label and identity as parameter
     * deletes the node with label and identity
     * Returns task promise
     */
    deleteANodeWithLabelAndIdentity(label, identity){
        let task;
        if(label == 'PERSON') task = session.run(`MATCH (N:${label}) WHERE N.name = '${identity}' DETACH DELETE N `)
        else if(label == 'MOVIE') task = session.run(`MATCH (N:${label}) WHERE N.title = '${identity}' DETACH DELETE N`)
        return task;
    },

    /*
     * deleteDatabase()
     * deletes the whole database
     * Returns task promise
     */
    deleteDatabase(lael){
        let task = session.run(`MATCH (N) DETACH DELETE N`);
        return task;
    },

    /*
     * closeConnection()
     * closes the driver
     * returns void
     */
    closeConnection() {
        driver.close();
    }
};

function createFlatProps(props) {
    Object.keys(props).forEach(key => {
        if(neo4j.isInt(props[key])) {
            if(neo4j.integer.inSafeRange(props[key])) props[key] = props[key].toNumber();
            else props[key] = props[key].toString()
        }
    })
    return props;
}

module.exports = database;
