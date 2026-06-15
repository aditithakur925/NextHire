# SOFTWARE REQUIREMENTS SPECIFICATION

# AI-Powered Job Portal
### with ATS Resume Analysis · AI Auto Apply · Subscription Management

---

| Field | Details |
|---|---|
| Version | 1.0 — Improved & Detailed |
| Status | Final |
| AI Provider | Google Gemini (`gemini-1.5-flash`) |
| Stack | React · Node.js · MongoDB · Socket.io |
| Payment | Razorpay |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Database Design](#4-database-design)
5. [Functional Requirements](#5-functional-requirements)
6. [AI Integration Specification](#6-ai-integration-specification-google-gemini)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Business Rules](#8-business-rules)
9. [Error Handling and Edge Cases](#9-error-handling-and-edge-cases)
10. [Recommended Project Structure](#10-recommended-project-structure)
11. [Future Enhancements](#11-future-enhancements-post-v10)
12. [Revision History](#12-revision-history)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) defines the complete functional and non-functional requirements for an AI-Powered Job Portal — a full-stack web application that connects job seekers and recruiters through an intelligent, automated platform.

The platform leverages Google Gemini AI for resume analysis, optimization, and cover letter generation. It provides ATS-based scoring, intelligent job matching, automated application submission, and a subscription-based monetization model with separate plans for candidates and recruiters.

This document serves as the definitive technical reference for frontend developers, backend developers, AI integration engineers, database architects, and QA engineers working on this project.

### 1.2 Project Scope

The system is a multi-role web application with three primary user types:

- **Candidates** — job seekers who upload resumes, receive AI feedback, and apply to jobs
- **Recruiters** — employers who post jobs, manage applications, and search candidates
- **Admins** — platform operators who manage users, subscriptions, payments, and reports

Core platform capabilities:

- AI-powered resume parsing and ATS scoring using Google Gemini
- Job readiness assessment and intelligent job recommendations
- AI Cover Letter Generator personalized per job posting
- Automated job application system (AI Auto Apply)
- Real-time notifications via Socket.io
- Subscription management with Razorpay payment gateway
- Separate paid plans for candidates and recruiters
- Admin dashboard with analytics and moderation tools

### 1.3 Definitions and Acronyms

| Term / Acronym | Definition |
|---|---|
| ATS | Applicant Tracking System — software that scans and ranks resumes based on keyword and format criteria |
| AI | Artificial Intelligence — used here to refer to Google Gemini-based language model capabilities |
| Gemini | Google's multimodal large language model used for resume analysis, suggestions, and cover letter generation |
| JWT | JSON Web Token — a signed token used for stateless authentication between client and server |
| RBAC | Role-Based Access Control — restricting system access based on assigned user roles |
| FR | Functional Requirement — a specific behavior or function the system must perform |
| NFR | Non-Functional Requirement — quality attributes such as performance, security, and scalability |
| ATS Score | A percentage score indicating how well a resume matches ATS parsing criteria |
| Job Match Score | A percentage indicating compatibility between a candidate's profile and a specific job listing |
| Job Readiness Score | A composite score assessing overall employability based on profile, resume, and skills data |
| Auto Apply | An automated system that applies to jobs on the candidate's behalf based on match thresholds |
| Socket.io | A JavaScript library for real-time, bidirectional event-based communication |
| BullMQ | A Node.js queue library backed by Redis, used for background job processing |
| Razorpay | Indian payment gateway used for processing subscription payments |
| Cloudinary | Cloud media storage and transformation service for resume and profile image uploads |
| Mongoose | An ODM (Object Data Modeling) library for MongoDB and Node.js |
| RTK | Redux Toolkit — the recommended toolset for Redux state management in React |
| GDPR | General Data Protection Regulation — data privacy regulation standards applied for best practice |
| OTP | One-Time Password — used for email verification and 2FA flows |
| SLA | Service Level Agreement — defined performance and availability targets |

### 1.4 Document Conventions

- **Must Have** — Core features required for a functional v1.0 release
- **Should Have** — Important features that significantly improve user experience
- **Nice to Have** — Future enhancements planned for subsequent versions
- **FR-XX** — Functional Requirement identifier used for traceability
- **NFR-XX** — Non-Functional Requirement identifier

---

## 2. Technology Stack

### 2.1 Frontend

| Technology | Version | Purpose | Notes |
|---|---|---|---|
| React.js | 18.x | UI component library | Use functional components and hooks exclusively |
| Vite | 5.x | Build tool and dev server | Replaces Create React App — faster HMR and build |
| Redux Toolkit (RTK) | 2.x | Global state management | Use `createSlice`, `createAsyncThunk`. Avoid legacy Redux patterns |
| RTK Query | 2.x | Server state / API caching | For all API calls — built into RTK, replaces React Query |
| React Router DOM | 6.x | Client-side routing | Use `createBrowserRouter` with data loaders |
| Tailwind CSS | 3.x | Utility-first CSS framework | Primary styling solution — no Bootstrap or MUI |
| shadcn/ui | latest | Accessible UI component library | Built on Radix UI — use for dialogs, dropdowns, toasts |
| Axios | 1.x | HTTP client | Use with RTK Query baseQuery; also for one-off requests |
| React Hook Form | 7.x | Form state management and validation | Pair with Zod for schema validation |
| Zod | 3.x | Schema validation | Validate all form inputs and API response shapes |
| Socket.io-client | 4.x | Real-time communication client | Connect to Socket.io server for live notifications |
| Recharts | 2.x | Data visualization / charts | For admin dashboards and analytics |
| React PDF Viewer | latest | In-browser PDF preview | For resume preview on candidate dashboard |
| Lucide React | latest | Icon library | Consistent icon set — do not mix with other icon sets |
| date-fns | 3.x | Date utility library | Lightweight alternative to moment.js |
| Framer Motion | 11.x | Animations | Page transitions and micro-interactions |

### 2.2 Backend

| Technology | Version | Purpose | Notes |
|---|---|---|---|
| Node.js | 20.x LTS | JavaScript runtime | Use ES Modules (`import`/`export`) syntax throughout |
| Express.js | 4.x | HTTP web framework | RESTful API server with middleware pipeline |
| Socket.io | 4.x | Real-time server | Namespaced rooms per user for notifications |
| Mongoose | 8.x | MongoDB ODM | Define schemas with `strict: true`; use virtuals for computed fields |
| JWT (`jsonwebtoken`) | 9.x | Authentication tokens | Access token 15 min TTL; refresh token 7 days in `httpOnly` cookie |
| bcryptjs | 2.x | Password hashing | Salt rounds: 12 |
| Multer | 1.x | File upload middleware | Memory storage — pass buffer directly to Cloudinary |
| Cloudinary SDK | 1.x | Cloud file storage | Resumes (PDF), profile images, company logos |
| pdf-parse | 1.x | PDF text extraction | Extract raw text from uploaded resume PDFs before sending to Gemini |
| mammoth | 1.x | DOCX text extraction | Extract raw text from DOCX resumes |
| `@google/generative-ai` | latest | Google Gemini SDK | `gemini-1.5-flash` for ATS analysis, suggestions, cover letters |
| Razorpay Node SDK | 2.x | Payment processing | Create orders, verify signatures, manage subscriptions |
| Nodemailer | 6.x | Email sending | Transactional emails — configure with Gmail or SendGrid SMTP |
| express-validator | 7.x | Request validation | Validate and sanitize all incoming request bodies |
| cors | 2.x | CORS middleware | Restrict origins to frontend domain in production |
| helmet | 7.x | HTTP security headers | Sets CSP, HSTS, X-Frame-Options automatically |
| express-rate-limit | 7.x | Rate limiting middleware | Global and per-route rate limiting to prevent abuse |
| morgan | 1.x | HTTP request logging | Combined format in production; dev format locally |
| dotenv | 16.x | Environment variable management | Never commit `.env` files — use `.env.example` as template |
| node-cron | 3.x | Scheduled tasks | Auto Apply scheduler and subscription expiry checker |

### 2.3 Database

| Technology | Version | Purpose | Notes |
|---|---|---|---|
| MongoDB | 7.x | Primary NoSQL database | Atlas free tier for dev; dedicated cluster for production |
| Mongoose | 8.x | Schema modeling and validation | All collections defined with explicit schemas — no schemaless usage |
| MongoDB Atlas | Cloud | Managed database hosting | Enable Atlas Search for full-text job search functionality |
| Redis (Upstash) | Cloud / 7.x | Caching and session store | Cache job recommendations, ATS results; store refresh token allowlist |

### 2.4 AI / ML Layer

| Technology | Purpose | Model | Notes |
|---|---|---|---|
| Google Gemini API | Resume ATS analysis and scoring | `gemini-1.5-flash` | Structured JSON output mode for consistent scoring |
| Google Gemini API | Resume improvement suggestions | `gemini-1.5-flash` | Prompt includes job role context when available |
| Google Gemini API | AI Cover Letter Generator | `gemini-1.5-flash` | Input: resume text + job description; output: formatted letter |
| Google Gemini API | Skill gap analysis | `gemini-1.5-flash` | Compare extracted skills vs. job requirement keywords |
| Google Gemini API | Job readiness summary | `gemini-1.5-flash` | Composite narrative based on scoring inputs |
| pdf-parse + mammoth | Resume text extraction | N/A (deterministic) | Pre-process before sending to Gemini to reduce token usage |
| Keyword matching (custom) | Job recommendation engine | N/A | TF-IDF style keyword scoring on resume vs. job descriptions |

### 2.5 DevOps & Infrastructure

| Tool / Service | Purpose | Notes |
|---|---|---|
| Git + GitHub | Version control | Feature branch workflow; main branch protected; PRs required |
| GitHub Actions | CI/CD pipeline | Lint, test, and build on every PR; auto-deploy on merge to main |
| ESLint + Prettier | Code quality and formatting | Enforce consistent style across frontend and backend |
| Jest | Unit and integration testing | Backend route and service tests; target 70%+ coverage |
| Vitest + React Testing Library | Frontend component tests | Test critical user flows and components |
| Postman / Insomnia | API documentation and testing | Export collection to docs — publish as part of portfolio |
| Swagger (`swagger-ui-express`) | Auto-generated API docs | Annotate all Express routes with JSDoc Swagger comments |
| Render | Backend deployment (recommended) | Free tier sufficient for portfolio; auto-deploy from GitHub |
| Vercel | Frontend deployment (recommended) | Automatic Vite build and global CDN deployment |
| MongoDB Atlas | Database hosting | M0 free tier for portfolio; connection string via environment variable |
| Cloudinary | File storage (CDN-backed) | Free tier: 25 GB storage, 25 GB monthly bandwidth |
| Upstash Redis | Redis hosting (serverless) | Free tier: 10,000 commands/day — sufficient for portfolio load |
| Docker | Optional containerization | Include `Dockerfile` and `docker-compose.yml` for local dev setup |

### 2.6 Security Libraries

| Library | Purpose |
|---|---|
| helmet | Sets secure HTTP response headers (CSP, HSTS, X-Frame-Options, etc.) |
| express-rate-limit | Rate limits all API endpoints; stricter limits on auth and payment routes |
| bcryptjs | Password hashing with configurable salt rounds (default: 12) |
| jsonwebtoken | Signs and verifies JWT access tokens (HS256 algorithm) |
| validator.js (via express-validator) | Sanitizes and validates all user input to prevent injection attacks |
| crypto (Node.js built-in) | Generates secure random tokens for email verification and password reset |

---

## 3. System Architecture

### 3.1 Architecture Overview

The system follows a client-server architecture with a RESTful API backend, real-time layer via Socket.io, and a separate AI processing pipeline. The architecture is organized into six distinct layers:

| Layer | Technology | Responsibility |
|---|---|---|
| Presentation | React 18 + Vite + Tailwind CSS + shadcn/ui | User interface, client-side routing, state management |
| API Gateway | Express.js + helmet + express-rate-limit | Route handling, auth middleware, input validation, CORS |
| Business Logic | Express.js services + node-cron | Core application logic, job matching, subscription enforcement |
| Real-Time | Socket.io (server + client) | Live notifications: application status, auto-apply results, messages |
| AI Processing | Google Gemini API + pdf-parse + mammoth | Resume parsing, ATS scoring, suggestions, cover letters |
| Data | MongoDB Atlas + Mongoose + Upstash Redis | Persistent storage, caching, session management |
| Storage | Cloudinary | Resume files (PDF/DOCX), profile images, company logos |
| Payments | Razorpay | Order creation, payment verification, webhook handling |

### 3.2 API Design Conventions

All backend routes follow RESTful conventions. The base URL format is:

```
/api/v1/{resource}/{id?}/{sub-resource?}
```

| Route Prefix | Resource |
|---|---|
| `/api/v1/auth` | Authentication (register, login, logout, refresh, verify email, reset password) |
| `/api/v1/candidates` | Candidate profile management |
| `/api/v1/resumes` | Resume upload, ATS analysis, history |
| `/api/v1/jobs` | Job listings — search, view, filter, apply |
| `/api/v1/applications` | Application tracking — candidate and recruiter views |
| `/api/v1/auto-apply` | Auto Apply configuration and history |
| `/api/v1/recruiters` | Recruiter profile and company management |
| `/api/v1/subscriptions` | Plan management, purchase, status |
| `/api/v1/payments` | Payment orders, verification, history, webhooks |
| `/api/v1/admin` | Admin-only routes — user management, reports |
| `/api/v1/notifications` | User notification list and read status |

### 3.3 Authentication Flow

The system uses a dual-token authentication strategy:

- **Access Token** — JWT signed with HS256. Expiry: 15 minutes. Sent in `Authorization` header as `Bearer` token.
- **Refresh Token** — JWT stored as `httpOnly`, `Secure`, `SameSite=Strict` cookie. Expiry: 7 days. Used to silently re-issue access tokens.
- **Token Rotation** — On every refresh token use, a new refresh token is issued and the old one is invalidated in Redis.
- **Google OAuth 2.0** — Implemented via Passport.js google strategy. On success, a new user is created or existing user is returned, and the standard JWT pair is issued.
- **Email Verification** — A 6-digit OTP is generated using `crypto.randomInt()` and stored in Redis with a 10-minute TTL. Sent via Nodemailer.

### 3.4 Real-Time Architecture (Socket.io)

Socket.io is used exclusively for real-time, server-to-client notifications. Clients do not emit events to the server via Socket.io — all data mutations go through the REST API.

**Connection and room strategy:**

- On login, the client connects to the Socket.io server and joins a private room named after their `userId`.
- The server emits events to that room when relevant actions occur (application status change, auto-apply result, payment confirmation, new message from recruiter).
- Socket.io authentication middleware verifies the JWT on every connection attempt.
- Rooms are user-scoped — no broadcast events are used except for admin announcements.

**Event catalog:**

| Event Name | Direction | Payload | Trigger |
|---|---|---|---|
| `notification:new` | Server → Client | `{ id, type, message, data, createdAt }` | Any server-side event |
| `application:status_changed` | Server → Client | `{ applicationId, jobTitle, newStatus }` | Recruiter updates application status |
| `autoapply:completed` | Server → Client | `{ applied: number, skipped: number }` | Auto-apply cron job finishes a batch |
| `payment:confirmed` | Server → Client | `{ planName, expiresAt }` | Razorpay webhook confirms successful payment |

---

## 4. Database Design

### 4.1 Design Principles

- All collections use Mongoose schemas with `strict: true` to prevent unintended fields.
- All documents include `createdAt` and `updatedAt` via Mongoose `timestamps` option.
- ObjectId references use Mongoose `populate()` sparingly — prefer embedding for frequently co-accessed data.
- Index all fields used in query filters, sorts, and lookups.
- Soft-delete pattern: documents are marked `isDeleted: true` rather than physically removed (except payment records, which are immutable).

### 4.2 Collections

#### 4.2.1 Users

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB default |
| `name` | String | Yes | Min 2, Max 100 characters |
| `email` | String | Yes | Unique; lowercase; indexed |
| `password` | String | Conditional | Null for Google OAuth users; bcrypt hashed (12 rounds) |
| `phone` | String | No | E.164 format (`+91XXXXXXXXXX`) |
| `role` | Enum | Yes | `'candidate'` \| `'recruiter'` \| `'admin'` — indexed |
| `avatar` | String | No | Cloudinary URL |
| `isEmailVerified` | Boolean | Yes | Default: `false`; must be `true` before accessing premium features |
| `authProvider` | Enum | Yes | `'local'` \| `'google'` |
| `googleId` | String | Conditional | Populated for Google OAuth users; unique sparse index |
| `activeSubscriptionId` | ObjectId ref UserSubscriptions | No | Null if no active plan |
| `isActive` | Boolean | Yes | Default: `true`; `false` = soft-deleted or suspended |
| `isSuspended` | Boolean | Yes | Default: `false`; set by admin |
| `suspensionReason` | String | No | Populated when `isSuspended` is `true` |
| `lastLoginAt` | Date | No | Updated on each successful login |
| `createdAt` | Date | Auto | Mongoose timestamps |
| `updatedAt` | Date | Auto | Mongoose timestamps |

> **Indexes:** `email` (unique), `role`, `googleId` (sparse unique), `activeSubscriptionId`

#### 4.2.2 CandidateProfiles

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto |
| `userId` | ObjectId ref Users | Unique; indexed |
| `headline` | String | Professional headline e.g. `"Full Stack Developer"` |
| `bio` | String | Max 500 chars |
| `skills` | `[String]` | Array of skill strings — indexed for search |
| `experience` | `[Object]` | `{ company, role, startDate, endDate, description, isCurrent }` |
| `education` | `[Object]` | `{ institution, degree, field, startYear, endYear, grade }` |
| `certifications` | `[Object]` | `{ name, issuer, issueDate, expiryDate, credentialUrl }` |
| `projects` | `[Object]` | `{ title, description, techStack: [String], url, githubUrl }` |
| `socialLinks` | Object | `{ linkedin, github, portfolio, twitter }` |
| `preferredJobRoles` | `[String]` | Used for job recommendations and auto-apply filtering |
| `preferredLocations` | `[String]` | Used for job recommendations and auto-apply filtering |
| `expectedSalaryMin` | Number | In INR per annum |
| `expectedSalaryMax` | Number | In INR per annum |
| `isOpenToWork` | Boolean | Default: `true`; visible to recruiters who search candidates |
| `profileCompletionScore` | Number | Computed virtual — percentage 0–100 based on filled fields |

#### 4.2.3 Resumes

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto |
| `userId` | ObjectId ref Users | Indexed |
| `fileName` | String | Original file name |
| `fileUrl` | String | Cloudinary secure URL |
| `cloudinaryPublicId` | String | Required for deletion from Cloudinary |
| `fileType` | Enum | `'pdf'` \| `'docx'` |
| `extractedText` | String | Raw text extracted by pdf-parse or mammoth — used for Gemini prompts |
| `extractedSkills` | `[String]` | Skills parsed from resume text |
| `atsScore` | Number | Latest ATS score (0–100) — updated each time analysis is run |
| `atsReport` | Object | `{ missingKeywords, formattingIssues, suggestions, sectionScores, generatedAt }` |
| `jobReadinessScore` | Number | Composite score (0–100) |
| `jobReadinessReport` | Object | `{ profileScore, atsScore, skillScore, experienceScore, summary }` |
| `analysisCount` | Number | Tracks how many times ATS analysis has been run — enforces free tier limits |
| `isActive` | Boolean | Default: `true`; candidates can deactivate old resumes |
| `isPrimary` | Boolean | Only one resume per user can be primary — used for auto-apply |

#### 4.2.4 Jobs

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto |
| `recruiterId` | ObjectId ref Users | Indexed |
| `companyId` | ObjectId ref Companies | Indexed |
| `title` | String | Required; indexed for text search |
| `description` | String | Full JD — used for keyword matching in recommendations |
| `requiredSkills` | `[String]` | Indexed; used for job matching and ATS keyword analysis |
| `niceToHaveSkills` | `[String]` | Optional skills |
| `experienceMin` | Number | Minimum years of experience required |
| `experienceMax` | Number | Maximum years considered |
| `salaryMin` | Number | In INR per annum |
| `salaryMax` | Number | In INR per annum |
| `location` | String | City or `"Remote"` or `"Hybrid"` |
| `workType` | Enum | `'remote'` \| `'on-site'` \| `'hybrid'` |
| `jobType` | Enum | `'full-time'` \| `'part-time'` \| `'contract'` \| `'internship'` |
| `status` | Enum | `'active'` \| `'closed'` \| `'paused'` \| `'draft'` — default: `draft`; indexed |
| `applicationCount` | Number | Denormalized counter for performance |
| `expiresAt` | Date | Job auto-closes after this date via cron job |
| `isAutoApplyEligible` | Boolean | Default: `true`; recruiter can opt out of auto-apply submissions |
| `keywords` | `[String]` | Auto-extracted from title + description + skills for matching engine |

> **Indexes:** `recruiterId`, `companyId`, `status`, `location`, `requiredSkills`, `jobType`, `workType`, `salaryMin/Max`, `title` (text index)

#### 4.2.5 Applications

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto |
| `candidateId` | ObjectId ref Users | Indexed |
| `jobId` | ObjectId ref Jobs | Indexed |
| `resumeId` | ObjectId ref Resumes | Resume used for this application |
| `coverLetter` | String | Optional — AI-generated or manually written |
| `status` | Enum | `'applied'` \| `'viewed'` \| `'shortlisted'` \| `'interview'` \| `'rejected'` \| `'hired'` — default: `applied` |
| `appliedVia` | Enum | `'manual'` \| `'auto-apply'` |
| `matchScore` | Number | Job match percentage at time of application (0–100) |
| `recruiterNotes` | String | Internal notes by recruiter — not visible to candidate |
| `withdrawnAt` | Date | Populated when candidate withdraws application |
| `statusHistory` | `[Object]` | `{ status, changedAt, changedBy }` — audit trail of status changes |

> **Compound Indexes:** `{ candidateId, jobId }` (unique) — prevents duplicate applications. `{ jobId, status }` — for recruiter pipeline views.

#### 4.2.6 AutoApplyConfig

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto |
| `userId` | ObjectId ref Users | Unique; indexed |
| `isEnabled` | Boolean | Default: `false` — candidate must explicitly enable |
| `resumeId` | ObjectId ref Resumes | Resume to use for auto-apply |
| `preferredRoles` | `[String]` | Job titles or keywords to match against job title |
| `preferredLocations` | `[String]` | Locations to include; empty array means all locations |
| `salaryMin` | Number | Minimum acceptable salary — skip jobs below this |
| `jobTypes` | `[Enum]` | Filter by job type: `['full-time', 'contract', ...]` |
| `workTypes` | `[Enum]` | Filter by work type: `['remote', 'hybrid', 'on-site']` |
| `minMatchScore` | Number | Minimum job match score to auto-apply (0–100). Default: `70` |
| `dailyApplicationLimit` | Number | Max applications to submit per day. Default: `10`; Max: `25` |
| `excludeCompanies` | `[String]` | Company names to never auto-apply to |
| `totalApplied` | Number | Lifetime count of auto-applications submitted |
| `lastRunAt` | Date | Timestamp of last auto-apply cron execution |

#### 4.2.7 SubscriptionPlans

> Static collection defining available subscription plans. Seeded at startup; not user-editable.

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto |
| `planCode` | String | Unique identifier e.g. `"candidate_monthly"`, `"recruiter_weekly"` |
| `name` | String | `"Premium Monthly"`, `"Recruiter Pro Annual"`, etc. |
| `targetRole` | Enum | `'candidate'` \| `'recruiter'` |
| `durationDays` | Number | `7` \| `30` \| `365` |
| `price` | Number | In INR paise (Razorpay requirement). e.g. `49900` = ₹499 |
| `features` | `[String]` | Feature descriptions displayed on pricing page |
| `atsChecksPerDay` | Number | For candidates. `-1` = unlimited |
| `jobPostingsAllowed` | Number | For recruiters. `-1` = unlimited |
| `resumeDownloadsPerMonth` | Number | For recruiters. `-1` = unlimited |
| `isActive` | Boolean | Inactive plans hidden from pricing page but honored for existing subscriptions |
| `razorpayPlanId` | String | Razorpay plan ID if using subscription billing; `null` for one-time |

#### 4.2.8 UserSubscriptions

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto |
| `userId` | ObjectId ref Users | Indexed |
| `planId` | ObjectId ref SubscriptionPlans | The plan purchased |
| `paymentId` | ObjectId ref Payments | Linked payment record |
| `status` | Enum | `'trial'` \| `'active'` \| `'expired'` \| `'cancelled'` |
| `startDate` | Date | Subscription activation date |
| `endDate` | Date | Subscription expiry date — indexed for cron-based expiry check |
| `autoRenew` | Boolean | Default: `false` — manual renewal model |
| `cancelledAt` | Date | Populated if status is `cancelled` |

#### 4.2.9 Payments

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto |
| `userId` | ObjectId ref Users | Indexed |
| `planId` | ObjectId ref SubscriptionPlans | |
| `razorpayOrderId` | String | Generated by `razorpay.orders.create()` |
| `razorpayPaymentId` | String | Returned after successful payment; unique |
| `razorpaySignature` | String | HMAC-SHA256 signature verified by backend |
| `amount` | Number | In INR paise |
| `currency` | String | Default: `"INR"` |
| `status` | Enum | `'pending'` \| `'captured'` \| `'failed'` \| `'refunded'` |
| `receipt` | String | Internal receipt ID generated at order creation |
| `failureReason` | String | Populated when status is `failed` |
| `refundId` | String | Razorpay refund ID if refund processed |
| `refundedAt` | Date | Timestamp of refund |

> **Note:** Payment records are never soft-deleted. All mutations are audited.

#### 4.2.10 Companies

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto |
| `recruiterId` | ObjectId ref Users | Unique; indexed — one company per recruiter in v1 |
| `name` | String | Required; indexed for search |
| `description` | String | Max 1000 chars |
| `industry` | String | e.g. `"Technology"`, `"Finance"`, `"Healthcare"` |
| `size` | Enum | `'1-10'` \| `'11-50'` \| `'51-200'` \| `'201-500'` \| `'500+'` |
| `website` | String | Validated URL |
| `logo` | String | Cloudinary URL |
| `location` | String | City, Country |
| `isVerified` | Boolean | Default: `false`; admin verifies — verified badge shown on job listings |
| `socialLinks` | Object | `{ linkedin, twitter }` |

#### 4.2.11 Notifications

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto |
| `userId` | ObjectId ref Users | Indexed |
| `type` | Enum | `'application_update'` \| `'auto_apply_result'` \| `'payment'` \| `'system'` \| `'subscription_expiry'` |
| `title` | String | Short notification title |
| `message` | String | Full notification text |
| `data` | Object | Contextual payload e.g. `{ applicationId, jobTitle }` |
| `isRead` | Boolean | Default: `false`; indexed |
| `readAt` | Date | Populated when `isRead` becomes `true` |

---

## 5. Functional Requirements

> **Priority legend:** 🔴 Must Have · 🟡 Should Have · 🟢 Nice to Have

### 5.1 User Registration and Authentication

| FR ID | Requirement | Actor | Description | Priority |
|---|---|---|---|---|
| FR-01 | Register with email/password | All Users | User provides name, email, password, and role (candidate/recruiter). Backend validates input, hashes password with bcrypt (12 rounds), creates user with `isEmailVerified: false`, sends 6-digit OTP via Nodemailer. User cannot access protected features until email is verified. | 🔴 |
| FR-02 | Email OTP Verification | All Users | User submits OTP received via email. Backend validates OTP from Redis (10-min TTL). On success, sets `isEmailVerified: true`. OTP is invalidated after first use. Resend OTP endpoint rate-limited to 3 requests per 10 minutes. | 🔴 |
| FR-03 | Login with email/password | All Users | Validates credentials. On success, returns JWT access token (15 min) in response body and refresh token (7 days) as `httpOnly` cookie. Failed login increments a lockout counter in Redis. Account locked after 5 consecutive failures for 15 minutes. | 🔴 |
| FR-04 | Google OAuth Login | All Users | Passport.js Google OAuth 2.0. On callback, either creates new user or returns existing user by `googleId`/email match. Issues same JWT pair as email login. Profile picture URL saved to `avatar` field. | 🔴 |
| FR-05 | Token Refresh | All Users | `POST /api/v1/auth/refresh` reads `httpOnly` refresh token cookie. Validates token against Redis allowlist. If valid, issues new access token and rotates refresh token (old one invalidated in Redis). Returns 401 if invalid or expired. | 🔴 |
| FR-06 | Logout | All Users | Invalidates refresh token in Redis. Clears `httpOnly` cookie. Client discards access token from memory. | 🔴 |
| FR-07 | Password Reset | All Users | `POST /forgot-password` accepts email. If user exists, generates secure token (`crypto.randomBytes(32)`), stores hash in Redis with 30-min TTL, sends reset link via Nodemailer. `POST /reset-password` validates token, updates hashed password, invalidates all refresh tokens for that user. | 🔴 |
| FR-08 | Change Password | Authenticated | Authenticated endpoint. Requires current password verification before accepting new password. Invalidates all refresh tokens to force re-login on other devices. | 🟡 |
| FR-09 | Account Deletion (GDPR) | Candidate / Recruiter | Soft-deletes user record (`isActive: false`). Schedules hard delete after 30 days. Purges associated data: resumes from Cloudinary, profile data, auto-apply config. Sends confirmation email. Payment records are retained for legal compliance. | 🟡 |

### 5.2 Candidate Profile Management

| FR ID | Requirement | Actor | Description | Priority |
|---|---|---|---|---|
| FR-10 | Create/Update Profile | Candidate | CRUD for `CandidateProfiles`. Supports partial updates via `PATCH`. `profileCompletionScore` computed as a Mongoose virtual based on filled fields. Completion score displayed as a progress bar on dashboard. | 🔴 |
| FR-11 | Upload Profile Picture | Candidate | Multer accepts image (JPEG/PNG/WEBP, max 2 MB). Processed and uploaded to Cloudinary. Old avatar deleted from Cloudinary on update. URL saved to `Users.avatar`. | 🔴 |
| FR-12 | Manage Skills | Candidate | Skills stored as a string array. Frontend provides a tag-input component. Minimum 3 skills required to enable job recommendations. Skills synced to `CandidateProfiles.skills` and also extracted from resume. | 🔴 |
| FR-13 | Manage Experience | Candidate | Add, edit, delete experience entries. `isCurrent: true` sets `endDate` to null. Entries sorted by `startDate` descending on profile view. | 🔴 |
| FR-14 | Manage Education | Candidate | Add, edit, delete education entries. Grade field is optional (supports percentage and GPA). | 🔴 |
| FR-15 | Manage Projects | Candidate | Add, edit, delete project entries with tech stack tags, GitHub URL, and live URL. Projects are displayed on profile and surfaced to recruiters. | 🟡 |
| FR-16 | Manage Certifications | Candidate | Add certifications with issuer, dates, and a credential URL for verification. | 🟡 |
| FR-17 | Public Profile Visibility Toggle | Candidate | `isOpenToWork` toggle controls whether profile appears in recruiter candidate search. When off, profile is completely hidden from recruiters. | 🔴 |

### 5.3 Resume Upload and ATS Analysis

| FR ID | Requirement | Actor | Description | Priority |
|---|---|---|---|---|
| FR-18 | Upload Resume | Candidate | Accepts PDF or DOCX (max 5 MB). Multer stores in memory. File uploaded to Cloudinary `/resumes/{userId}/`. Text extracted via pdf-parse (PDF) or mammoth (DOCX) and stored in `Resumes.extractedText`. Free tier: max 2 resumes stored. Premium: unlimited. | 🔴 |
| FR-19 | Run ATS Analysis | Candidate | Sends `extractedText` to Gemini with a structured prompt requesting JSON output containing: `atsScore` (0–100), `sectionScores`, `missingKeywords`, `formattingIssues`, `improvementSuggestions`. Result stored in `Resumes.atsReport`. Free tier: 3 analyses/day. Premium: unlimited. | 🔴 |
| FR-20 | Targeted ATS Analysis (vs Job) | Candidate | Candidate selects a specific job listing. Job description is included in the Gemini prompt for targeted keyword gap analysis. Returns additional field: `targetedMissingKeywords`. | 🟡 |
| FR-21 | View ATS Report | Candidate | Dashboard displays: overall score as a gauge chart, section scores as a radar chart (Recharts), missing keywords as chips, formatting issues as a warning list, improvement suggestions as a prioritized checklist. | 🔴 |
| FR-22 | Resume History | Candidate | Candidate can view all uploaded resumes with ATS scores over time as a line chart. Can set any resume as primary. Can delete a resume. Free tier: last 3 versions. Premium: full history. | 🟡 |
| FR-23 | AI Improvement Suggestions | Candidate | Dedicated AI Review tab. Sends resume text to Gemini for deep optimization feedback: keyword density, action verb suggestions, bullet point rewrites, summary rewrite, missing sections. Premium feature only. | 🔴 |
| FR-24 | Skill Gap Analysis | Candidate | Candidate selects a target job role. Gemini compares resume skills vs. required skills for that role and returns: matched skills, missing skills, and recommended learning resources. Premium feature. | 🟡 |

### 5.4 AI Cover Letter Generator

| FR ID | Requirement | Actor | Description | Priority |
|---|---|---|---|---|
| FR-25 | Generate Cover Letter | Candidate | Candidate selects a job listing (or pastes a JD). Backend sends to Gemini: candidate's resume text + extracted profile info + job description. Gemini returns a personalized, formatted cover letter (300–400 words). Displayed in an editable rich text area. Premium feature only. | 🔴 |
| FR-26 | Edit and Save Cover Letter | Candidate | Generated letter is fully editable. Candidate can regenerate with different tone (professional / enthusiastic / concise) using a tone selector. Final letter saved to `Applications.coverLetter` when submitting application. | 🟡 |
| FR-27 | Copy / Download Cover Letter | Candidate | Copy to clipboard button. Download as `.txt` or `.docx` file. Premium feature. | 🟡 |

### 5.5 Job Readiness Assessment

| FR ID | Requirement | Actor | Description | Priority |
|---|---|---|---|---|
| FR-28 | Calculate Job Readiness Score | Candidate | Composite score (0–100) calculated server-side: ATS Score (30%), Profile Completion (25%), Skills Relevance (25%), Experience Score (20%). Stored in `Resumes.jobReadinessScore`. | 🔴 |
| FR-29 | Generate Readiness Report | Candidate | Gemini generates a 2–3 sentence narrative summary of the candidate's readiness based on score inputs. Displayed alongside score breakdown chart. Premium feature. Updated when ATS analysis is re-run. | 🟡 |
| FR-30 | Readiness Score Dashboard Widget | Candidate | Score shown as a large gauge on the main candidate dashboard. Below it: a 4-component breakdown bar (ATS, Profile, Skills, Experience). Click-through to full report. | 🔴 |

### 5.6 Job Search and Recommendations

| FR ID | Requirement | Actor | Description | Priority |
|---|---|---|---|---|
| FR-31 | Browse and Search Jobs | Candidate / Public | `GET /api/v1/jobs` with full-text search on title and description using MongoDB Atlas Search (or `$text` index as fallback). Paginated results (20 per page). No authentication required to browse jobs. | 🔴 |
| FR-32 | Filter Jobs | Candidate / Public | Filter by: location, workType, jobType, salaryMin/Max, requiredSkills (multi-select), experienceMin/Max. Filters are composable (AND logic). Applied filters persist in URL query params for shareable links. | 🔴 |
| FR-33 | Save / Bookmark Jobs | Candidate | Candidates can save jobs to a dedicated saved list stored in a `SavedJobs` collection `{ userId, jobId, savedAt }`. Toggle to unsave. | 🟡 |
| FR-34 | AI Job Recommendations | Candidate | TF-IDF keyword overlap between `extractedText` keywords and job `keywords` field. Top 10 matches returned sorted by `matchScore`. Cached in Redis per user for 6 hours. Premium feature. | 🔴 |
| FR-35 | Match Score Badge | Candidate | Every job card in recommendations shows a color-coded match score badge (green ≥80%, amber 60–79%, red <60%). | 🔴 |
| FR-36 | Similar Jobs | Candidate | On the job detail page, a sidebar shows up to 5 similar jobs based on overlapping `requiredSkills` and same location or `workType`. | 🟢 |

### 5.7 Job Application Management

| FR ID | Requirement | Actor | Description | Priority |
|---|---|---|---|---|
| FR-37 | Apply to Job | Candidate | `POST /api/v1/applications`. Checks for duplicate application (compound index — 409 if exists). Checks candidate has a primary resume. Increments `Jobs.applicationCount`. Creates notification for recruiter via Socket.io. Free trial: 5 applications. Premium: unlimited. | 🔴 |
| FR-38 | Track Application Status | Candidate | Dashboard shows application pipeline as a Kanban-style status board: Applied → Viewed → Shortlisted → Interview → Hired/Rejected. Status updated by recruiter. Candidate receives Socket.io notification on status change. | 🔴 |
| FR-39 | Withdraw Application | Candidate | `PATCH /api/v1/applications/:id/withdraw`. Only possible if status is `"applied"` or `"viewed"`. Sets `withdrawnAt` timestamp. Decrements `Jobs.applicationCount`. | 🔴 |
| FR-40 | Application History | Candidate | Full list of past applications with filters (status, date range). Includes withdrawn and rejected applications. | 🔴 |
| FR-41 | Duplicate Application Prevention | System | Enforced at DB level via unique compound index on `{ candidateId, jobId }`. Backend returns 409 with message `"You have already applied to this job."` Auto-apply engine skips jobs already in the Applications collection. | 🔴 |

### 5.8 AI Auto Apply System

| FR ID | Requirement | Actor | Description | Priority |
|---|---|---|---|---|
| FR-42 | Configure Auto Apply | Candidate | Premium feature. Candidate sets preferences in `AutoApplyConfig`: preferred roles, locations, salary range, job types, work types, minimum match score (default 70%), daily application limit (default 10, max 25), excluded companies. | 🔴 |
| FR-43 | Enable / Disable Auto Apply | Candidate | Toggle switch on dashboard. Sets `AutoApplyConfig.isEnabled`. On enable: validates primary resume exists, email verified, active premium subscription. If any check fails, toggle reverts with specific error message. | 🔴 |
| FR-44 | Auto Apply Cron Job | System | `node-cron` job runs daily at 9:00 AM IST. Fetches all candidates with `isEnabled: true`. For each: (1) fetches active matching jobs, (2) scores each job, (3) filters by `minMatchScore`, (4) skips already-applied jobs, (5) submits up to `dailyApplicationLimit`, (6) emits `autoapply:completed` Socket.io event. | 🔴 |
| FR-45 | Auto Apply History | Candidate | All auto-apply submissions stored in Applications with `appliedVia: "auto-apply"`. Candidate can view filtered view of auto-applied jobs with match scores and statuses. Can withdraw auto-applied applications. | 🔴 |
| FR-46 | Auto Apply Notifications | Candidate | After each cron run, a Notification document is created and delivered via Socket.io: `"Auto Apply Complete: applied to N jobs, skipped M."` | 🔴 |
| FR-47 | Auto Apply Gate | System | Before every auto-apply attempt, system verifies: active premium subscription, primary resume exists, `isEmailVerified: true`. If any check fails, `isEnabled` is automatically set to `false` and candidate is notified. | 🔴 |

### 5.9 Subscription Management — Candidates

| FR ID | Requirement | Actor | Description | Priority |
|---|---|---|---|---|
| FR-48 | Free Trial | Candidate | 7-day trial on registration. Trial tracked in `UserSubscriptions` with `status: "trial"`. Limits enforced: 3 ATS checks/day, 5 job applications total, no auto-apply, no cover letter generator, no AI suggestions. Trial expiry checked on every protected-feature request. | 🔴 |
| FR-49 | View Pricing Plans | Candidate | Public pricing page showing candidate plans: Weekly (₹99/7 days), Monthly (₹299/month), Annual (₹1,999/year). Feature comparison table. Current plan highlighted. | 🔴 |
| FR-50 | Purchase Subscription | Candidate | Backend calls `razorpay.orders.create()`. Frontend opens Razorpay payment modal. On success, frontend sends `{ razorpayOrderId, razorpayPaymentId, razorpaySignature }` to verify endpoint. Backend verifies HMAC-SHA256 signature. On verified: creates `UserSubscriptions`, updates `Users.activeSubscriptionId`, emits `payment:confirmed` via Socket.io. | 🔴 |
| FR-51 | Subscription Status Enforcement | System | Middleware `checkSubscription()` validates `Users.activeSubscriptionId` and `UserSubscriptions.endDate` on every premium-gated route. Returns 403 with `{ message, upgradeUrl: "/pricing" }` if check fails. | 🔴 |
| FR-52 | Subscription Expiry Notification | System | `node-cron` job runs daily at 8:00 AM IST. Finds subscriptions expiring in 3 days and 1 day. Creates in-app Notification and sends email. On expiry: sets `status: "expired"`, clears `Users.activeSubscriptionId`, disables auto-apply. | 🔴 |
| FR-53 | Cancel Subscription | Candidate | Sets `autoRenew: false` and `status: "cancelled"` with `cancelledAt` timestamp. Subscription benefits continue until `endDate`. No automatic refunds. | 🟡 |

### 5.10 Subscription Management — Recruiters

| FR ID | Requirement | Actor | Description | Priority |
|---|---|---|---|---|
| FR-54 | Recruiter Plans | Recruiter | Basic (free — 2 active job posts, 5 resume downloads/month), Pro Weekly (₹499/7 days — 10 jobs, 50 downloads), Pro Monthly (₹1,499/month — unlimited jobs & downloads), Pro Annual (₹9,999/year — unlimited everything + verified badge). | 🔴 |
| FR-55 | Enforced Job Post Limit | System | Before creating a job, system checks count of active jobs by recruiter vs. plan limit. If limit reached, returns 403 with upgrade prompt. | 🔴 |
| FR-56 | Enforced Resume Download Limit | System | Monthly download count tracked in `RecruiterUsage` collection `{ recruiterId, month, resumeDownloads }`. Upserted on each download. Blocked with 403 when monthly limit reached. | 🔴 |

### 5.11 Recruiter Module

| FR ID | Requirement | Actor | Description | Priority |
|---|---|---|---|---|
| FR-57 | Create Company Profile | Recruiter | One company per recruiter in v1. CRUD for Companies collection. Logo uploaded to Cloudinary. Admin can verify company (sets `isVerified: true`) which displays a verification badge on all job listings. | 🔴 |
| FR-58 | Post Job | Recruiter | Checks recruiter subscription plan for job post limit. Creates Jobs document with `status: "draft"`. Recruiter must explicitly publish. Job auto-expires at `expiresAt` date via cron. Requires company profile to exist. | 🔴 |
| FR-59 | Edit / Pause / Close Job | Recruiter | Recruiter can edit any field on a draft or active job. Pausing sets `status: "paused"`. Closing sets `status: "closed"` and triggers notification to all active applicants. | 🔴 |
| FR-60 | View Applicants | Recruiter | `GET /api/v1/jobs/:jobId/applications`. Returns paginated list with candidate name, ATS score, match score, status, `appliedAt`. Sortable by ATS score, matchScore, appliedAt. Filter by status. | 🔴 |
| FR-61 | View Candidate Profile | Recruiter | Recruiter can view full `CandidateProfile` for candidates who applied to their jobs. Cannot view profiles with `isOpenToWork: false` who have not applied. | 🔴 |
| FR-62 | Download Resume | Recruiter | Tracked against `RecruiterUsage` monthly limit. Returns a signed Cloudinary URL (1-hour expiry) — not a permanent link. | 🔴 |
| FR-63 | Update Application Status | Recruiter | `PATCH /api/v1/applications/:id/status`. Appends to `statusHistory`. Triggers Socket.io notification to candidate. Recruiter can add internal `recruiterNotes` (not visible to candidate). | 🔴 |
| FR-64 | Candidate Search | Recruiter | Pro/Annual plan only. Search `CandidateProfiles` by skills, preferredLocations, preferredJobRoles where `isOpenToWork: true`. Returns profile summary cards. | 🟡 |
| FR-65 | Shortlist Candidates | Recruiter | Recruiter can create named shortlists. Add/remove candidates. Shortlists are private to the recruiter. | 🟡 |

### 5.12 Admin Module

| FR ID | Requirement | Actor | Description | Priority |
|---|---|---|---|---|
| FR-66 | Admin Dashboard | Admin | Overview metrics: total users, active subscriptions, revenue (last 30 days), new registrations, jobs posted, applications submitted. Metrics from MongoDB aggregations. Displayed as metric cards + Recharts charts. | 🔴 |
| FR-67 | Manage Users | Admin | Paginated user list with search and role filter. Admin can: view full user profile, suspend account, reactivate account, trigger hard delete of soft-deleted accounts. | 🔴 |
| FR-68 | Verify Companies | Admin | List of Companies with `isVerified: false`. Admin can verify or reject. Rejection sends email to recruiter with reason. | 🔴 |
| FR-69 | Manage Job Listings | Admin | Admin can view all jobs regardless of recruiter. Can close any job posting that violates platform policies. | 🔴 |
| FR-70 | Manage Subscriptions | Admin | View all `UserSubscriptions`. Filter by status, plan, date range. Manually assign or extend subscriptions for support cases. | 🔴 |
| FR-71 | Manage Payments | Admin | View all Payments. Filter by status, amount range, date range. Initiate Razorpay refund via API (admin action only in v1). | 🔴 |
| FR-72 | Generate Reports | Admin | Exportable CSV reports: (1) User growth by month, (2) Revenue by plan, (3) Top job categories by application count, (4) Subscription conversion rate. CSV generation via `json2csv` npm package. | 🟡 |
| FR-73 | Platform Announcement | Admin | Admin can broadcast a system-wide notification to all connected users via Socket.io (admin namespace broadcast). Also saved as Notifications for offline users. | 🟢 |

---

## 6. AI Integration Specification (Google Gemini)

### 6.1 Model and SDK

- **SDK:** `@google/generative-ai` (official Node.js SDK)
- **Model:** `gemini-1.5-flash` for all features (balance of speed and capability)
- **Output mode:** JSON mode (`responseMimeType: "application/json"`) for all structured responses
- **API key:** Stored in environment variable `GEMINI_API_KEY` — never exposed to frontend
- **Rate limiting:** 60 requests/minute on Gemini free tier. Backend queues requests with 1-second delay between calls.

### 6.2 ATS Analysis Prompt Template

```
System:
You are an expert ATS (Applicant Tracking System) analyzer.
Return ONLY valid JSON matching the schema provided.

User:
Analyze this resume and return a JSON object with:
- atsScore: number 0-100 (overall ATS compatibility)
- sectionScores: { contact: 0-100, summary: 0-100, skills: 0-100,
                   experience: 0-100, education: 0-100, projects: 0-100 }
- missingKeywords: string[]  (important keywords absent from resume)
- formattingIssues: string[] (ATS-unfriendly formatting found)
- improvementSuggestions: string[] (actionable, specific suggestions)
- strengths: string[]        (what the resume does well)

Resume text:
{extractedText}

Target job role (optional):
{targetRole}
```

### 6.3 Cover Letter Prompt Template

```
System:
You are a professional career coach. Generate a compelling, personalized
cover letter. Return ONLY the cover letter text, no preamble.

User:
Write a {tone} cover letter for this candidate applying to the following job.

Candidate Summary:
{candidateName}, {headline}. Skills: {skills}. Experience: {experienceSummary}.

Job Title:       {jobTitle} at {companyName}
Job Description: {jobDescription}

Length: 300-400 words.
Format: 3 paragraphs (intro, body with 2-3 specific achievements, call to action).
```

### 6.4 Skill Gap Analysis Prompt Template

```
System:
You are a technical recruiter and career advisor. Return ONLY valid JSON.

User:
Compare the candidate's skills against the requirements for a {targetRole} position.

Candidate skills:               {candidateSkills}
Job requirements / description: {jobDescription}

Return JSON:
{
  matchedSkills: string[],
  missingCriticalSkills: string[],
  missingNiceToHaveSkills: string[],
  matchPercentage: number,
  summary: string
}
```

### 6.5 Error Handling for AI Calls

| Scenario | Handling |
|---|---|
| Any Gemini call fails | Wrap in try/catch. Return 503 with `"AI service temporarily unavailable."` |
| Invalid JSON in Gemini response | Retry once with explicit fix instruction. If second attempt fails, return 503. |
| Token limit exceeded | Pre-check `extractedText` length (< 30,000 chars). Truncate at last complete sentence if over limit. Log truncation. |
| Gemini API quota exceeded | Return 429 with `"Analysis limit reached. Please try again in a few minutes."` |
| Gemini unavailable during Auto Apply | Use fallback keyword overlap scoring algorithm. Log that AI scoring was skipped. |

---

## 7. Non-Functional Requirements

### 7.1 Performance

| NFR ID | Metric | Target | Measurement Method |
|---|---|---|---|
| NFR-01 | API response time (standard routes) | < 500ms at p95 | Morgan logging; Postman collection timing |
| NFR-02 | API response time (AI routes) | < 10s at p95 | Gemini latency + server processing; show loading state to user |
| NFR-03 | Page load time (initial) | < 3s on 3G connection | Lighthouse audit; code splitting via Vite dynamic imports |
| NFR-04 | Job search response time | < 800ms at p95 | MongoDB Atlas Search with proper indexing |
| NFR-05 | Job recommendations (cached) | < 200ms | Redis cache hit; 6-hour TTL per user |
| NFR-06 | Job recommendations (uncached) | < 2s | MongoDB aggregation + keyword scoring algorithm |
| NFR-07 | Socket.io notification delivery | < 500ms | From server emit to client receive |
| NFR-08 | File upload (resume) | < 8s for 5 MB PDF | Multer → Cloudinary upload time |

### 7.2 Security

| NFR ID | Requirement | Implementation |
|---|---|---|
| NFR-09 | All traffic over HTTPS | Enforced at hosting layer (Render/Vercel). Helmet sets HSTS header. |
| NFR-10 | JWT stored securely | Access token in memory only (React state/RTK). Never `localStorage`. Refresh token in `httpOnly` cookie. |
| NFR-11 | Password storage | bcrypt with 12 salt rounds. Passwords never logged or returned in API responses. |
| NFR-12 | Rate limiting | Global: 100 req/15min per IP. Auth routes: 10 req/15min. AI routes: 20 req/hour per user. Payment routes: 10 req/hour. |
| NFR-13 | Input validation | express-validator on all POST/PATCH routes. Reject requests with unexpected fields (whitelist approach). |
| NFR-14 | File upload security | MIME type validation (must be `application/pdf` or `application/vnd.openxmlformats`). Max 5 MB enforced. File extension checked. |
| NFR-15 | Role-based access control | RBAC middleware on all protected routes. Candidate routes reject recruiters and vice versa. Admin routes reject all non-admin roles. |
| NFR-16 | Razorpay webhook security | Webhook endpoint validates `X-Razorpay-Signature` HMAC using webhook secret. Rejects unsigned payloads. |
| NFR-17 | Resume URL security | Cloudinary signed URLs with 1-hour expiry for recruiter downloads. Raw Cloudinary URLs not exposed directly to recruiters. |
| NFR-18 | Data privacy (GDPR-aligned) | Account deletion purges PII. Users can export all their data via `GET /api/v1/me/export`. |

### 7.3 Reliability and Availability

| NFR ID | Requirement | Details |
|---|---|---|
| NFR-19 | Uptime target | 99.5% monthly (≈ 3.6 hours downtime/month) — achievable on Render + Vercel free tiers |
| NFR-20 | Database backups | MongoDB Atlas M0 provides daily automated backups. Snapshots retained for 5 days. |
| NFR-21 | Graceful error handling | All unhandled Promise rejections caught by Express error middleware. Returns structured JSON error: `{ success: false, message, code }`. |
| NFR-22 | AI service fallback | If Gemini is unavailable, premium AI features return a user-friendly error. Core non-AI features remain fully operational. |
| NFR-23 | Cron job reliability | node-cron jobs log start and completion. Failed runs logged to console and create a `SystemLog` entry. Manual re-run endpoint available to admin. |

### 7.4 Scalability

| NFR ID | Requirement | Implementation |
|---|---|---|
| NFR-24 | Horizontal scalability | Express server is stateless (all session data in Redis and MongoDB). Can be horizontally scaled behind a load balancer. |
| NFR-25 | Database connection pooling | Mongoose connection pool size: 10 (default). Increase via `maxPoolSize` in connection options. |
| NFR-26 | Asset delivery | Resume files and images served from Cloudinary CDN — no static file serving from Express in production. |
| NFR-27 | Redis caching strategy | Cache keys: `job_recommendations:{userId}` (TTL 6h), `ats_report:{resumeId}` (TTL 24h). Cache invalidated on resume update. |

### 7.5 Usability

| NFR ID | Requirement | Details |
|---|---|---|
| NFR-28 | Responsive design | Mobile-first Tailwind CSS. Tested breakpoints: 375px (mobile), 768px (tablet), 1280px (desktop). No horizontal scroll on any supported breakpoint. |
| NFR-29 | Accessibility | WCAG 2.1 AA target. All interactive elements keyboard navigable. shadcn/ui components use Radix UI (accessible by default). |
| NFR-30 | Loading states | Every async action shows a loading indicator. AI operations show a progress message. Skeleton screens used for data loading. |
| NFR-31 | Error feedback | All API errors surfaced as toast notifications (shadcn/ui Toaster). Form validation errors shown inline below each field. 404 and 500 pages with navigation back to home. |
| NFR-32 | Empty states | Every list view has a designed empty state with an illustration, descriptive message, and a primary action CTA. |

---

## 8. Business Rules

### 8.1 Subscription and Feature Access Matrix

| Feature | Free Trial (7 days) | Premium (Candidate) | Recruiter Basic | Recruiter Pro |
|---|---|---|---|---|
| ATS Resume Analysis | 3/day | Unlimited | N/A | N/A |
| Resume Storage | 2 resumes | Unlimited | N/A | N/A |
| Job Applications | 5 total | Unlimited | N/A | N/A |
| AI Suggestions | ❌ | ✅ | N/A | N/A |
| Cover Letter AI | ❌ | ✅ | N/A | N/A |
| Job Recommendations | Basic (top 5) | Advanced (top 10 + match score) | N/A | N/A |
| AI Auto Apply | ❌ | ✅ | N/A | N/A |
| Skill Gap Analysis | ❌ | ✅ | N/A | N/A |
| Job Postings | N/A | N/A | 2 active | Unlimited |
| Resume Downloads | N/A | N/A | 5/month | Unlimited |
| Candidate Search | N/A | N/A | ❌ | ✅ |
| Verified Badge | N/A | N/A | ❌ | ✅ (with admin verify) |

### 8.2 Application Rules

- A candidate may not apply to the same job twice. Enforced at DB level via unique compound index.
- A candidate must have at least one resume marked as primary to apply to any job.
- A candidate must have a verified email address to apply to jobs.
- Auto Apply only submits to jobs where `isAutoApplyEligible: true`.
- Auto Apply skips jobs the candidate has already applied to (manual or auto).
- A withdrawn application cannot be re-submitted to the same job.
- Application status can only move forward in the pipeline by the recruiter. Candidates can only withdraw.

### 8.3 Recruiter Rules

- A recruiter must create a Company Profile before posting any job.
- A job posting requires: title, description, at least 1 required skill, location, jobType, workType.
- A job with at least 1 application cannot be deleted — only closed. Closed jobs retain all application data.
- Recruiters can only view full profiles of candidates who have applied to their own jobs (unless on a Pro plan with candidate search).
- Resume download URLs are signed and expire in 1 hour. Recruiters cannot share permanent resume links.

### 8.4 Auto Apply Rules

- Auto Apply requires an active Premium subscription. If subscription expires, Auto Apply is automatically disabled.
- Daily application limit: default 10, maximum configurable to 25. Resets at midnight IST.
- Minimum match score default is 70%. Candidate can lower to 50% minimum or raise to 100%.
- Auto Apply will not apply to companies in the `excludeCompanies` list (case-insensitive string match).
- If the primary resume is deleted while Auto Apply is enabled, Auto Apply is paused and candidate is notified.

### 8.5 Payment Rules

- Payments are processed in INR only via Razorpay.
- Payment verification uses HMAC-SHA256 signature validation on the backend before activating subscription.
- Subscriptions are not auto-renewed in v1 — manual renewal only.
- Refunds are processed manually by admin via Razorpay dashboard. No self-serve refund flow in v1.
- A new subscription purchased before expiry extends the current `endDate` by the new plan duration.
- Free trial cannot be re-activated after it expires. User must purchase a paid plan.

---

## 9. Error Handling and Edge Cases

### 9.1 API Error Response Format

All API errors return a consistent JSON structure:

```json
{
  "success": false,
  "message": "Human-readable message",
  "code": "ERROR_CODE",
  "errors": []
}
```

| HTTP Status | Error Code | Scenario |
|---|---|---|
| 400 Bad Request | `VALIDATION_ERROR` | Input validation failed. `errors[]` contains field-level details. |
| 401 Unauthorized | `AUTH_REQUIRED` | No token or invalid token. Client should redirect to login. |
| 401 Unauthorized | `TOKEN_EXPIRED` | Access token expired. Client should attempt silent refresh. |
| 403 Forbidden | `INSUFFICIENT_ROLE` | User's role does not permit this action. |
| 403 Forbidden | `SUBSCRIPTION_REQUIRED` | Feature requires premium subscription. Includes `upgradeUrl`. |
| 403 Forbidden | `FEATURE_LIMIT_REACHED` | Plan limit exceeded (e.g. daily ATS checks). Includes `resetTime`. |
| 404 Not Found | `RESOURCE_NOT_FOUND` | Requested document does not exist or user lacks access. |
| 409 Conflict | `DUPLICATE_APPLICATION` | Candidate already applied to this job. |
| 409 Conflict | `EMAIL_ALREADY_EXISTS` | Registration attempted with existing email. |
| 422 Unprocessable | `RESUME_PARSE_FAILED` | Could not extract text from uploaded file. |
| 429 Too Many Requests | `RATE_LIMIT_EXCEEDED` | Rate limit hit. Includes `retryAfter` seconds. |
| 503 Service Unavailable | `AI_SERVICE_ERROR` | Gemini API call failed. Core features unaffected. |

### 9.2 Key Edge Cases

| Scenario | Expected Behavior |
|---|---|
| Candidate deletes primary resume while Auto Apply is enabled | Auto Apply is paused (`isEnabled: false`). Notification created and emailed. |
| Subscription expires mid-session | Next API call to a premium route returns 403. Frontend shows subscription expired modal with upgrade link. |
| Gemini returns malformed JSON | Backend retries once. If still invalid, returns 503 to client. Resume/report not updated. |
| Recruiter closes a job with pending applications | All applications with status `"applied"` or `"viewed"` receive a notification that the job has been closed. |
| User registers with Google using email already registered locally | System merges accounts: links `googleId` to existing user. User is notified that Google login has been linked. |
| File upload succeeds to Cloudinary but DB write fails | If DB write fails, delete the uploaded file from Cloudinary (compensating transaction). Return 500 to client. |
| Payment captured by Razorpay but webhook fails to reach server | Frontend sends payment IDs to verify endpoint regardless. Verification serves as primary confirmation. Webhook is a secondary safeguard. |
| Auto Apply cron runs but Gemini is unavailable | Match scoring uses fallback keyword overlap algorithm (no Gemini). Log that AI scoring was skipped. Applications submitted using fallback scores. |
| Two simultaneous applications to the same job | Unique index on `{ candidateId, jobId }` prevents duplicate. Second write returns 11000 duplicate key error, mapped to 409 response. |

---

## 10. Recommended Project Structure

### 10.1 Backend (`server/`)

```
server/
├── src/
│   ├── config/
│   │   ├── db.js              # Mongoose connection
│   │   ├── redis.js           # Upstash Redis client
│   │   ├── cloudinary.js      # Cloudinary SDK init
│   │   ├── gemini.js          # Google Generative AI init
│   │   ├── razorpay.js        # Razorpay SDK init
│   │   └── socket.js          # Socket.io server setup
│   │
│   ├── middleware/
│   │   ├── auth.js            # JWT verify middleware
│   │   ├── checkSubscription.js
│   │   ├── checkRole.js       # RBAC middleware
│   │   ├── rateLimiter.js     # express-rate-limit configs
│   │   ├── errorHandler.js    # Global Express error handler
│   │   └── upload.js          # Multer memory storage config
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── CandidateProfile.js
│   │   ├── Resume.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   ├── AutoApplyConfig.js
│   │   ├── Company.js
│   │   ├── SubscriptionPlan.js
│   │   ├── UserSubscription.js
│   │   ├── Payment.js
│   │   └── Notification.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── candidate.routes.js
│   │   ├── resume.routes.js
│   │   ├── job.routes.js
│   │   ├── application.routes.js
│   │   ├── autoApply.routes.js
│   │   ├── recruiter.routes.js
│   │   ├── subscription.routes.js
│   │   ├── payment.routes.js
│   │   ├── admin.routes.js
│   │   └── notification.routes.js
│   │
│   ├── controllers/           # Request/response handling only
│   │   └── (one per route file)
│   │
│   ├── services/              # Business logic
│   │   ├── atsService.js      # Gemini ATS analysis
│   │   ├── coverLetterService.js
│   │   ├── jobMatchService.js # TF-IDF keyword scoring
│   │   ├── notificationService.js
│   │   ├── paymentService.js
│   │   ├── emailService.js    # Nodemailer
│   │   └── autoApplyService.js
│   │
│   ├── jobs/                  # Cron jobs
│   │   ├── autoApplyCron.js
│   │   ├── subscriptionExpiryCron.js
│   │   └── jobExpiryCron.js
│   │
│   ├── utils/
│   │   ├── apiError.js        # Custom error class
│   │   ├── apiResponse.js     # Standard response wrapper
│   │   ├── catchAsync.js      # Async error wrapper
│   │   ├── extractResumeText.js
│   │   └── generateToken.js
│   │
│   ├── validations/           # express-validator schemas
│   │   └── (one per resource)
│   │
│   └── socket/
│       └── socketHandler.js   # Connection, room join, event emitters
│
├── app.js                     # Express app setup
├── server.js                  # HTTP server + Socket.io init
├── .env.example               # Template — no actual values
└── package.json
```

### 10.2 Frontend (`client/`)

```
client/
├── src/
│   ├── app/
│   │   ├── store.js           # Redux store
│   │   └── rootReducer.js
│   │
│   ├── features/              # RTK slices + RTK Query API definitions
│   │   ├── auth/
│   │   ├── candidate/
│   │   ├── recruiter/
│   │   ├── jobs/
│   │   ├── resume/
│   │   ├── subscription/
│   │   ├── admin/
│   │   └── notifications/
│   │
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── CandidateDashboard.jsx
│   │   ├── RecruiterDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── JobDetailPage.jsx
│   │   ├── PricingPage.jsx
│   │   └── (etc.)
│   │
│   ├── components/            # Shared UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── JobCard.jsx
│   │   ├── ResumeUploader.jsx
│   │   ├── ATSScoreGauge.jsx
│   │   ├── SubscriptionBadge.jsx
│   │   ├── NotificationBell.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useSocket.js
│   │   ├── useToast.js
│   │   └── useDebounce.js
│   │
│   ├── lib/
│   │   ├── axios.js           # Configured Axios instance
│   │   ├── socket.js          # Socket.io client singleton
│   │   └── utils.js
│   │
│   ├── validations/           # Zod schemas for all forms
│   └── assets/                # Images, SVGs for empty states
│
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

### 10.3 Environment Variables

| Variable | Used By | Description |
|---|---|---|
| `PORT` | Backend | Server port. Default: `5000` |
| `NODE_ENV` | Backend | `"development"` \| `"production"` |
| `MONGODB_URI` | Backend | MongoDB Atlas connection string |
| `JWT_ACCESS_SECRET` | Backend | Secret for signing access tokens. Min 32 chars. |
| `JWT_REFRESH_SECRET` | Backend | Secret for signing refresh tokens. Min 32 chars. Different from access secret. |
| `REDIS_URL` | Backend | Upstash Redis REST URL |
| `REDIS_TOKEN` | Backend | Upstash Redis REST token |
| `CLOUDINARY_CLOUD_NAME` | Backend | Cloudinary account cloud name |
| `CLOUDINARY_API_KEY` | Backend | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Backend | Cloudinary API secret |
| `GEMINI_API_KEY` | Backend | Google Gemini API key |
| `RAZORPAY_KEY_ID` | Backend + Frontend | Razorpay key ID (public — safe to expose to frontend) |
| `RAZORPAY_KEY_SECRET` | Backend only | Razorpay key secret — **NEVER expose to frontend** |
| `RAZORPAY_WEBHOOK_SECRET` | Backend only | Used to verify Razorpay webhook signatures |
| `SMTP_HOST` | Backend | SMTP server host (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | Backend | SMTP port (`587` for TLS) |
| `SMTP_USER` | Backend | SMTP username / email address |
| `SMTP_PASS` | Backend | SMTP password or app password |
| `GOOGLE_CLIENT_ID` | Backend | Google OAuth 2.0 client ID |
| `GOOGLE_CLIENT_SECRET` | Backend | Google OAuth 2.0 client secret |
| `GOOGLE_CALLBACK_URL` | Backend | OAuth redirect URI e.g. `http://localhost:5000/api/v1/auth/google/callback` |
| `CLIENT_URL` | Backend | Frontend URL for CORS and OAuth redirects e.g. `http://localhost:5173` |
| `VITE_API_URL` | Frontend | Backend API base URL — must start with `VITE_` for Vite to expose to browser |
| `VITE_RAZORPAY_KEY_ID` | Frontend | Razorpay key ID for payment modal |
| `VITE_SOCKET_URL` | Frontend | Socket.io server URL |

---

## 11. Future Enhancements (Post v1.0)

| Feature | Priority | Notes |
|---|---|---|
| AI Mock Interview (Text) | High | Gemini generates role-specific interview questions; candidate answers; AI evaluates responses |
| Interview Scheduling | High | In-platform calendar for recruiter to propose time slots; candidate accepts/declines |
| Job Alert Email Notifications | High | Daily digest of new jobs matching candidate preferences; opt-in via profile settings |
| LinkedIn Profile Import | Medium | Import work experience and skills via LinkedIn API to populate `CandidateProfile` |
| Video Resume Upload | Medium | Cloudinary video support; Gemini transcription for keyword extraction |
| AI Salary Prediction | Medium | Gemini predicts expected salary range based on skills, experience, and location |
| AI Career Roadmap | Medium | Gemini generates a step-by-step skill development plan for a target role |
| Multi-Language Support | Low | i18next for frontend; resume parsing in non-English languages via Gemini |
| Mobile App (React Native) | Low | Expo-based app sharing RTK Query layer with web frontend |
| Company Reviews | Low | Candidates who were hired or interviewed can leave anonymous company reviews |
| Referral System | Low | Candidates earn subscription credit for referring friends who purchase plans |

