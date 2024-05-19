## Description
This project is a Task Management System built with NestJS, Mongoose, and Agenda for scheduling. It provides a backend API for managing tasks, including functionalities like creating tasks, updating their statuses and priorities, and scheduling tasks with specific due dates.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Features
- **User Authentication**: Secure user authentication with JWT.
- **Task Management**: Create, read, update, and delete tasks.
- **Task Scheduling**: Automatically mark tasks as overdue if they are not completed by their due dates using Agenda
- **Task Status & Priority**: Manage task statuses (pending, in progress, completed, overdue) and priorities (low, medium, high).
- **Database Integration**: MongoDB integration using Mongoose, for persistent storage
- **Environment Configuration**: Use of @nestjs/config for environment variables.

## Design pattern/Architecture
This project follows a feature-based architecture, where each feature encapsulates its own logic, data access, and business modules. This design promotes high cohesion and low coupling, leading to a more modular, maintainable, and scalable codebase.

### Example:
For a Task feature, the structure would be
- `task.controller.ts`: Handles HTTP requests related to tasks.
- `task.service.ts`: Contains the business logic for task operations.
- `schema/task.schema.ts`: Defines the task data model using Mongoose.
- `task.dto.ts`: Defines the data structures for task creation, updates, etc.



