require('dotenv').config(); // This package loads the variables in the file .env and add then as environment variables to be used for the connection
const databaseFactory = require('./db2/DB2Factory').db2Factory; // this return a method that when called, would return the connection object with the methods to manipulate Database
const QUERIES = require('./db2/queries'); // File that returns an array with queries, helpful to not have the complete query in code
const query = require('./db2/query'); // Object that can be used to run queries without handling transactions, inside calls also the db2Factory object

// async means that the function body would handle asynchronous methods, everything returned would be converted to promise
async function transactionalQuery() {
    let connection;
    try {
        // await means that the code would wait for the value returned from the promise called in the method,
        // databaseFactory() returns a promise that resolve with the connection when this is created, and assigned to var connection
        connection = await databaseFactory(); // Creating the connection factory
        await connection.beginTransaction(); // starting the transaction
        const query = QUERIES['TEST:INSERT'];
        const statement = await connection.prepare(query); // Prepare the query to add the values
        await statement.execute(['id test', 'name test', 'price test']); // Execute the insert with the values provided in the array
        await connection.commitTransaction(); // Commit transaction if works without problems
        return 'Query run without problems';
    } catch (e) {
        if (connection) await connection.rollbackTransaction(); // If the connection was created and there was an error, a rollback is performed
        return 'There was a problem running the query, a rollback was performed';
    } finally {
        if (connection) await connection.close(); // Even if the query run ok or without problems and the connection was created, must be closed.
    }
}

async function simpleQueryGet() {
    try {
        const result = await query('SELECT current date FROM sysibm.sysdummy1', []); // Create a simple get test that works in all DB2 databases
        return result ? result[0] : 'There is no result from the query'; // Returning the result if there is one
    } catch (e) {
        return 'There was a problem running the simple query';
    }
}

transactionalQuery().then(result => console.log(`Result from transactional query: ${result}`)); // Running the transactional query and printing in console whatever returns
simpleQueryGet().then(result => console.log(`Result from simple query: ${result}`)); // Running the simple query and printing the result


