// src/constants/roles.ts

/**
 * Defines all user roles in the system.
 * These values are used throughout auth, middleware, and services
 * to enforce role-based access control.
 */
export enum Role {
    User = "User",
    Inspector = "Inspector",
    Admin = "Admin",
  }
  