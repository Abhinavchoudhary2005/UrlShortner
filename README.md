# 🔗 URL Shortener

A full-stack URL shortening platform built with **Java Spring Boot** and **React**.

The application allows users to create shortened URLs, use custom aliases, configure expiration dates, track clicks, view analytics, and manage their URLs through a responsive web interface.

It also includes **JWT authentication, role-based authorization, Redis caching, PostgreSQL persistence, and an Admin Dashboard**.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [URL Shortening](#-url-shortening)
- [Custom Aliases](#-custom-aliases)
- [URL Expiration](#-url-expiration)
- [Redis Caching](#-redis-caching)
- [Analytics](#-analytics)
- [Authentication](#-authentication)
- [Role-Based Authorization](#-role-based-authorization)
- [Admin Dashboard](#-admin-dashboard)
- [API Documentation](#-api-documentation)
- [Database Structure](#-database-structure)
- [Backend Setup](#-backend-setup)
- [Frontend Setup](#-frontend-setup)
- [Environment Variables](#-environment-variables)
- [Running the Complete Application](#-running-the-complete-application)
- [Frontend Routes](#-frontend-routes)
- [Production Configuration](#-production-configuration)
- [Security](#-security)
- [Production Build](#-production-build)
- [Docker](#-docker)
- [Current Limitations](#-current-limitations)
- [Future Improvements](#-future-improvements)
- [Troubleshooting](#-troubleshooting)
- [Project Status](#-project-status)
- [Author](#-author)

---

# 🚀 Overview

This project is a full-stack URL shortening application similar in concept to services such as Bitly.

Users can:

- Register and login
- Create shortened URLs
- Generate automatic short codes
- Create custom aliases
- Set URL expiration dates
- View their shortened URLs
- Search and filter URLs
- Copy shortened URLs
- Open shortened URLs
- Track clicks
- View analytics

Administrators have access to a dedicated dashboard for monitoring users, URLs, and overall application statistics.

The backend uses **PostgreSQL** for persistent data storage and **Redis** for high-speed URL caching.

---

# ✨ Features

## 👤 User Features

### Authentication

- User registration
- User login
- BCrypt password hashing
- JWT authentication
- JWT expiration
- Role-based authorization
- Protected API endpoints

### URL Shortening

- Automatic Base62 short-code generation
- Custom aliases
- URL expiration
- Original URL storage
- Click counting
- Redis caching

### URL Management

- View all URLs created by the logged-in user
- Search URLs
- Filter URLs
- Copy shortened URLs
- Open shortened URLs
- View expiration status
- View analytics

### Analytics

Track:

- Total clicks
- Unique visitors
- First click
- Last click
- Click timestamp
- IP address
- User agent
- Referrer

---

# 👑 Admin Features

Users with the `ADMIN` role can access the Admin Dashboard.

The dashboard provides:

### Statistics

- Total users
- Total URLs
- Total clicks

### Users

- User ID
- Email
- Role

### URLs

- URL ID
- Original URL
- Short code
- Click count

Admin endpoints are protected by Spring Security.

---

# 🛠️ Tech Stack

## Backend

| Technology | Purpose |
|---|---|
| Java 21 | Programming language |
| Spring Boot | Backend framework |
| Spring Web | REST APIs |
| Spring Data JPA | Database access |
| Hibernate | ORM |
| PostgreSQL | Primary database |
| Neon | Cloud PostgreSQL |
| Spring Security | Authentication and authorization |
| JWT | Stateless authentication |
| BCrypt | Password hashing |
| Spring Data Redis | Redis integration |
| Upstash Redis | Cloud Redis |
| Maven | Dependency management |
| Lombok | Boilerplate reduction |
| Spring Boot Actuator | Health monitoring |

## Frontend

| Technology | Purpose |
|---|---|
| React | Frontend framework |
| Vite | Build tool |
| JavaScript | Programming language |
| React Router | Client-side routing |
| Axios | HTTP client |
| Tailwind CSS | Styling |

---

# 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      React          │
                    │      Frontend       │
                    │      Vite           │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │    Spring Boot      │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
        ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
        │ PostgreSQL   │ │    Redis     │ │     JWT      │
        │    Neon      │ │   Upstash    │ │  Security    │
        └──────────────┘ └──────────────┘ └──────────────┘
```

---

# 📁 Project Structure

```text
URL Shortner/
│
├── README.md
│
├── urlshortener/
│   │
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── .gitignore
│   ├── .env.example
│   │
│   └── src/
│       └── main/
│           ├── java/
│           │   └── com/
│           │       └── abhinav/
│           │           └── demo/
│           │               │
│           │               ├── UrlshortenerApplication.java
│           │               │
│           │               ├── config/
│           │               │   ├── CorsConfig.java
│           │               │   ├── PasswordConfig.java
│           │               │   └── SecurityConfig.java
│           │               │
│           │               ├── controller/
│           │               │   ├── AuthController.java
│           │               │   ├── UrlController.java
│           │               │   ├── RedirectController.java
│           │               │   └── AdminController.java
│           │               │
│           │               ├── dto/
│           │               │   ├── RegisterRequest.java
│           │               │   ├── LoginRequest.java
│           │               │   ├── LoginResponse.java
│           │               │   ├── UserResponse.java
│           │               │   ├── UrlResponse.java
│           │               │   ├── ClickAnalyticsResponse.java
│           │               │   └── AnalyticsSummaryResponse.java
│           │               │
│           │               ├── entity/
│           │               │   ├── User.java
│           │               │   ├── Url.java
│           │               │   └── Click.java
│           │               │
│           │               ├── repository/
│           │               │   ├── UserRepository.java
│           │               │   ├── UrlRepository.java
│           │               │   └── ClickRepository.java
│           │               │
│           │               ├── security/
│           │               │   └── JwtAuthenticationFilter.java
│           │               │
│           │               └── service/
│           │                   ├── JwtService.java
│           │                   └── UrlService.java
│           │
│           └── resources/
│               └── application.yml
│
└── frontend/
    │
    ├── package.json
    ├── vite.config.js
    ├── .gitignore
    ├── .env.example
    │
    └── src/
        ├── main.jsx
        ├── index.css
        ├── App.jsx
        │
        ├── components/
        │   └── Navbar.jsx
        │
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx
        │   ├── MyUrls.jsx
        │   ├── Analytics.jsx
        │   └── AdminDashboard.jsx
        │
        └── services/
            └── api.js
```

---

# 🔗 How It Works

The application follows this flow:

```text
User
 │
 ▼
React Frontend
 │
 │ REST API
 ▼
Spring Boot
 │
 ├───────────────┐
 ▼               ▼
PostgreSQL      Redis
 │               │
 ▼               ▼
Persistent      Cached
Data            URLs
```

---

# 🔗 URL Shortening

The application uses **Base62 encoding** to generate short codes.

The Base62 character set is:

```text
0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
```

When a URL is created:

```text
Original URL
     │
     ▼
PostgreSQL
     │
     ▼
Database ID
     │
     ▼
Base62 Encoding
     │
     ▼
Short Code
     │
     ▼
Redis Cache
```

Example:

```text
Database ID
     12345
       │
       ▼
     Base62
       │
       ▼
      3d7
```

Result:

```text
http://localhost:8080/3d7
```

In production:

```text
https://your-domain.com/3d7
```

---

# 🏷️ Custom Aliases

Users can optionally provide their own alias.

Example:

```text
Original URL:
https://example.com/products/summer-sale

Custom Alias:
summer-sale
```

Result:

```text
http://localhost:8080/summer-sale
```

The backend checks whether the alias already exists before creating the URL.

---

# ⏰ URL Expiration

Users can optionally specify an expiration date.

Example:

```text
Expiration:
2026-12-31 23:59
```

After expiration, the backend prevents the URL from being redirected.

Redis caching also uses a TTL based on the URL expiration time.

---

# ⚡ Redis Caching

Redis is used to reduce database queries when resolving shortened URLs.

Cache keys follow this format:

```text
url:<shortCode>
```

Example:

```text
url:abc123
```

The cached value is the original URL.

### Cache Flow

```text
User opens /abc123
        │
        ▼
      Redis
        │
   ┌────┴────┐
   │         │
  HIT      MISS
   │         │
   ▼         ▼
Original   PostgreSQL
  URL          │
              ▼
            Redis
              │
              ▼
          Original URL
```

For URLs with expiration dates, Redis receives a TTL matching the remaining lifetime of the URL.

---

# 📊 Analytics

Every successful click can create an analytics record.

The application tracks:

```text
Click
├── ID
├── clickedAt
├── ipAddress
├── userAgent
├── referrer
└── URL
```

Analytics summary provides:

```text
Total Clicks
Unique Visitors
First Click
Last Click
```

The frontend also displays click activity grouped by date.

---

# 🔐 Authentication

The application uses JWT-based authentication.

## Registration

```text
React
  │
  │ POST /api/auth/register
  ▼
Spring Boot
  │
  ▼
BCrypt Password Hash
  │
  ▼
PostgreSQL
```

Passwords are never stored as plain text.

---

## Login

```text
React
  │
  │ email + password
  ▼
Spring Boot
  │
  ▼
BCrypt Verification
  │
  ▼
JWT Generated
  │
  ▼
React
```

The frontend stores:

```text
token
email
role
```

Authenticated Axios requests include:

```http
Authorization: Bearer <JWT>
```

---

# 👑 Role-Based Authorization

Users can have roles such as:

```text
USER
ADMIN
```

Admin APIs require the `ADMIN` role.

Backend protection:

```text
/api/admin/**
```

Frontend protection:

```text
/admin
```

---

# 👑 Admin Dashboard

The Admin Dashboard is available at:

```text
/admin
```

It displays:

```text
┌─────────────────────────────────────┐
│         Admin Dashboard             │
├─────────────┬─────────────┬─────────┤
│ Total Users │ Total URLs  │ Clicks  │
└─────────────┴─────────────┴─────────┘
```

It also displays tables containing users and shortened URLs.

---

# 🌐 API Documentation

## Authentication

### Register

```http
POST /api/auth/register
```

Request:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

### Login

```http
POST /api/auth/login
```

Request:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

# 🔗 URL APIs

### Create URL

```http
POST /api/urls
```

Authentication required.

Request:

```json
{
  "originalUrl": "https://example.com",
  "customAlias": "example",
  "expiresAt": null
}
```

---

### Get My URLs

```http
GET /api/urls/my
```

Authentication required.

---

### Get URL Information

```http
GET /api/urls/info/{shortCode}
```

Example:

```http
GET /api/urls/info/abc123
```

---

# 📈 Analytics APIs

### Get Click Details

```http
GET /api/urls/analytics/{shortCode}
```

Authentication required.

The authenticated user must own the URL.

---

### Get Analytics Summary

```http
GET /api/urls/analytics/{shortCode}/summary
```

Example response:

```json
{
  "totalClicks": 14,
  "uniqueVisitors": 1,
  "firstClick": "2026-09-29T10:20:00",
  "lastClick": "2026-09-29T20:45:00"
}
```

---

# ↪️ URL Redirect

Short URLs are publicly accessible.

```http
GET /{shortCode}
```

Example:

```http
GET /abc123
```

The backend resolves the short code and redirects the visitor to the original URL.

The click is also recorded for analytics.

---

# 👑 Admin APIs

### Dashboard

```http
GET /api/admin/dashboard
```

### Users

```http
GET /api/admin/users
```

### URLs

```http
GET /api/admin/urls
```

### Statistics

```http
GET /api/admin/stats
```

Example:

```json
{
  "totalUsers": 10,
  "totalUrls": 25,
  "totalClicks": 150
}
```

All admin endpoints require the `ADMIN` role.

---

# 🗄️ Database Structure

The application currently uses three primary entities.

## User

```text
users
├── id
├── email
├── password
└── role
```

Relationship:

```text
User 1 ─────────── N Url
```

---

## URL

```text
url
├── id
├── originalUrl
├── shortCode
├── customAlias
├── clickCount
├── expiresAt
└── user_id
```

---

## Click

```text
url_clicks
├── id
├── clickedAt
├── ipAddress
├── userAgent
├── referrer
└── url_id
```

Relationship:

```text
Url 1 ─────────── N Click
```

---

# 💻 Backend Setup

## Requirements

Install:

- Java 21
- Git
- Internet connection
- Neon PostgreSQL account
- Upstash Redis account

The project uses Maven Wrapper, so Maven does not need to be installed globally.

---

## Clone Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Enter the project:

```bash
cd "URL Shortner"
```

Enter the backend:

```bash
cd urlshortener
```

---

# 🔐 Backend Environment Variables

The backend requires:

```text
NEON_DB_URL
NEON_DB_USERNAME
NEON_DB_PASSWORD

REDIS_HOST
REDIS_PORT
REDIS_USERNAME
REDIS_PASSWORD

JWT_SECRET
```

Example:

```env
NEON_DB_URL=jdbc:postgresql://your-host/neondb?sslmode=require&channel_binding=require
NEON_DB_USERNAME=neondb_owner
NEON_DB_PASSWORD=your-password

REDIS_HOST=your-upstash-host
REDIS_PORT=6379
REDIS_USERNAME=default
REDIS_PASSWORD=your-password

JWT_SECRET=your-long-random-secret
```

Do not commit real credentials.

Use `.env.example` as the configuration template.

---

# ▶️ Run Backend

On Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

Backend:

```text
http://localhost:8080
```

---

# ❤️ Health Check

```http
GET /actuator/health
```

Open:

```text
http://localhost:8080/actuator/health
```

Expected:

```json
{
  "status": "UP"
}
```

---

# 🎨 Frontend Setup

Enter the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

---

# 🔐 Frontend Environment Variables

Create:

```text
frontend/.env
```

For local development:

```env
VITE_API_URL=http://localhost:8080
```

The frontend uses:

```js
import.meta.env.VITE_API_URL
```

for API requests and shortened URL generation.

Do not commit `.env`.

Use:

```text
frontend/.env.example
```

instead.

Example:

```env
VITE_API_URL=http://localhost:8080
```

---

# ▶️ Run Frontend

```bash
npm run dev
```

Vite will start the development server at:

```text
http://localhost:5173
```

---

# 🔄 Run Complete Application

Two terminals are required.

## Terminal 1 — Backend

```powershell
cd "URL Shortner\urlshortener"

.\mvnw.cmd spring-boot:run
```

Backend:

```text
http://localhost:8080
```

---

## Terminal 2 — Frontend

```powershell
cd "URL Shortner\frontend"

npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🖥️ Frontend Routes

| Route | Description |
|---|---|
| `/login` | Login |
| `/register` | Registration |
| `/dashboard` | Create shortened URLs |
| `/my-urls` | Manage URLs |
| `/analytics/:shortCode` | URL analytics |
| `/admin` | Admin dashboard |

---

# 🧪 Application Flow

```text
Register
   ↓
Login
   ↓
JWT Token
   ↓
Dashboard
   ↓
Create URL
   ↓
Base62 Short Code
   ↓
PostgreSQL
   ↓
Redis Cache
   ↓
Open Short URL
   ↓
Redirect
   ↓
Record Click
   ↓
Analytics
```

---

# ⚙️ Production Configuration

Before deployment, configure production environment variables:

```text
VITE_API_URL

NEON_DB_URL
NEON_DB_USERNAME
NEON_DB_PASSWORD

REDIS_HOST
REDIS_PORT
REDIS_USERNAME
REDIS_PASSWORD

JWT_SECRET
```

Production secrets should be configured through the deployment platform's environment-variable settings.

Never commit production credentials to GitHub.

---

# 🔒 Security

The project includes:

- BCrypt password hashing
- JWT authentication
- JWT expiration
- Stateless Spring Security sessions
- Role-based authorization
- Protected user APIs
- Protected admin APIs
- CORS configuration
- Environment-based secrets
- Password exclusion from JSON responses

---

# 🏭 Production Build

## Backend

```powershell
.\mvnw.cmd clean package
```

Run the generated JAR:

```powershell
java -jar target/<application-name>.jar
```

---

## Frontend

Build:

```bash
npm run build
```

Production files are generated inside:

```text
dist/
```

Preview:

```bash
npm run preview
```

---

# 🐳 Docker

Docker support can be added for:

- Spring Boot backend
- React frontend

The application uses managed services for:

- PostgreSQL → Neon
- Redis → Upstash

Therefore PostgreSQL and Redis do not need to run inside the application containers.

---

# ⚠️ Current Limitations

The following features are currently deferred:

- Rate limiting
- Scheduled cleanup of expired URLs
- Automated tests
- URL deletion
- Production deployment
- Docker deployment

---

# 🔮 Future Improvements

Potential future features:

- Delete URLs
- Edit URLs
- Advanced analytics
- Geographic analytics
- Device analytics
- Browser analytics
- QR code generation
- Password-protected links
- Bulk URL creation
- CSV upload
- UTM builder
- Custom domains
- API keys
- Rate limiting
- Scheduled cleanup
- Email notifications
- OpenAPI / Swagger
- JUnit tests
- Mockito tests
- Integration tests
- Docker deployment
- CI/CD pipeline
- Dark mode

---

# 🐛 Troubleshooting

## Frontend cannot connect to backend

Check:

```env
VITE_API_URL=http://localhost:8080
```

Restart Vite:

```bash
npm run dev
```

---

## CORS Error

Verify that the backend CORS configuration allows:

```text
http://localhost:5173
```

Restart Spring Boot after modifying CORS configuration.

---

## 401 Unauthorized

Check:

- User is logged in
- JWT exists
- JWT has not expired
- Axios is sending the Authorization header

Expected:

```http
Authorization: Bearer <JWT>
```

---

## 403 Forbidden

For admin access, verify that the user's role is:

```text
ADMIN
```

After changing the role in the database, log out and log in again so a new JWT containing the updated role is generated.

---

## Redis Connection Error

Check:

```text
REDIS_HOST
REDIS_PORT
REDIS_USERNAME
REDIS_PASSWORD
```

Also verify that TLS is enabled for the Upstash Redis connection.

---

## PostgreSQL Connection Error

Check:

```text
NEON_DB_URL
NEON_DB_USERNAME
NEON_DB_PASSWORD
```

Make sure the Neon database is active and accessible.

---

# 📊 Project Status

## Completed

- [x] Spring Boot backend
- [x] React frontend
- [x] PostgreSQL database
- [x] Neon cloud database
- [x] Redis caching
- [x] Upstash Redis
- [x] JWT authentication
- [x] BCrypt password hashing
- [x] Role-based authorization
- [x] Admin dashboard
- [x] Base62 URL shortening
- [x] Custom aliases
- [x] URL expiration
- [x] Click tracking
- [x] Analytics
- [x] Search and filtering
- [x] Copy shortened URLs
- [x] Responsive frontend
- [x] Environment-based configuration

## Deferred

- [ ] Rate limiting
- [ ] Scheduled cleanup
- [ ] Automated testing
- [ ] URL deletion
- [ ] Docker
- [ ] Production deployment
- [ ] CI/CD

---

# 👨‍💻 Author

## Abhinav Choudhary

**B.Tech Information Technology**

Priyadarshini College of Engineering, Nagpur

---

# 📄 License

This project is intended for educational, portfolio, and demonstration purposes.

Add an appropriate open-source license, such as MIT, if you plan to distribute the project publicly.
