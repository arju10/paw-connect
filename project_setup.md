## Initializing the Backend with Yarn

1. Open your terminal and navigate to the backend directory:
    ```bash
    cd paw-connect-server
    ```

2. Initialize a new Node.js project:
    ```bash
    yarn init -y
    ```

3. Install the required dependencies (replace `<package-names>` with your actual dependencies):
    ```bash
    yarn add prisma typescript tsx @types/node -D
    npx tsc --init
    ```
    ```bash
    yarn add express
    yarn add ts-node-dev -D
    yarn add cors
    yarn add -D @types/express

    ```
    

4. (Optional) Install development dependencies:
    ```bash
    yarn add -D <dev-package-names>
    ```
5. In `tsconfig.json` file add `rootDir` and `outDir`
    ```bash
    rootDir: "./src"
    outDir: "./dist"
    ```

7. Add in `packege.json`
```bash
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
  },

```
6. Start the backend server :
    ```bash
    yarn dev
    ```




````markdown
## Setting Up Prisma with PostgreSQL

Follow these steps to install and configure Prisma in your project with a PostgreSQL database.

### 1.  initialize a TypeScript project and add the Prisma CLI as a development dependency to it:

```bash
 yarn add prisma typescript tsx @types/node -D
````

### 2. Initialize Prisma

```bash
npx prisma init
```

This will create a `prisma/` folder with a `schema.prisma` file and a `.env` file.



### 3. Configure the Database URL

Edit the `.env` file to set your PostgreSQL connection string, for example:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"
```



### 5. Run Prisma Migrate

To create the database tables:

```bash
npx prisma migrate dev --name init
```
---

For full details and latest updates, check the official Prisma docs:
[Prisma Docs: Start from Scratch with PostgreSQL](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-prismaPostgres)

```

## Setting Up ESLint, Prettier, lint-staged, and Husky

Follow these steps to add code quality and formatting tools to your project.

### 1. Install ESLint, Prettier, lint-staged, and Husky

```bash
yarn add -D eslint prettier eslint-config-prettier eslint-plugin-prettier lint-staged husky
```

### 2. Initialize ESLint

```bash
npx eslint --init
```

Choose the appropriate options for your project (TypeScript, Node.js, etc.).

### 3. Configure Prettier

Create a `.prettierrc` file:

```json
{
    "semi": true,
    "singleQuote": true,
    "printWidth": 80
}
```

### 4. Update `package.json` Scripts and lint-staged

Add the following to your `package.json`:

```json
"lint-staged": {
    "**/*.{ts,js,json,md}": [
        "prettier --write",
        "eslint --fix"
    ]
},
"scripts": {
    "lint": "eslint . --ext .ts,.js",
    "format": "prettier --check .",
    "format:fix": "prettier --check ."

}
```

### 5. Set Up Husky

Initialize Husky and add a pre-commit hook:

```bash
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

Now, every commit will automatically format and lint your code.
