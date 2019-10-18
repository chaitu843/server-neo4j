let driver = require('./dbConnection'),
    session = driver.session(),
    neo4j = require('neo4j-driver').v1;

let database = {

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
                 console.log(props);
                    records.push(props);
                    session.close();
                    driver.close();
                    return records;
                })
            .catch(error => console.log(error))
    },

    updateNode(label, body) {
        let task;
        if (label == 'PERSON') task = session.run(`MATCH (n:${label})
                                                WHERE n.name = '${body.name}'
                                                SET n.age = ${neo4j.int(body.age)}
                                                RETURN n.name AS name, n.age AS age`)
        else if (label == 'MOVIE') task = session.run(`MATCH (n:${label})
                                                        WHERE n.title = '${body.title}'
                                                        SET n.year = ${neo4j.int(body.year)}
                                                        RETURN n.title AS title, n.year AS year`)
        return task
            .then((result) => {
                let records = [];
                result.records.forEach(record => {
                    if (record.get('name')) {
                        records.push({
                            name: record.get('name'),
                            age: record.get('age')
                        })
                    } else {
                        records.push({
                            title: record.get('title'),
                            year: record.get('year')
                        })
                    }
                })
                session.close();
                return records;
            })
            .catch(error => console.log(error))
    },

    getAllNodesWithLabel(label) {
        let task = session.run(`MATCH (N:${label}) RETURN N` ), records = [];
        return task.then(result => {
            result.records.forEach(record => records.push(record.get('N').properties));
            return records;
        })
    },

    getANodeWithLabelAndIdentity(label, identity) {
        let task;
        if(label == 'PERSON') task = session.run(`MATCH (N:${label}) WHERE N.name = '${identity}' RETURN N `)
        else if(label == 'MOVIE') task = session.run(`MATCH (N:${label}) WHERE N.title = '${identity}' RETURN N`)
        return task.then(result => result.records[0].get('N').properties)
    },

    deleteAllNodesWithLabel(label){
        let task = session.run(`MATCH (N:${label}) DETACH DELETE N`);
        return task;
    },

    deleteANodeWithLabelAndIdentity(label, identity){
        let task;
        if(label == 'PERSON') task = session.run(`MATCH (N:${label}) WHERE N.name = '${identity}' DETACH DELETE N `)
        else if(label == 'MOVIE') task = session.run(`MATCH (N:${label}) WHERE N.title = '${identity}' DETACH DELETE N`)
        return task;
    },

    deleteDatabase(label){
        let task = session.run(`MATCH (N) DETACH DELETE N`);
        return task;
    },

    closeDriver() {
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