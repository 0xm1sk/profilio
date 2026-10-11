---
<br />
title: "The OSI Model"
<br />
date: 2026-09-24
<br />
category: "Networking"
<br />
tags: ["osi", "tcp-ip", "protocol", "layers"]
<br />
description: "Detailed breakdown of the Open Systems Interconnection model and data encapsulation."
<br />
---
<br />
# The OSI Model

The **OSI (Open Systems Interconnection)** model is a conceptual framework developed by the ISO to standardize network communications. It divides the complex process of data transmission into seven distinct layers.

## The Seven Layers

### 7. Application Layer
<br />
The interface between the user and the network. This is where software (browsers, email clients) interacts with network services.

### 6. Presentation Layer
<br />
Handles data translation, encoding, and encryption. It ensures that the data is in a format the receiving system can understand (e.g., translating data into **ASCII**).

### 5. Session Layer
<br />
Manages the establishment, maintenance, and termination of connections (sessions) between applications.

### 4. Transport Layer
<br />
Responsible for end-to-end communication and error recovery. It determines the protocol:
<br />
- **TCP (Transmission Control Protocol):** Connection-oriented, reliable, ensures data arrives in order.
<br />
- **UDP (User Datagram Protocol):** Connectionless, fast, "fire and forget."

### 3. Network Layer
<br />
Handles logical addressing and routing. This layer determines the best physical path for data to travel from source to destination (IP Addressing).

### 2. Data Link Layer
<br />
Provides node-to-node data transfer. It handles physical addressing (MAC addresses), flow control, and error detection at the link level.

### 1. Physical Layer
<br />
The raw hardware level. It defines the electrical, mechanical, and functional specifications for the physical medium (cables, radio waves) and transmits data as **bits**.

## Transmission Methods
<br />
Data is moved across the physical medium using different multiplexing techniques:
<br />
- **Sequential (TDM):** Time-division.
<br />
- **Temporal (FDM):** Frequency-division.
<br />
- **Mixed:** Combined approach for optimized bandwidth.
