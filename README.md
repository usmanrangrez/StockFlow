
# StockFlow - Inventory Stock Management System

**StockFlow** is an inventory stock management system that helps businesses track products, manage stock, and handle transactions efficiently.

## Features
- User management (Admin, Salesman, Viewer roles)
- Company management
- Dealer management
- Product and inventory tracking
- Stock transactions (staff/returns)
- Payment transactions and tracking
- Warehouse location management
- Reporting

## Prerequisites
- Node.js (latest LTS version recommended)
- PostgreSQL

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/usmanrangrez/StockFlow.git
   ```
2. Navigate to the project directory:
   ```bash
   cd StockFlow
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Configuration
The application is configured using environment variables. Create a `.env` file in the project root. You can typically copy a `.env.example` or similar template file if one is provided (note: this project does not currently include a template file).

The following environment variables need to be set in your `.env` file:

- `NODE_ENV`: Application environment (e.g., `development`, `production`)
- `PORT`: Application port (e.g., `3000`)
- `ACCESS_TOKEN_KEY`: Secret key for JWT authentication
- `DB_DIALECT`: Database dialect (e.g., `postgres`)
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `DB_SSL`: Set to `true` or `false` for SSL connection to the database
- `ENABLE_CONNECTION_HOOKS`: Set to `true` or `false` to enable/disable database connection hooks
- `REDIS_ENABLE`: Set to `true` to enable Redis, `false` to disable
- `REDIS_URL`: Connection URL for Redis (if enabled)
- `REDIS_TOKEN`: Connection token for Redis (if enabled, for services like Upstash Redis)
- `TWILIO_ENABLED`: Set to `true` to enable Twilio SMS, `false` to disable
- `TWILIO_ACCOUNT_SID`: Twilio Account SID (if enabled)
- `TWILIO_AUTH_TOKEN`: Twilio Auth Token (if enabled)
- `TWILIO_PHONE_NUMBER`: Twilio phone number (if enabled)

## Getting Started/Running the Application

### Development Mode
To run the application in development mode:
```bash
npm run dev
```

### Production Mode
To run the application in production mode:
```bash
npm run start
```

Once the application is running, it can typically be accessed at `http://localhost:PORT`, where `PORT` is the value set in your `.env` file (e.g., 3000).

## API Endpoints
StockFlow provides a RESTful API for managing inventory operations. The API routes are defined within the `/routes` directory in the source code.

Users can explore the files in `/routes` (e.g., `routes/index.route.js`, `routes/products.routes.js`, etc.) to understand the available endpoints.

## Tech Stack
- **Backend**: Node.js / Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase inbuilt/JWT (JSON Web Tokens)
- **Logger**: Better Stack Logger
- **Caching**: Redis
- **Deployment**: Render
- **Storage**: Supabase storage

## Contributing
We welcome contributions to StockFlow! If you'd like to contribute, please follow these guidelines:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix (e.g., `git checkout -b feature/your-feature-name` or `bugfix/issue-number`).
3.  Make your changes and commit them with clear, descriptive messages.
4.  Push your branch to your forked repository.
5.  Submit a pull request to the `main` branch of the original repository.

### Reporting Issues and Suggesting Features
If you find a bug or have a feature request, please report it using the GitHub issue tracker: [https://github.com/usmanrangrez/StockFlow/issues](https://github.com/usmanrangrez/StockFlow/issues)

### License for Contributions
This project is licensed under the ISC License. By contributing, you agree that your contributions will be licensed under its terms.

## Logging
StockFlow uses **Better Stack Logger** for logging errors and system activity.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
