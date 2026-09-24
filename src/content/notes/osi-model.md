---
title: "The OSI Model"
date: 2026-09-24
category: "Networking"
tags: ["osi", "tcp-ip", "protocol", "layers"]
description: "Detailed breakdown of the Open Systems Interconnection model and data encapsulation."
---
# The OSI Model

The **OSI (Open Systems Interconnection)** model is a conceptual framework developed by the ISO to standardize network communications. It divides the complex process of data transmission into seven distinct layers.

## The Seven Layers

### 7. Application Layer
The interface between the user and the network. This is where software (browsers, email clients) interacts with network services.

### 6. Presentation Layer
Handles data translation, encoding, and encryption. It ensures that the data is in a format the receiving system can understand (e.g., translating data into **ASCII**).

### 5. Session Layer
Manages the establishment, maintenance, and termination of connections (sessions) between applications.

### 4. Transport Layer
Responsible for end-to-end communication and error recovery. It determines the protocol:
- **TCP (Transmission Control Protocol):** Connection-oriented, reliable, ensures data arrives in order.
- **UDP (User Datagram Protocol):** Connectionless, fast, "fire and forget."

### 3. Network Layer
Handles logical addressing and routing. This layer determines the best physical path for data to travel from source to destination (IP Addressing).

### 2. Data Link Layer
Provides node-to-node data transfer. It handles physical addressing (MAC addresses), flow control, and error detection at the link level.

### 1. Physical Layer
The raw hardware level. It defines the electrical, mechanical, and functional specifications for the physical medium (cables, radio waves) and transmits data as **bits**.

## Transmission Methods
Data is moved across the physical medium using different multiplexing techniques:
- **Sequential (TDM):** Time-division.
- **Temporal (FDM):** Frequency-division.
- **Mixed:** Combined approach for optimized bandwidth.
