# PlayOps — API Design Specification

This document provides a comprehensive RESTful API and Server Actions specification for the **PlayOps — KK Wagh Sports Portal**.

---

## 📑 Table of Contents
1. [Overview & Standards](#overview--standards)
2. [Authentication & User Endpoints](#1-authentication--users)
3. [Player Management Endpoints](#2-players)
4. [Sports Management Endpoints](#3-sports)
5. [Team Management Endpoints](#4-teams)
6. [Tournament Management Endpoints](#5-tournaments)
7. [Match & Live Scoring Endpoints](#6-matches--live-scoring)
8. [Points Table & Standings Endpoints](#7-points-table)
9. [Venues & Facilities Endpoints](#8-venues)
10. [Notifications Endpoints](#9-notifications)
11. [Certificates & Awards Endpoints](#10-certificates--awards)
12. [Dashboard & Analytics Endpoints](#11-dashboard--analytics)
13. [Server Actions Architecture](#server-actions-architecture)

---

## Overview & Standards

### Base URL
```
Production: https://playops.kkwagh.edu/api/v1
Development: http://localhost:3000/api/v1
```

### Standard Response Envelope
All API endpoints return standard JSON responses:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Response Envelope
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested match was not found",
    "details": [
      {
        "field": "matchId",
        "issue": "Invalid UUID format"
      }
    ]
  }
}
```

### HTTP Status Codes
| Status Code | Description | Usage |
| :--- | :--- | :--- |
| `200 OK` | Successful GET/PUT/PATCH | Data retrieved or resource updated |
| `201 Created` | Successful POST | New entity created |
| `204 No Content` | Successful DELETE | Resource removed without body |
| `400 Bad Request` | Validation Error | Malformed body or failed Zod validation |
| `401 Unauthorized` | Authentication Required | Missing/expired JWT token |
| `403 Forbidden` | Insufficient Permissions | Role not authorized for resource |
| `404 Not Found` | Resource Missing | Entity does not exist |
| `409 Conflict` | Unique Constraint Violation | Duplicate entry (e.g., student ID, email) |
| `500 Server Error` | Uncaught Exception | Internal server error |

---

## 1. Authentication & Users

### 1.1 User Registration
* **Method & Path:** `POST /api/v1/auth/register`
* **Access:** Public
* **Description:** Register new student/player account with basic user and player profile.

#### Request Body
```json
{
  "email": "atharva.kkw@kkwagh.edu",
  "password": "SecurePassword123!",
  "fullName": "Atharva Joshi",
  "role": "player",
  "phone": "+919876543210",
  "playerProfile": {
    "registrationNumber": "KKW2024CS045",
    "department": "Computer Engineering",
    "year": 3,
    "dateOfBirth": "2004-06-15",
    "bloodGroup": "O+",
    "sportsInterested": ["Cricket", "Football"]
  }
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "u1234-uuid",
      "email": "atharva.kkw@kkwagh.edu",
      "fullName": "Atharva Joshi",
      "role": "player"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

---

### 1.2 User Login
* **Method & Path:** `POST /api/v1/auth/login`
* **Access:** Public
* **Description:** Authenticate user and receive session token.

#### Request Body
```json
{
  "email": "admin@kkwagh.edu",
  "password": "AdminPassword123!"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "a9876-uuid",
      "email": "admin@kkwagh.edu",
      "fullName": "Prof. S. R. Patil",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.3 Get Current User Session
* **Method & Path:** `GET /api/v1/auth/me`
* **Access:** Authenticated (All Roles)

---

## 2. Players

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/players` | Admin | List all registered players with search & filters |
| `GET` | `/api/v1/players/:id` | Authenticated | Get player details & stats |
| `PUT` | `/api/v1/players/:id` | Player (Self) / Admin | Update player profile |
| `DELETE` | `/api/v1/players/:id` | Admin | Deactivate player profile |
| `GET` | `/api/v1/players/:id/qr` | Authenticated | Get or generate player digital QR pass |
| `GET` | `/api/v1/players/:id/performance` | Authenticated | Get player aggregated statistics |

#### Example: `GET /api/v1/players/:id` Response
```json
{
  "success": true,
  "data": {
    "id": "p-550e8400-e29b-41d4-a716-446655440000",
    "userId": "u1234-uuid",
    "fullName": "Atharva Joshi",
    "registrationNumber": "KKW2024CS045",
    "department": "Computer Engineering",
    "year": 3,
    "bloodGroup": "O+",
    "sportsInterested": ["Cricket", "Football"],
    "qrCode": "https://supabase-storage/qr/KKW2024CS045.svg",
    "performance": {
      "matchesPlayed": 14,
      "wins": 10,
      "mvpAwards": 3,
      "goalsOrRuns": 245
    }
  }
}
```

---

## 3. Sports

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/sports` | Public | List all supported sports |
| `POST` | `/api/v1/sports` | Admin | Add a new sport |
| `GET` | `/api/v1/sports/:id` | Public | Get single sport details & rules |
| `PUT` | `/api/v1/sports/:id` | Admin | Update sport config & rules |
| `DELETE` | `/api/v1/sports/:id` | Admin | Remove/deactivate sport |

---

## 4. Teams

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/teams` | Public | List teams (filter by sport/tournament) |
| `POST` | `/api/v1/teams` | Admin / Captain | Create team |
| `GET` | `/api/v1/teams/:id` | Public | Team details with roster & stats |
| `PUT` | `/api/v1/teams/:id` | Admin / Captain | Update team details / captain |
| `POST` | `/api/v1/teams/:id/players` | Admin / Captain | Add player to team roster |
| `DELETE` | `/api/v1/teams/:id/players/:playerId` | Admin / Captain | Remove player from team roster |

---

## 5. Tournaments

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/tournaments` | Public | List tournaments (filter by status, sport) |
| `POST` | `/api/v1/tournaments` | Admin | Create tournament |
| `GET` | `/api/v1/tournaments/:id` | Public | Full tournament overview & brackets |
| `PUT` | `/api/v1/tournaments/:id` | Admin | Update tournament details & schedule |
| `POST` | `/api/v1/tournaments/:id/register` | Player / Team | Register team for tournament |
| `POST` | `/api/v1/tournaments/:id/generate-fixtures` | Admin | Auto-generate bracket/league fixtures |
| `GET` | `/api/v1/tournaments/:id/points-table` | Public | Get tournament points table |

#### Example: `POST /api/v1/tournaments/:id/generate-fixtures` Request
```json
{
  "format": "knockout",
  "seedType": "random",
  "startDate": "2026-10-15T09:00:00Z",
  "matchIntervalHours": 3,
  "venueIds": ["v-ground-a-uuid", "v-ground-b-uuid"]
}
```

---

## 6. Matches & Live Scoring

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/matches` | Public | List matches (filter by date, status, sport) |
| `POST` | `/api/v1/matches` | Admin | Schedule individual match |
| `GET` | `/api/v1/matches/:id` | Public | Get match scorecard & event log |
| `PUT` | `/api/v1/matches/:id` | Admin | Update match schedule / venue |
| `PATCH` | `/api/v1/matches/:id/score` | Admin / Scorer | Push live score increment (broadcasts via Realtime) |
| `POST` | `/api/v1/matches/:id/events` | Admin / Scorer | Log match event (goal, wicket, card) |
| `POST` | `/api/v1/matches/:id/conclude` | Admin / Scorer | Conclude match & update points table |

#### Example: `PATCH /api/v1/matches/:id/score` Payload
```json
{
  "scoreTeamA": 2,
  "scoreTeamB": 1,
  "matchStatus": "live",
  "currentPeriod": "2nd Half - 75'",
  "recentEvent": {
    "type": "goal",
    "playerId": "p-550e8400-e29b-41d4-a716-446655440000",
    "teamId": "team-a-uuid",
    "description": "Atharva Joshi scores header from corner kick"
  }
}
```

---

## 7. Points Table

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/tournaments/:id/points-table` | Public | Fetch live calculated points standings |
| `POST` | `/api/v1/tournaments/:id/points-table/recalculate` | Admin | Manually trigger full table recalculation |

---

## 8. Venues

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/venues` | Public | List sports grounds, courts, facilities |
| `POST` | `/api/v1/venues` | Admin | Register new venue |
| `PUT` | `/api/v1/venues/:id` | Admin | Update venue availability / details |
| `GET` | `/api/v1/venues/:id/schedule` | Public | View venue occupancy timetable |

---

## 9. Notifications

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/notifications` | Authenticated | List notifications for logged-in user |
| `PATCH` | `/api/v1/notifications/:id/read` | Authenticated | Mark notification as read |
| `POST` | `/api/v1/notifications/broadcast` | Admin | Send announcement to all players/teams |

---

## 10. Certificates & Awards

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/certificates` | Authenticated | View earned certificates |
| `POST` | `/api/v1/certificates/generate` | Admin | Bulk-generate certificate PDFs |
| `GET` | `/api/v1/certificates/:id/download` | Authenticated | Download certified PDF |

---

## 11. Dashboard & Analytics

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/admin/dashboard/metrics` | Admin | Total players, active tournaments, live matches |
| `GET` | `/api/v1/analytics/sports-distribution` | Admin / Public | Participation rate by department & sport |
| `GET` | `/api/v1/reports/tournament/:id/pdf` | Admin | Export comprehensive tournament summary PDF |

---

## Server Actions Architecture

In addition to REST endpoints, Next.js 15 Server Actions are utilized for direct form mutations and reactive server-side state transitions:

```typescript
// src/lib/actions/match-actions.ts
'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const UpdateScoreSchema = z.object({
  matchId: z.string().uuid(),
  scoreTeamA: z.number().min(0),
  scoreTeamB: z.number().min(0),
  status: z.enum(['scheduled', 'live', 'completed', 'cancelled'])
})

export async function updateMatchScoreAction(formData: FormData) {
  const supabase = await createServerClient()
  
  // Validate input
  const validated = UpdateScoreSchema.parse({
    matchId: formData.get('matchId'),
    scoreTeamA: Number(formData.get('scoreTeamA')),
    scoreTeamB: Number(formData.get('scoreTeamB')),
    status: formData.get('status')
  })

  // Update in DB (triggers Supabase Realtime broadcast)
  const { data, error } = await supabase
    .from('matches')
    .update({
      score_team_a: validated.scoreTeamA,
      score_team_b: validated.scoreTeamB,
      status: validated.status,
      updated_at: new Date().toISOString()
    })
    .eq('id', validated.matchId)
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(`/matches/${validated.matchId}`)
  revalidatePath(`/live`)
  return { success: true, data }
}
```
