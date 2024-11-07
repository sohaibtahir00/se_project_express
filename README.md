### WTWR (What To Wear Right) API

This project is a Node.js backend API for managing a collection of clothing items and users. It allows users to add, delete, like, and dislike clothing items based on the weather conditions. The API also supports basic user management, including creating new users and retrieving user data. This application is built using Express.js and MongoDB.

### Features

- Clothing Items Management:
- Create a clothing item with details such as name, weather, and imageUrl.
- Retrieve all clothing items.
- Delete a clothing item by its ID.
- Like and dislike clothing items.
- User Management:
- Create new users with a name and avatar.
- Retrieve all users.
- Retrieve a user by their ID.
- Technologies Used
- Node.js: JavaScript runtime used for building the backend of the application.
- Express.js: A minimal and flexible Node.js web application framework for building RESTful APIs.
- MongoDB: NoSQL database used to store clothing items and user data.
- Mongoose: ODM (Object Data Modeling) library for MongoDB and Node.js.
- ESLint: A linter tool for identifying and fixing problems in the JavaScript code.
- Validator: A library used for validating data (e.g., validating that a URL is correctly formatted).

## Project Structure

├── controllers
│ ├── clothingItems.js # Handles clothing items-related logic and routes
│ └── users.js # Handles user-related logic and routes
├── models
│ ├── clothingItem.js # Mongoose schema for the clothing item
│ └── user.js # Mongoose schema for the user
├── routes
│ ├── clothingItems.js # Defines routes for clothing items API endpoints
│ ├── users.js # Defines routes for user API endpoints
│ └── index.js # Main router that combines all route modules
├── utils
│ └── errors.js # Utility file to manage common HTTP error codes
├── app.js # Main entry point to the application
├── .eslintrc.js # ESLint configuration
└── README.md # Project documentation

# Website Link

[Website Link](https://wt-wr.dob.jp/)
