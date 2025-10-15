# Event Management REST API

A RESTful API for managing events and user registrations, built with **Node.js**, **Express**, and **PostgreSQL**.
**How to Clone the repository**
git clone https://github.com/Sarim1693/Event-Management-System.git
** OPEN THE INTEGRATED TERMINAL**
npm install
Then create Your Databse in the pgAdmin 4
Create .env file 
int that: DB_PASS=<your_postgres_password>
          PORT=4000
Start the Server by : node server.js
Server will be running at 4000 and the databse will also be connected
API Endpoints
1. Create Event

POST /events/create

{
  "title": "Tech Meetup",
  "event_datetime": "2025-11-25T10:00:00Z",
  "location": "Delhi",
  "capacity": 200
}


Response

{
  "message": "Event created successfully",
  "eventId": "5ca56967-fee1-416f-94ab-66d9e2a770f5"
}
2. Get Event Details

GET /events/:id
Response

{
  "id": "5ca56967-fee1-416f-94ab-66d9e2a770f5",
  "title": "Tech Meetup",
  "event_datetime": "2025-11-25T10:00:00Z",
  "location": "Delhi",
  "capacity": 200,
  "registrations": [
    {
      "id": "uuid-user-1",
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}
3. Cancel Registration

DELETE /events/:id/register

{
  "userId": "uuid-user-1"
}


Response

{
  "message": "Registration cancelled",
  "eventId": "5ca56967-fee1-416f-94ab-66d9e2a770f5",
  "userId": "uuid-user-1"
}
Event Stats

4. GET /events/:id/stats
Response

{
  "totalRegistrations": 10,
  "remainingCapacity": 190,
  "percentUsed": 5
}
