# Test API

A NestJS backend for the Ryson application.

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/test
   PORT=3000
   JWT_SECRET=
   JWT_ACCESS_SECRET=
   JWT_REFRESH_SECRET=
   JWT_EXPIRES_IN=1h
   CSRF_SECRET=
   UI_URL=http://localhost:5173
   ```

3. Run the application:
   ```bash
   pnpm run dev
   ```

## API Endpoints

- **Auth**
  - `POST /auth/signup` - Sign up a new user
  - `POST /auth/login` - Login with email and password
  - `POST /auth/logout` - Logout user

- **Users**
  - `GET /users` - List all users (admin only)
  - `GET /users/:id` - Get user by ID
  - `PUT /users/:id` - Update user
  - `PUT /users/:id/toggle-active` - Toggle user active status

- **Products**
  - `POST /products` - Create a new product
  - `GET /products` - List all products
  - `GET /products/:id` - Get product by ID
  - `PUT /products/:id` - Update product
  - `DELETE /products/:id` - Soft delete product

## Technologies Used

- NestJS
- Mongoose
- Passport (Digest Authentication)
- TypeScript
