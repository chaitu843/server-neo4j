let database = require("./operations"),
  express = require("express"),
  app = express();

app.use(express.json());

// To open the connection
app.get(`/openConnection`, (req, res) => {
    database.openConnection();
    res.send({
        status: 'Success',
        message: 'Opened the connection'
    })
})

// To create a node
app.post(`/db/node/create`, (req, res) => {
    database.addNode(req.body.label, req.body.properties)
            .then(results => res.send(results[0]));
})

// To update a node
app.post(`/db/node/update`, (req, res) => {
    database.updateNode(req.body.label, req.body.properties)
            .then(results => res.send(results[0]));
})

// To get all nodes with label
app.get(`/db/node/label/all`, (req, res) => {
    database.getAllNodesWithLabel(req.query.label)
            .then(results => res.send(results));
})

// To get a node with label an prop
app.get(`/db/node/label/one`, (req, res) => {
    database.getANodeWithLabelAndIdentity(req.query.label, req.query.id)
            .then(result => res.send(result));
})

// To delete all nodes with label
app.delete(`/db/node/label/all`, (req, res) => {
    database.deleteAllNodesWithLabel(req.query.label)
            .then(() => res.send({status: 'success', message: 'Deleted all the nodes with the given label'}))
})

// To delete a node with label and prop
// To delete all nodes with label
app.delete(`/db/node/label/one`, (req, res) => {
    database.deleteANodeWithLabelAndIdentity(req.query.label, req.query.id)
            .then(() => res.send({status: 'success', message: 'Deleted the node with the given label and id'}))
})

// To delete the database
app.delete(`/db`, (req, res) => {
    database.deleteDatabase()
            .then(() => res.send({status: 'success', message: 'Deleted the contents of database'}))
})

// To close the driver
app.get(`/closeConnection`, (req, res) => {
  database.closeConnection();
  res.send({
    status: "Success",
    message: "Closed the Connection"
  });
});

app.get("/", (req, res) => res.send("<h1>Loading......</h1"));

app.listen("5000", () => console.log("listening to 5000"));
