# PawConnect 🐾

PawConnect is a full-stack web-based pet adoption platform built with TypeScript, Express.js, Prisma, and PostgreSQL. It connects animal shelters with adopters, enabling shelters to list pets and adopters to find their perfect furry friend. The platform uses role-based access control (RBAC) to manage permissions for adopters, shelters, and admins, ensuring a secure and seamless experience.

## Table of Contents
- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Roles and Permissions](#roles-and-permissions)
- [Data Models](#data-models)
- [API Endpoints](#api-endpoints)
- [Setup Instructions](#setup-instructions)
- [RBAC Logic](#rbac-logic)
- [Special Features](#special-features)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)

## Overview
PawConnect streamlines pet adoption by providing:
- **Adopters**: Browse pets, submit adoption requests, manage profiles.
- **Shelters**: List and manage pets, approve/reject adoption requests.
- **Admins**: Oversee all users, pets, and requests, with moderation capabilities.

The platform is designed to be scalable, secure, and maintainable, with clear API contracts and comprehensive documentation.

## Technology Stack
| Layer               | Technology          |
|---------------------|---------------------|
| Programming Language | TypeScript         |
| Web Framework       | Express.js         |
| Database            | PostgreSQL         |
| ORM                 | Prisma             |
| Authentication      | JWT (JSON Web Tokens) |
| Password Hashing    | bcrypt             |
| Validation          | Zod                |

## Roles and Permissions
| Role       | Permissions                                                                 |
|------------|-----------------------------------------------------------------------------|
| **ADOPTER** | Register, browse pets, submit adoption requests, view/update own profile, view own requests. |
| **SHELTER** | Register, add/manage own pets, view/manage requests for their pets, view/update own profile. |
| **ADMIN**   | All shelter permissions + manage all users, pets, and requests; suspend users; remove content. |

## Data Models

### User
| Field       | Type                | Description                          |
|-------------|---------------------|--------------------------------------|
| id (PK)     | UUID                | Unique identifier                    |
| name        | String              | Full name                            |
| email       | String (Unique)     | Email address                        |
| password    | String              | Hashed password                      |
| role        | Enum (ADOPTER, SHELTER, ADMIN) | Defines permissions         |
| isActive    | Boolean             | Account status (default: true)       |
| createdAt   | DateTime            | Creation timestamp                   |
| updatedAt   | DateTime            | Last update timestamp                |

### Pet
| Field                | Type                | Description                          |
|----------------------|---------------------|--------------------------------------|
| id (PK)              | UUID                | Unique identifier                    |
| shelterId (FK)       | UUID                | References User (Shelter)            |
| name                 | String              | Pet’s name                           |
| species              | String              | Dog, Cat, Rabbit, etc.               |
| breed                | String              | Breed                                |
| age                  | Int (≥ 0)           | Age                                  |
| size                 | Enum (Small, Medium, Large) | Size                        |
| location             | String              | Shelter location                     |
| description          | String              | Details about the pet                |
| temperament          | String              | e.g., Friendly, Calm                 |
| medicalHistory       | String              | Vaccines, spay/neuter status         |
| adoptionRequirements | String              | Special conditions                   |
| photos               | String[]            | URLs of pet photos                   |
| isAdopted            | Boolean             | Adoption status (default: false)     |
| isDeleted            | Boolean             | Soft delete flag (default: false)    |
| createdAt            | DateTime            | Creation timestamp                   |
| updatedAt            | DateTime            | Last update timestamp                |

### AdoptionRequest
| Field                 | Type                | Description                          |
|-----------------------|---------------------|--------------------------------------|
| id (PK)               | UUID                | Unique identifier                    |
| adopterId (FK)        | UUID                | References User (Adopter)            |
| petId (FK)            | UUID                | References Pet                       |
| status                | Enum (PENDING, APPROVED, REJECTED) | Request status               |
| petOwnershipExperience| String              | Adopter’s experience                 |
| message               | String (Optional)   | Additional context from adopter      |
| createdAt             | DateTime            | Creation timestamp                   |
| updatedAt             | DateTime            | Last update timestamp                |

### Relationships
- **User**:
  - One-to-many: User (SHELTER) → Pet
  - One-to-many: User (ADOPTER) → AdoptionRequest
- **Pet**:
  - Belongs to: User (SHELTER)
  - One-to-many: Pet → AdoptionRequest
- **AdoptionRequest**:
  - Belongs to: User (ADOPTER)
  - Belongs to: Pet

## API Endpoints
All responses follow this format:
```json
{
  "success": boolean,
  "statusCode": number,
  "message": string,
  "data": object | array,
  "meta": { "page": number, "limit": number, "total": number } // Optional for pagination
}
```
Error responses:
```json
{
  "success": false,
  "statusCode": number,
  "message": string,
  "errors": object | array // Optional
}
```

### Endpoints Overview
| Endpoint                      | Method | Who                            | Purpose                              |
|-------------------------------|--------|--------------------------------|--------------------------------------|
| `/api/register`               | POST   | Anyone                         | Register as ADOPTER or SHELTER       |
| `/api/login`                  | POST   | Anyone                         | Log in                               |
| `/api/profile`                | GET    | All roles                      | View own profile                     |
| `/api/profile`                | PUT    | All roles                      | Update own profile                   |
| `/api/pets`                   | POST   | SHELTER, ADMIN                 | Add a pet                            |
| `/api/pets`                   | GET    | All roles                      | List pets (with filters/pagination)  |
| `/api/pets/:petId`            | GET    | All roles                      | View single pet details              |
| `/api/pets/:petId`            | PUT    | SHELTER (own pets), ADMIN      | Update pet                           |
| `/api/pets/:petId`            | DELETE | SHELTER (own pets), ADMIN      | Soft delete pet                      |
| `/api/adoption-requests`      | POST   | ADOPTER                        | Submit adoption request              |
| `/api/adoption-requests`      | GET    | SHELTER (own pets), ADMIN      | View adoption requests               |
| `/api/adoption-requests/:id`  | PUT    | SHELTER (own pets), ADMIN      | Approve/reject request               |
| `/api/my-requests`            | GET    | ADOPTER                        | View own adoption requests           |
| `/api/users`                  | GET    | ADMIN                          | View all users                       |
| `/api/users/:id`              | PUT    | ADMIN                          | Update/suspend user                  |

### Example Endpoints
#### POST /api/register
**Request**:
```json
{
  "name": "Alice Doe",
  "email": "alice@example.com",
  "password": "strongpassword",
  "role": "ADOPTER"
}
```
**Response**:
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "id": "uuid",
    "name": "Alice Doe",
    "email": "alice@example.com",
    "role": "ADOPTER",
    "isActive": true,
    "createdAt": "2025-07-28T08:59:00Z",
    "updatedAt": "2025-07-28T08:59:00Z"
  }
}
```

#### POST /api/pets
**Headers**: `Authorization: Bearer <JWT>`
**Request**:
```json
{
  "name": "Buddy",
  "species": "Dog",
  "breed": "Labrador",
  "age": 2,
  "size": "Large",
  "location": "Shelter XYZ",
  "description": "Friendly and playful",
  "temperament": "Gentle",
  "medicalHistory": "Vaccinated",
  "adoptionRequirements": "Fenced yard, active family",
  "photos": ["https://example.com/buddy1.jpg"]
}
```
**Response**:
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Pet added successfully",
  "data": {
    "id": "uuid",
    "shelterId": "uuid",
    "name": "Buddy",
    "species": "Dog",
    "breed": "Labrador",
    "age": 2,
    "size": "Large",
    "location": "Shelter XYZ",
    "description": "Friendly and playful",
    "temperament": "Gentle",
    "medicalHistory": "Vaccinated",
    "adoptionRequirements": "Fenced yard, active family",
    "photos": ["https://example.com/buddy1.jpg"],
    "isAdopted": false,
    "isDeleted": false,
    "createdAt": "2025-07-28T08:59:00Z",
    "updatedAt": "2025-07-28T08:59:00Z"
  }
}
```

#### POST /api/adoption-requests
**Headers**: `Authorization: Bearer <JWT>`
**Request**:
```json
{
  "petId": "uuid",
  "petOwnershipExperience": "Owned dogs before",
  "message": "I have a large backyard and love Labradors!"
}
```
**Response**:
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Adoption request submitted",
  "data": {
    "id": "uuid",
    "adopterId": "uuid",
    "petId": "uuid",
    "status": "PENDING",
    "petOwnershipExperience": "Owned dogs before",
    "message": "I have a large backyard and love Labradors!",
    "createdAt": "2025-07-28T08:59:00Z",
    "updatedAt": "2025-07-28T08:59:00Z"
  }
}
```

#### GET /api/pets/:petId
**Headers**: `Authorization: Bearer <JWT>`
**Response**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Pet retrieved successfully",
  "data": {
    "id": "uuid",
    "shelterId": "uuid",
    "name": "Buddy",
    "species": "Dog",
    "breed": "Labrador",
    "age": 2,
    "size": "Large",
    "location": "Shelter XYZ",
    "description": "Friendly and playful",
    "temperament": "Gentle",
    "medicalHistory": "Vaccinated",
    "adoptionRequirements": "Fenced yard, active family",
    "photos": ["https://example.com/buddy1.jpg"],
    "isAdopted": false,
    "isDeleted": false,
    "createdAt": "2025-07-28T08:59:00Z",
    "updatedAt": "2025-07-28T08:59:00Z"
  }
}
```

## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd pawconnect
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/pawconnect?schema=public"
   JWT_SECRET="your_jwt_secret"
   PORT=3000
   ```

4. **Run Database Migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start the Server**:
   ```bash
   npm run dev
   ```

6. **Access the API**:
   The API will be available at `http://localhost:3000`.

## RBAC Logic
Role-Based Access Control (RBAC) is implemented using JWT and Express middleware:
- **Authentication**: All endpoints except `/api/register` and `/api/login` require a valid JWT in the `Authorization: Bearer <JWT>` header.
- **Authorization**:
  - **ADOPTER**: Can only access own profile, submit adoption requests, and view own requests.
  - **SHELTER**: Can manage own pets and related adoption requests.
  - **ADMIN**: Has full access to all resources, including user suspension and content moderation.
- **Ownership Check**: For endpoints like `PUT /api/pets/:petId`, shelters can only modify their own pets, enforced via middleware (`restrictToPetOwner`).

Example middleware:
```typescript
export const restrictTo = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: 'Forbidden: Insufficient permissions',
      });
    }
    next();
  };
};
```

## Special Features
- **Adoption Workflow**: When an adoption request is approved, the pet’s `isAdopted` flag is set to `true`, and other pending requests are rejected.
- **Soft Deletion**: Pets and users have `isDeleted` and `isActive` flags for data retention.
- **Pet Photos**: Supports multiple photo URLs per pet.
- **Notifications**: Sends email/system notifications on adoption request creation and status updates (to be implemented).
- **Filtering and Pagination**: `GET /api/pets` supports filters (species, breed, age, location, searchTerm) and pagination.

## Future Enhancements
- **Frontend**: Build a React frontend with Tailwind CSS for a user-friendly interface.
- **Testing**: Add Jest for unit and integration tests.
- **Deployment**: Deploy backend on Render/Heroku and frontend on Netlify.
- **OpenAPI**: Provide an OpenAPI specification for API documentation.
- **Rate Limiting**: Implement rate limiting to prevent abuse.

## Contributing
Contributions are welcome! Please:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit changes (`git commit -m 'Add YourFeature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

For issues or suggestions, please open an issue on the repository.

---
Built with 🐾 by [Your Name]