let database = require('./operations');

database.addNode('PERSON', {
    name: 'himanshu',
    age: 24
}).then((result) => console.log(result))
//     express = require('express'),
//     app = express();

// app.use(express.json());

// // An api to create a node



// app.get('/', (req, res) => res.send('<h1>Loading......</h1'));

// app.listen('5000', () => console.log('listening to 5000'));