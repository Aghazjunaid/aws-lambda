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
    
    const user_id = event.pathParameters.user_id;
    let response;

    try {
        const totalEventsQuery = 'SELECT COUNT(*) AS total FROM events WHERE user_id = ?';
        const totalResult = await query(totalEventsQuery, [user_id]);
        const totalEvents = totalResult[0].total;

        const lastEventQuery = `
            SELECT event_type, timestamp 
            FROM events 
            WHERE user_id = ? 
            ORDER BY timestamp DESC LIMIT 1
        `;
        const lastEventResult = await query(lastEventQuery, [user_id]);
        const lastEvent = lastEventResult[0] || {};

        response = {
            statusCode: 200,
            body: JSON.stringify({
                total_events: totalEvents,
                last_event_type: lastEvent.event_type || null,
                last_event_timestamp: lastEvent.timestamp || null,
            }),
        };
    } catch (error) {
        console.error('Error retrieving user data:', error);
        response = {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not retrieve user data' }),
        };
    } finally {
        connection.end();
    }
    return response;
};