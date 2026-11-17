---
title: "Relational Database Foundations"
date: 2026-10-09
category: "Data"
tags: ["databases", "sql", "theory"]
description: "Integrity constraints, relationships, and normalization — and why they matter for SQL injection."
---
# Relational Database Foundations

A relational database stores data in tables and enforces rules about what those tables may contain. Understanding those rules is useful both for designing correct schemas and for exploiting the queries that read them.

<br />

---

## Integrity constraints

Constraints keep stored data accurate and consistent.

### Entity integrity
Each row must be uniquely identifiable.

- **Primary key** — a unique, non-null identifier for every record.
- No two rows may share a primary key, and it can never be null.

### Domain integrity
Values in a column must be valid for that column's type and rules:

- data type (`INT`, `VARCHAR`, `DATE`)
- `NOT NULL`, `UNIQUE`, `CHECK` constraints
- foreign keys referencing valid rows

### Referential integrity
Relationships between tables must stay consistent. An order cannot reference a customer that does not exist; deleting that customer must either fail or cascade.

<br />

---

## Relationship types

| Type | Meaning | Example |
|---|---|---|
| **1:1** | One row in A maps to exactly one in B | User ↔ profile |
| **1:N** | One row in A maps to many in B | Customer → orders |
| **N:M** | Many rows in A map to many in B | Students ↔ courses |

An N:M relationship is resolved with a **junction table** holding the two primary keys:

```
students ---< enrollments >--- courses
```

<br />

---

## Normalization

Normalization organizes columns to reduce redundancy and update anomalies.

- **1NF** — atomic values, no repeating groups
- **2NF** — 1NF plus no partial dependency on a composite key
- **3NF** — 2NF plus no transitive dependency on the primary key

Higher normal forms reduce duplication but may require more `JOIN`s. Denormalization is a deliberate trade-off for read performance.

<br />

---

## SQL building blocks

```sql
SELECT u.name, COUNT(o.id) AS orders
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.active = 1
GROUP BY u.name
HAVING COUNT(o.id) > 2
ORDER BY orders DESC;
```

- `JOIN` combines rows across tables using a relationship.
- `GROUP BY` / `HAVING` aggregate and filter groups.
- `LEFT JOIN` preserves rows from the left table even with no match.

<div class="info-callout">
<strong>Why this matters:</strong> SQL injection payloads are usually built around the schema — column names, table relationships, and the number of columns in the original query. Reading the schema is reading the attack surface.
</div>

<br />

---

## Operator's perspective

- **IDOR** — changing an identifier in a request accesses another user's row. The primary key logic exists, but authorization does not check *whose* row it is.
- **JOIN-based leaks** — a known relationship lets an injected query pull data from sensitive tables the application never intended to expose.
- **UNION attacks** — require matching the original query's column count and types; `ORDER BY N` is a common way to discover the count.
- **Error-based / boolean-based inference** — when output is suppressed, constraints and error messages become an oracle for extracting data one bit at a time.

<br />

---

## Defense side

- **Parameterized queries** keep user input out of SQL syntax entirely — the primary control.
- **Least-privilege database accounts** limit what a successful injection can read or modify.
- **Input validation** and a allowlist for sortable/filterable column names stop injection through dynamic identifiers.
- **ORMs** reduce raw SQL but do not fix injection when raw fragments are concatenated.

<div class="warning-callout">
<strong>Key distinction:</strong> constraints enforce *data* correctness, not *authorization*. A perfectly normalized schema with valid foreign keys can still leak every row if the query layer fails to check who is asking.
</div>
