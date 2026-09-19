---
title: "Simple2D Wave Shooter"
date: 2026-05-14
category: "Game Dev"
tags: ["c", "raylib", "game-loop", "math"]
description: "A wave-based survival shooter focusing on manual memory management and real-time state synchronization in C."
tech_stack: ["C", "Raylib"]
github: "https://github.com/0xm1sk/simple2d"
---
# Project: Simple2D Wave Shooter

A wave-based survival shooter built using C and the Raylib library. This project served as an exercise in manual memory management and real-time state synchronization.

## The Implementation
The game implements a full state machine (`STATE_MENU`, `STATE_GAME`, `STATE_GAMEOVER`) and a dynamic enemy spawning system.

## Technical Details
- **Vector Math:** Implemented auto-aiming logic using `Vector2Normalize` and `Vector2Subtract` to calculate the trajectory from the player to the closest enemy.
- **Memory Management:** Managed a fixed-size array of `Bullet` and `Enemy` structs, utilizing an `active` flag to recycle memory and avoid constant allocations/deallocations.
- **Collision Logic:** Implemented Circle-to-Rectangle collision detection to handle combat interactions.

## What I Learned
Building this in C highlighted the importance of structure padding and the challenges of managing game state across different frames. It provided a practical look at how data is organized in memory.
