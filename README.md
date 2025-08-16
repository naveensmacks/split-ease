# split-ease

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following software installed on your machine:

- [Node.js](https://nodejs.org/en/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Git](https://git-scm.com/downloads)

### Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/your-repository-name.git
   cd your-repository-name
   ```

2. **Install project dependencies:**

   ```bash
   npm install
   ```

3. **Set up the PostgreSQL database:**

   - Make sure your PostgreSQL server is running.
   - Create a new database for the project. You can do this using `psql` or a GUI tool like pgAdmin.

4. **Create the environment file:**

   Create a `.env` file in the root of the project directory and add the following environment variables. This file stores sensitive information and is not committed to version control.

   ```env
   # PostgreSQL Connection URL
   # Replace USER, PASSWORD, HOST, PORT, and DBNAME with your database credentials.
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public"

   # NextAuth.js secret for session encryption
   # You can generate a secret using: openssl rand -base64 32
   AUTH_SECRET="your-nextauth-secret"

   # NextAuth.js URL
   AUTH_URL="http://localhost:3000"
   ```

5. **Run database migrations:**

   This command will set up the database schema based on the Prisma schema file.

   ```bash
   npx prisma migrate dev
   ```

6. **Seed the database (optional but recommended):**

   This will populate the database with initial data, such as currency types.

   ```bash
   npx prisma db seed
   ```

7. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the running application.

You should now have the project running locally. Any changes you make to the code will be automatically reflected in your browser.

### DB Schema

![DB shema Diagram - Draft 1](DB_Draft1.png)
