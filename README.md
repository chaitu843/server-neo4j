# server-neo4j
A Basic Express server which connects to neo4j database using official driver provided by neo4j

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


