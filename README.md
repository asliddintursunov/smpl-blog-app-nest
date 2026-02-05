<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

### BLOG APP USING NEST JS

## Backend API Overview

This is a simple blog API built with NestJS and Prisma. It has:

- **Authentication** with JWT
- **Users** with roles (`ADMIN`, `USER`)
- **Posts** created by authenticated users
- **Comments** on posts, with access control

All protected endpoints expect a JWT access token in the header:

- **Header**: `Authorization: Bearer <access_token>`

You obtain this token from the **auth login** endpoint described below.

---

## Authentication

### POST `/auth/register`

- **Public**
- **Body** (`CreateUserDto`):
  - `email` (string, required, unique)
  - `password` (string, required)
  - `name` (string, optional; defaults to the email prefix)
- **Behavior**:
  - Checks if a user with the same email exists.
  - Hashes the password before saving.
  - Returns basic user info (no password).

### POST `/auth/login`

- **Public**
- **Body** (`LoginDto`):
  - `email` (string, required)
  - `password` (string, required)
- **Behavior**:
  - Verifies email and password.
  - On success, returns:
    - `access_token` (JWT, valid for 7 days)
    - `user` object with `name`, `email`, `role`
- **Usage**:
  - Use `access_token` as a Bearer token for protected endpoints.

---

## Users

### POST `/users`

- **Public**
- **Purpose**: Create a new user (similar to `/auth/register`, but without login behavior).
- **Body** (`CreateUserDto`):
  - `email`, `password`, `name?`
- **Behavior**:
  - Creates a user and returns `name`, `email`, `role`.

### DELETE `/users/:id`

- **Protected**: `JwtAuthGuard`
- **Role required**: `ADMIN` (via `RolesGuard`)
- **Behavior**:
  - Only admins can delete users.
  - A user cannot delete themself; otherwise a `BadRequestException` is thrown.

---

## Posts

All routes below use the `posts` controller.

### GET `/posts`

- **Public**
- **Purpose**: List all **published** posts.
- **Behavior**:
  - Returns posts with their authors (`id`, `name`, `email`).

### POST `/posts`

- **Protected**: `JwtAuthGuard`
- **Body** (`CreatePostDto`):
  - Typically `title`, `content`, and any other fields defined in your DTO.
- **Behavior**:
  - Creates a new post authored by the currently logged-in user (`authorId` from JWT).

### DELETE `/posts/:id`

- **Protected**: `JwtAuthGuard`
- **Behavior**:
  - Only the post author **or** an admin can delete a post.
  - If the post does not exist, a `NotFoundException` is thrown.
  - If the user is neither admin nor author, a `ForbiddenException` is thrown.

---

## Comments

There are two ways to work with comments:

- Via `posts` routes (create + list comments for a post).
- Via `comments` routes (update + delete existing comments).

### GET `/posts/:id/comments`

- **Protected**: `JwtAuthGuard`
- **Purpose**: List comments for a specific post.
- **Behavior**:
  - Returns all comments where `postId = :id`.

### POST `/posts/:id/comments`

- **Protected**: `JwtAuthGuard`
- **Body** (`CreateCommentDto`):
  - `content` (string, required)
- **Behavior**:
  - Verifies that the post exists; otherwise throws `BadRequestException`.
  - Creates a comment linked to:
    - `postId` (from URL)
    - `userId` (from JWT)

### PATCH `/comments/:id`

- **Protected**: `JwtAuthGuard`
- **Body** (`EditCommentDto`):
  - `content` (string, required)
- **Behavior**:
  - Only the comment author or an admin can edit the comment.
  - If the comment does not exist, throws `NotFoundException`.
  - On insufficient permissions, throws `ForbiddenException`.

### DELETE `/comments/:id`

- **Protected**: `JwtAuthGuard`
- **Behavior**:
  - Only the comment author or an admin can delete the comment.
  - If the comment does not exist, throws `NotFoundException`.
  - On insufficient permissions, throws `ForbiddenException`.

---

## Roles and Access Control (High Level)

- **Roles** are defined in `UserRoles`:
  - `ADMIN`
  - `USER`
- **JWT payload** includes:
  - `sub` (user id)
  - `email`
  - `role`
- **Guards**:
  - `JwtAuthGuard`:
    - Validates the JWT and attaches `user` info to the request (`userId`, `email`, `role`).
  - `RolesGuard`:
    - Reads required roles from the `@Roles()` decorator.
    - Checks if the current user’s role is allowed for the endpoint.

When you add new endpoints, think about:

- **Do they need authentication?** → add `@UseGuards(JwtAuthGuard)`
- **Do they need role checks?** → add `@UseGuards(JwtAuthGuard, RolesGuard)` and `@Roles(UserRoles.ADMIN)` (or other roles).
