const mysql = require('mysql');
const util = require('util');

exports.handler = async (event) => {
    const connection = mysql.createConnection({
        host: process.env.RDS_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
    
    // Promisify for Node.js async/await.
    const query = util.promisify(connection.query).bind(connection);
    
    let response;
    try {
        const body = JSON.parse(event.body);
        const { user_id, event_type, timestamp, metadata } = body;
        
        if(!user_id || !event_type || !timestamp){
            response = {
                statusCode: 200,
                body: JSON.stringify({ message:  'user_id, event_type and timestamp are required field'}),
            };
        }else {
            // Insert event into the database
            const sql = 'INSERT INTO events (user_id, event_type, timestamp, metadata) VALUES (?, ?, ?, ?)';
            await query(sql, [user_id, event_type, timestamp, JSON.stringify(metadata)]);
            
            response = {
                statusCode: 200,
                body: JSON.stringify({ message: 'Event logged successfully' }),
            };
        }        
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