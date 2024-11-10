To build a serverless AWS Lambda function in Node.js that processes and logs real-time events in an Amazon RDS (MySQL) database, along with an API endpoint for data retrieval, follow the steps outlined below.

### Step 1: Set Up Your Amazon RDS (MySQL)

1. **Create an RDS Instance:**
   - Navigate to the RDS section in the AWS Management Console.
   - Create a new MySQL database instance.
   - Record the endpoint, database name, username, and password.

2. **Design the Schema:**
   Use the following SQL command to create the `events` table:

   ```sql
   CREATE TABLE events (
       id INT AUTO_INCREMENT PRIMARY KEY,
       user_id VARCHAR(255) NOT NULL,
       event_type VARCHAR(255) NOT NULL,
       timestamp DATETIME NOT NULL,
       metadata JSON
   );
   ```

### Step 2: Create the Event Processing Lambda Function

1. **Create a Lambda Function:**
   - Go to the Lambda section in the AWS Management Console.
   - Create a new Lambda function named `ProcessEventFunction`.
   - Select Node.js as the runtime.

2. **Set Up API Gateway:**
   - Create a new API in API Gateway.
   - Create a `POST` method that triggers `ProcessEventFunction`.

### Step 3: Create the Data Retrieval Lambda Function

1. **Create a Second Lambda Function:**
   - Name it `RetrieveUserDataFunction`.

2. **Set Up Another API Gateway Endpoint:**
   - Create a `GET` method that triggers `RetrieveUserDataFunction`.

### Step 4: Environment Variables

1. **Set Environment Variables for Lambda Functions:**
   - In the Lambda function settings, add the following environment variables:
     - `RDS_HOST`: Your RDS instance endpoint.
     - `DB_USERNAME`: Your RDS username.
     - `DB_PASSWORD`: Your RDS password.
     - `DB_NAME`: Your database name.

### Testing

1. **Deploy and Test API Endpoints:**
   - Deploy the API in API Gateway.
   - Use Postman or curl to send `POST` requests to log events and `GET` requests to retrieve user data.

### Conclusion

You now have a serverless architecture using AWS Lambda and Amazon RDS that logs real-time events and allows for basic data retrieval in Node.js. Ensure to test both endpoints thoroughly and adjust IAM permissions as necessary.
