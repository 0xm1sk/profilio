---
title: "MiniBank Internal System"
date: 2026-01-28
category: "Web Dev"
tags: ["laravel", "php", "rbac", "fintech"]
description: "A full-stack internal banking system implementing complex RBAC and transaction approval workflows."
tech_stack: ["Laravel", "PHP", "Blade", "MySQL"]
github: "https://github.com/0xm1sk/minibank"
---
# Project: MiniBank Internal System

A comprehensive internal banking system built with Laravel and Blade, focusing on secure transaction workflows and hierarchical access control.

## The Implementation
The core of the project is a multi-tiered Role-Based Access Control (RBAC) system that governs how clients and employees interact with the bank's ledger.

## Technical Details
- **Hierarchical Authorization:** Implemented a request-approval pipeline. Small withdrawals are automated, while larger amounts trigger a "Request" state that must be approved by an employee.
- **Escalation Logic:** Integrated a superior role system where high-value transactions are escalated to a management level for final authorization.
- **State Management:** Developed a client dashboard and an admin control panel to manage real-time transaction statuses.

## What I Learned
This project taught me the importance of "Principle of Least Privilege." By designing the permission layers, I learned how to prevent unauthorized access to sensitive financial functions at the application level.
