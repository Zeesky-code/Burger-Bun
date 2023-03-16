# Burger Bun
Burger Bun is a restaurant website with a  restaurant chatbot that will assist customers in placing orders for their preferred meals. It is built using Node.js, Express, Socket.IO, and MongoDB.

## Prerequisites
Before you can run HiveBot, you need to have the following software installed on your system:

- Node.js (version 12 or later)

## Installation

To install HiveBot, follow these steps:

1. Clone this repository to your local machine:
    ```
    git clone https://github.com/Zeesky-code/Burger-Bun.git
    ```
2. Install the dependencies:
    ```
    npm install
    ```
3. Set the environment variables:

    - Create a `.env` file in the root directory of the project.
    - Add the following lines to the file:

    ```
    MONGO_DB_CONNECTION_URI=<your MongoDB URI>
    SESSION_SECRET=<your session secret>
    ```

    Replace `<your MONGO_DB_CONNECTION_URI>` with the URI of your MongoDB database, and `<your SESSION_SECRET>` with a secret string for session encryption.
4. Run the program using:
    ```
    npm run start
    ```
5. Open the application in your browser:
    ```
    http://localhost:8080
    ```
    
