const mysql = require('mysql');
const util = require('util');

const connection = mysql.createConnection({
    host: "database-1.cta42yigketu.ap-south-1.rds.amazonaws.com",
    user: "admin",
    password: "AYKD3Ih5EBsghdDntnc8",
    database: "eventLogs",
});

// Promisify for Node.js async/await.
const query = util.promisify(connection.query).bind(connection);

exports.handler = async (event) => {
    let response;
    try {
        const body = JSON.parse(event.body);
        const { user_id, event_type, timestamp, metadata } = body;

        // Insert event into the database
        const sql = 'INSERT INTO events (user_id, event_type, timestamp, metadata) VALUES (?, ?, ?, ?)';
        await query(sql, [user_id, event_type, timestamp, JSON.stringify(metadata)]);
        
        response = {
            statusCode: 200,
            body: JSON.stringify({ message: 'Event logged successfully' }),
        };
    } catch (error) {
        console.error('Error processing event:', error);
        response = {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not process the event' }),
        };
    } finally {
        connection.end();
    }
    return response;
};