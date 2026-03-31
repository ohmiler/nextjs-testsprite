# Product Specification: Simple User Registration API

## 1. Overview
A simple backend API for user registration. The purpose is to allow new users to create an account using their email and password.

## 2. Core Features & Requirements
- **Endpoint:** `POST /api/register`
- **Request Body:** Accepts a JSON object containing `email` (string) and `password` (string).

## 3. Expected Behavior (Happy Path)
- When a valid request is received with a new email, the system should hash the password and save the user data to the database.
- The API must return a status code `201 Created` with a success message.

## 4. Edge Cases & Error Handling (Crucial)
- **Duplicate Email:** If a user tries to register with an `email` that already exists in the database, the system MUST NOT create a new record.
- The API must return a status code `400 Bad Request` with an error message indicating that the email is already in use.