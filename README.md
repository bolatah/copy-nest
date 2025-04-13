
# CopyNest

CopyNest is a Progressive Web Application (PWA) designed to manage "Nests" with editable content. It integrates Firebase Authentication with Google Sign-In and email/password providers for user authentication and verification. The backend is built with Spring Boot and uses MongoDB for data storage.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Authentication](#authentication)
- [Tech Stack](#tech-stack)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)

## Features
- User authentication via Firebase (Google Sign-In, Email/Password)
- Create, Read, Update, and Delete (CRUD) operations for "Nests"
- MongoDB Atlas Vector Database for data management
- Angular PWA frontend with a responsive UI

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (for Angular)
- [Java 17+](https://adoptopenjdk.net/) (for Spring Boot)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (for database)
- [Firebase Project](https://firebase.google.com/) (for authentication)

### Backend Setup (Spring Boot)
1. Clone the repository:
   ```bash
   git clone https://github.com/bolatah/copy-nest.git
   cd copy-nest/backend
   ```
2. Add your Firebase credentials and MongoDB connection details in `application.properties` or `application.yml`.
3. Build and run the backend:
   ```bash
   ./mvnw spring-boot:run
   ```
4. Ensure the backend is running on a specified port (e.g., `http://localhost:8080`).

### Frontend Setup (Angular)
1. Navigate to the frontend-angular directory:
   ```bash
   cd copy-nest/frontend-angular
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Serve the Angular application:
   ```bash
   ng serve
   ```
4. Visit `http://localhost:4200` in your browser to access the app.

## Usage
Once the app is running:
- **Login**: Use Google Sign-In or email/password to authenticate.
- **Manage Nests**: Create, edit, and delete Nests. Each Nest has a name and content.

## Authentication
- Firebase Authentication is used for securing the application. After successful login, users can perform CRUD operations on their Nests.

## Tech Stack
- **Frontend**: Angular 17, Firebase Authentication, PWA
- **Backend**: Java Spring Boot, MongoDB Atlas
- **Database**: MongoDB Atlas Vector Database

## API

### Nest API
- **GET** `/api/nests`: Retrieve all Nests for the authenticated user.
- **POST** `/api/nests`: Create a new Nest.
- **PUT** `/api/nests/{id}`: Update a Nest by ID.
- **DELETE** `/api/nests/{id}`: Delete a Nest by ID.

## Contributing
1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Make changes and commit them: `git commit -am 'Add new feature'`.
4. Push the branch: `git push origin feature/your-feature`.
5. Create a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
