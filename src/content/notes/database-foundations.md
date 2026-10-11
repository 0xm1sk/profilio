---
title: "Relational Database Foundations"
date: 2026-10-09
tags: ["databases", "sql", "theory"]
---

# Relational Database Foundations

## Integrity Constraints
Constraints ensure that the data stored in the database remains accurate, consistent, and reliable.

- **Entity Integrity:** Ensures that each row in a table is unique.
  - **Primary Key (Clé Primaire):** A unique identifier for each record. No two rows can have the same primary key, and it cannot be null.
- **Domain Integrity:** Ensures that the data in a column falls within a valid range or format (e.g., an age column cannot be negative).
- **Referential Integrity:** Ensures that relationships between tables remain consistent (e.g., you cannot have an order for a customer that doesn't exist in the Customers table).

## Relationship Types
How data in one table relates to data in another.

- **1:1 (One-to-One):** One record in Table A relates to exactly one record in Table B.
- **1:N (One-to-Many):** One record in Table A relates to multiple records in Table B (e.g., one Customer has many Orders).
- **N:M (Many-to-Many):** Multiple records in Table A relate to multiple records in Table B (usually requires a "junction table" to resolve).

### Operator's Perspective: SQL Injection (SQLi)
Understanding these constraints is key to exploitation:
- **IDOR:** Bypassing primary key logic to access other users' data.
- **JOIN Attacks:** Using known relationships to leak data from sensitive tables via a vulnerable query.
