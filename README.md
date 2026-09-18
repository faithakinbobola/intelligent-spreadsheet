# Intelligent

Intelligent is an internal social-content task management dashboard. It helps admins publish and assign LinkedIn or Instagram content tasks, while content associates review their assigned work and record completion notes.

The application is designed for lightweight coordination and activity tracking. It is not a spreadsheet editor, social-media publishing API, or general-purpose project management system.

## Scope

### Admins

- Create social-content posts and set an optional due date.
- Assign posts to all associates or selected associates.
- View post activity and completion data.
- Filter posts by platform and date or timeframe.
- Review user activity, engagement counts, and last activity.
- Manage the associate directory.

### Content associates

- View posts assigned to them, including posts assigned to all associates.
- Mark a post as completed by submitting a delivery note.
- Update their delivery note after completion.
- View their own task and engagement activity.

Each associate can complete a given post once. Completion records include the delivery note and timestamps.

## Main Routes

- `/login` - Sign in.
- `/signup` - Create an associate account or an admin account with the admin key.
- `/dashboard` - Role-aware post dashboard and task list.
- `/dashboard/admin` - Admin user management and activity overview.
- `/dashboard/admin/create-post` - Admin post creation flow.
- `/callback` - Supabase authentication callback.

The home route redirects to `/login`. Dashboard and admin routes require an authenticated Supabase session, and admin-only features require the `ADMIN` role.

## Technology

- **Frontend:** Next.js App Router, React, TypeScript
- **Backend and authentication:** Supabase Auth and Supabase Postgres
- **Server actions:** Next.js server actions
- **Styling:** Tailwind CSS
- **Email:** Nodemailer
- **Deployment target:** Vercel

## Project Structure

```text
app/
  actions/              Server actions for auth, posts, and post activity
  callback/             Supabase auth callback
  dashboard/            Authenticated dashboard and admin pages
  login/                Login page
  signup/               Signup page
  page.tsx              Redirects visitors to /login

components/             Dashboard tables, filters, forms, and activity modals
lib/                    Auth, permissions, mailer, and Supabase clients
style/                  Global styles
types/                  Shared TypeScript types
```

## Environment Variables

Create a `.env.local` file with the Supabase credentials and application secrets required by the deployment:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_SECRET_KEY=
```

`ADMIN_SECRET_KEY` is used during signup to authorize creation of an admin account. Keep service-role and admin secrets server-side and never expose them in client-side code.

## Local Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

Useful commands:

```bash
npm run lint
npm run build
```

## Data Model

The application uses Supabase tables for:

- `profiles` - User name, role, and creation timestamp.
- `posts` - Social-content task title, content, due date, assignment scope, and creator.
- `post_assignments` - Explicit assignments when a post targets selected associates.
- `post_actions` - Associate completion, delivery note, and timestamps.

The `post_actions` table should enforce a unique `(post_id, user_id)` constraint so an associate has only one completion record per post.

## Roles and Access

- New accounts default to the `ASSOCIATE` role.
- The `ADMIN_SECRET_KEY` is required to create an `ADMIN` account.
- Authenticated users can access only their permitted dashboard data.
- Admin-only operations and user management are protected by role checks.
