# Basic Weather App - Nura Space Take Home Test
I have timeboxed this to 2 hours. I am using Spec-Driven Development assisted by AI. I have written this README top to bottom, and is a record of my thinking and process

## Brief Implications and Inferred Specification

### Overview
The brief is intentionally compact, intending to test what I am considering. I have extrapolated it here before development.

### 1. Login
- "Implement a login screen where users can authenticate using a username and password, or another authentication strategy you consider appropriate."
  - Username/password authentication must be supported, implying form validation, credential handling, and session or token management. Will use JWTs.
  - It is ambigous if the app can be used without creating an account. For simplicity and to protect against API limits from traffic from the open web, I will require this.

### 2. Home Page
- "Provide a view where the user can select a city."
  - The home screen must include a city selection control. A searchable select is best. Cities will be pulled from weather API and cached.
  - City selection should be user-driven and persistent while viewing weather. Since login functionality is required, I'm inferring that user preferences, such as city is selected, should be in the database, which would, in production, be persistent and available cross-device.
  - I will keep it to 1 selected city for simplicity.

- "After selecting a city, display the current weather for that location (using any free weather API)."
  - The displayed data should be the current weather, not historical.

### 3. Live Messages
- "Implement real-time popups to display messages. Use WebSockets (or an equivalent real-time solution) to deliver these messages"
  - Toasts must appear asynchronously, without refreshing, while the app is in use.
  
- "Provide a mechanism to push messages into the system (e.g., an endpoint that accepts a message and a target city)."
  - Messages should be associated with a target city so that notifications can be delivered conditionally.
  - The backend must expose an API endpoint to receive new message payloads. An example curl will be featured below. Requires a secret.

## My implementation approach, intentionally posed as questions
1. How should the solution behave?
2. What data sources enable that behaviour?
3. How will that data be stored, marked stale, fetched, and invalidated?
4. How should I implement each feature? What should be delegated/communicated?

### User experience (How should the solution behave?)
- User is prompted to sign up / log in.
- If authenticated, if no city is saved on their account (as they just signed up, but routing based on data is ideal in case user drops off), display a centered widget to select for cities (No useful data until this has been collected, so it should be blocking)
- Show the weather home page
    - The City is displayed in large lettering with a down arrow to show that it's changeable. It utilised the same searchable select in a popover.
    - Basic weather details of temperature, rain, and cloud cover are displayed in large fonts.
- User receives notifications in toasts in top right of page

### Data sources (What data sources enable that behaviour?)
- Weather Data - Open-Meteo (Chosen for no API key & no rate limits)
- City Selection - End-user input
- Message Broadcast - HTTP Request from tester

### Server state lifecycle - How will that data be stored, marked stale, fetched, and invalidated?
Weather data
    - Fetched from frontend when city is set.
    - Caches responses from Weather Data marked stale for 10 minutes (as weather updates hourly)
Country list
    - Fetched from frontend when user searching a city. Cached for 24 hours on Frontend + Backend with search query
Notifications
    - Websocket is subscribed to when city selected & user is authenticated and resubscibed to on city change.


### How should I implement each feature? What should be delegated/communicated?
Will be following SOLID principles pragmatically. Each of the below steps will be implemented using AI. I will review their plan and then review and iterate the code.

1. Backend Database + Auth + Weather endpoints + cache
    - Weather data mapped to a normalised domain model on the backend, decoupling the frontend from Open-Meteo's response shape and making a future API swap transparent.
    - Database is only used for users table (email, password, selected city)
    - Everything else is only caching, in memory for test, but would use redis in prod.
    - JWT Authentication + Hashed passwords

2. Data-based router:
    - Configure statement (configure tanstack query client)
    - No user logged in -> Send to sign up page
    - User logged in but no city -> Send to city selection page
    - User logged in and city selected -> Send to home page

3. Frontend API layer / State management
    - Configuring tanstack queries and mutations

4. Building UI
    - Pages: Login / sign-up, city selection, home page
    - UI: City Selection, Weather Widgets, Log out button