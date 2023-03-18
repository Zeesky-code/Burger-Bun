# Burger Bun
Burger Bun is a restaurant website with a  restaurant chatbot that will assist customers in placing orders for their preferred meals. It is built using Node.js, Express, Socket.IO, and MongoDB.

# Website
 http://burger-bun.onrender.com/

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
    
## Usage

- Navigate to the base url after running the app

- Click on the `Order Now` button to be directed to chat page

- You'll be presented with the options:


    - Select "1" to order food

    - Select "99" to checkout order

    - Select "98" to see order history

    - Select "97" to see current order

    - Select "0" to cancel order
   

- If you select "1" to order food, the chatbot will present you with a menu of items. You can enter the number of the item you want to order.

- If you select "99" to checkout your order, the chatbot will let you know that your order has been placed and will show the main menu.

- If you select "98" to see old orders, the chatbot will show you your order history.

- If you select "97" to see your current order, the chatbot will show you your current order.

- If you select "0" to cancel your order, the chatbot will let you know that your order has been cancelled and will show the main menu.
