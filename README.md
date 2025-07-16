### SETUP INSTRUCTION:- (First install all the dependencies and dev dependencies)
### npm init -y
### npm i body-parser concurrently cors dotenv drizzle-orm express helmet morgan nodemailer nodemon pg zod @types/nodemailer
### npm i -D drizzle-kit ts-node tsx typescript @types/express @types/node @types/pg


### In this project i have implemented a simple CRUD without authentication for user and have managed the event part as per the instructions given.
### Given comments in routes for better understanding
### i got an idea so that user can register and login via OTP verification.
### Business Idea ---> THEIR MUST ME AN PENALTY WHEN USER CANCELS AN REGISTRATION .
###                     THEIR MUST ME AN PENALTY WHEN USER UPDATES THEIR REGISTRATION DATE FEW HOURS AGO OR A DAY AGO.

### Business Logic Rules :-
### ● Enforce registration limits per event
### ● Prevent double registration
### ● Disallow registration for past events
### ● Return appropriate HTTP status codes and messages for all failures
### ● Validate all input data properly
### All of the above implemented

### Api example:-

### http://localhost:3000/event/7/stats
### {
###        "totalRegistrations": 1,
###        "remainingCapacity": 499,
###        "percentageUsed": "0.20%"
###  }

### http://localhost:3000/event/:eventId/register-event/:userId
#   { message: 'Registration cancelled' }

### http://localhost:3000/event/:eventId/register-event
# req.body: { userId: 2 }
# { "message": "Registered successfully" }

### http://localhost:3000/event/:eventId
# {
#    "event": {
#        "id": 8,
#        "title": "bday-party",
#        "datetime": "2025-09-15 14:30:00",
#        "location": "west-bengal",
#        "capacity": 500
#    },
#    "registeredUsers": [
#        {
#            "id": 2,
#            "name": "sonu2255",
#            "email": "sonukrshaw3122@gmail.com"
#        }
#    ]
# }

### http://localhost:3000/event/upcoming
# {
#    "data": [
#        {
#            "id": 4,
#            "title": "bday",
#            "datetime": "2025-08-15 18:00:00",
#            "location": "india",
#            "capacity": 500
#        },
#        {
#            "id": 5,
#            "title": "bday-party",
#            "datetime": "2025-09-15 14:30:00",
#           "location": "west",
#            "capacity": 500
#        },
#        {
#            "id": 7,
#            "title": "bday-party",
#            "datetime": "2025-09-15 14:30:00",
#            "location": "west-ben",
#            "capacity": 500
#        },
#        {
#            "id": 9,
#            "title": "Bday Party",
#            "datetime": "2025-09-15 14:30:00",
#            "location": "West-Ben",
#            "capacity": 500
#        },
#       {
#            "id": 8,
#            "title": "bday-party",
#            "datetime": "2025-09-15 14:30:00",
#            "location": "west-bengal",
#            "capacity": 500
#        }
#    ]
# }

### http://localhost:3000/event/create
# req.body: {   
#  "title": "Wedding",
#  "datetime": "2025-10-15T14:30:00.000Z",
#  "location": "Banaras",
#  "capacity": 800
# }
# {
#    "data": {
#        "id": 10,
#        "title": "Wedding",
#        "datetime": "2025-10-15 14:30:00",
#        "location": "Banaras",
#        "capacity": 800
#    }
# }