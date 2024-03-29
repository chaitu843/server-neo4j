# server-neo4j
A Basic Express server which connects to neo4j database using official driver provided by neo4j


===========================================================================================================================

Express Server connected with neo4j database using neo4j-driver

Basic APIs enough to do CRUD operations are exposed

APIs are being made taking only two nodes (PERSON and MOVIE) into consideration, without any relationships

Now relationships part can be done based on the requirement

============================================================================================================================

Using the official driver of neo4j 'neoj-driver' to connect to the database

There are more ways to connect to the neo4j database:

    1. js2neo module 
    2. consume REST api provided by neo4j using fetch API
    3. neode module --> Is an OGM, can create models / can run cypher queries

============================================================================================================================

neo4j-driver

1. We will be creating the connection with database and use that to create sessions.

2. A session needs to be created to run cypher query and always close the session once it's done.

3. So, a session needs to be created for every query.

4. Close the driver when you are done with the application.

=============================================================================================================================

Points to be Noted

1. Driver is being connected to database using bolt url. When tried connecting to http/https, error (Headers is not defined) --> Can     investigate on that.

2. After running each query, return the properties you need and access them using record.get()

3. Driver converts integer values into type neo4j.Integer

4. If you wanna pass whole object into cypher query, only option is you need to prepare a string in a way it needs and then pass it.
   It won't accept Object, Map, JSON.stringfy(gives double quotes);

5 . No Single quotes while forming a json in POSTMAN