# Intelligent Spreadsheet (MVP)

A role-based web application for managing post/task completion using a single-action workflow.

Content Associates complete tasks by clicking 👍 and submitting a required delivery note.
Admins can view all activity and filter completion data.


## MVP Overview

### Roles
- Admin
- Content Associate
---
### Core Idea
> Each task has exactly one action per associate:
>👍 Click + Required Delivery Note
---
Admins can:
- Create tasks
- Assign to all or specific associates
- View completion list per task
- Filter by user/date/status
---
Associates can:
- View assigned tasks
- Complete a task once
- Edit their delivery note
- See only their own activity
---
## Tech Stack (MVP)
- **Frontend:** Next.js (App Router)
- **Backend:** Next.js API Routes
- **Database:** Supabase (Postgres)
- **Auth:** Supabase Auth
- **Styling:** TailwindCSS
- **Hosting:** Vercel
---
## Project Structure
```javascript
/app
  /login
  /signup
  /dashboard
  /admin
  /api
    /auth
      signup/route.ts
      login/route.ts
    /posts
      route.ts
      [id]/route.ts
    /actions
      route.ts


/lib
  supabaseServer.ts
  auth.ts
  permissions.ts


/types
  index.ts
```
---
### Environment Variables
```env
DATABASE_URL=
JWT_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ADMIN_SECRET_KEY=your_super_secret_key
```
---
## Database Schema
### Users (Supabase Auth + profile table)
**profiles**
Column|Type
-------|---------
id| uuid (FK → auth.users)
name|	text
role|	text (ADMIN or ASSOCIATE)
created_at|	timestamp

---

**posts**
Column|Type
-------|---------
id|	uuid
title|	text
content|	text
created_by|	uuid
created_at|	timestamp
due_date|	timestamp (nullable)
assignment_scope|	text (ALL or SPECIFIC)
post_assignments (if SPECIFIC)

---

Column|Type
-------|---------
id|	uuid
post_id|	uuid
user_id|	uuid
post_actions
Column	Type
id|	uuid
post_id|	uuid
user_id|	uuid
delivery_note|	text
liked	boolean| (always true)
created_at|	timestamp
updated_at|	timestamp

### Unique constraint:
```javascript
UNIQUE(post_id, user_id)
```
Ensures one action per associate per post.
---
## Authentication Logic
### Admin Signup
- Requires ADMIN_SECRET_KEY
- If correct → role = ADMIN
- If not → reject
- Associate Signup
- Default role = ASSOCIATE
- Server-Side Protection
- Every API route:
- Validate Supabase session
- Fetch user profile
- Check role
- Reject unauthorized requests

## API Endpoints (MVP)
### Signup
POST /api/auth/signup
```json
{
  "email": "user@email.com",
  "password": "password",
  "name": "Faith",
  "adminKey": "optional"
}
```
Behavior:
- Else → ASSOCIATE
- If ```adminKey === ADMIN_SECRET_KEY``` → ADMIN

### Login
```POST /api/auth/login```
Returns Supabase session.

### Create Post (Admin Only)
```POST /api/posts```
```javascript
{
  "title": "Instagram Post",
  "content": "Create IG carousel",
  "dueDate": "2026-02-15",
  "assignmentScope": "ALL",
  "assignedUserIds": []
}
```
Server:
- Verify role = ADMIN
- Insert post
- If SPECIFIC → insert into post_assignments

### Get Posts
```GET /api/posts```
Behavior:
If ADMIN:
- Return all posts

If ASSOCIATE:
Return:
- Posts with assignment_scope = ALL
- Posts assigned specifically to user

Also attach:
- Completion status for that user

### Complete Task
```POST /api/actions```
```json
{
  "postId": "uuid",
  "deliveryNote": "Live on Instagram"
}
```
Server:
- Verify role = ASSOCIATE
- Verify user assigned
- Upsert into post_actions
- liked = true
- updated_at auto-updates

### Admin View Per Post
```GET /api/posts/:id```
Admin only.
Returns:
```json
{
  post,
  completions: [
    {
      name,
      delivery_note,
      created_at,
      updated_at
    }
  ]
}
```
## Dashboards
### Associate Dashboard
Displays:
Title	Due-Date	Status	Action
-------|---------|-------|---------

Status:
- Completed
- Not Completed

After completion:
- Show delivery note
- Allow edit

Must NOT display:
- Other associate names
- Other notes
- Other timestamps

### Admin Dashboard
Displays:
- All posts
- Completion count
- Completion list per post

Filters:
- By associate name
- By date range
- By completion status
