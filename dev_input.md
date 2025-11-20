# Developer Input Required

This file tracks manual actions needed from the developer during the build process.

---

## Task 1.0: Project Setup & Infrastructure Configuration

### 1.3 - Supabase Project Setup
**Status**: ⏳ Pending

**Action Required**:
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in:
   - Project Name: `pm-wizard` (or your preferred name)
   - Database Password: (generate a strong password and save it)
   - Region: (choose closest to your users)
4. Wait for project to be created (~2 minutes)
5. Once ready, go to Project Settings → API
6. Copy the following values and add them to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<your-project-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   ```

---

### 1.6 - Cloudflare R2 Setup
**Status**: ⏳ Pending

**Action Required**:
1. Go to https://dash.cloudflare.com
2. Navigate to R2 Object Storage
3. Click "Create bucket"
   - Bucket name: `pm-wizard-files` (or your preferred name)
   - Location: Automatic
4. After creation, go to "Manage R2 API Tokens"
5. Click "Create API Token"
   - Token name: `pm-wizard-api`
   - Permissions: Object Read & Write
   - Apply to specific buckets: Select your bucket
6. Copy the credentials and add to `.env.local`:
   ```
   CLOUDFLARE_ACCOUNT_ID=<your-account-id>
   R2_ACCESS_KEY_ID=<your-access-key-id>
   R2_SECRET_ACCESS_KEY=<your-secret-access-key>
   R2_BUCKET_NAME=pm-wizard-files
   ```
7. Configure CORS settings in R2 bucket:
   - Go to bucket settings → CORS policy
   - Add this configuration:
   ```json
   [
     {
       "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedHeaders": ["*"],
       "ExposeHeaders": ["ETag"],
       "MaxAgeSeconds": 3000
     }
   ]
   ```

---

### 1.5 - OpenAI API Key
**Status**: ⏳ Pending

**Action Required**:
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
   - Name: `pm-wizard`
3. Copy the key (you won't see it again!)
4. Add to `.env.local`:
   ```
   OPENAI_API_KEY=<your-api-key>
   ```
5. Set up usage limits:
   - Go to Settings → Billing → Usage limits
   - Set monthly limit to $100 to prevent overages

---

### 1.5 - Resend API Key
**Status**: ⏳ Pending

**Action Required**:
1. Go to https://resend.com/api-keys
2. Click "Create API Key"
   - Name: `pm-wizard`
   - Permission: Sending access
3. Copy the key
4. Add to `.env.local`:
   ```
   RESEND_API_KEY=<your-api-key>
   ```
5. Add and verify your sending domain:
   - Go to Domains → Add Domain
   - Follow DNS verification steps
   - Add to `.env.local`:
   ```
   RESEND_FROM_EMAIL=notifications@yourdomain.com
   ```

---

### 1.8 - Google Analytics 4
**Status**: ⏳ Pending

**Action Required**:
1. Go to https://analytics.google.com
2. Create a new GA4 property
3. Get your Measurement ID (format: G-XXXXXXXXXX)
4. Add to `.env.local`:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=<your-measurement-id>
   ```

---

## Task 2.0: Database Schema & Core Models

### 2.11 - Push Migrations to Supabase
**Status**: ⏳ Pending

**Action Required**:
1. Install Supabase CLI if not already installed:
   ```bash
   npm install -g supabase
   ```
2. Initialize Supabase in your project:
   ```bash
   supabase init
   ```
3. Link your local project to Supabase:
   ```bash
   supabase link --project-ref <your-project-ref>
   ```
   (Find project ref in Supabase dashboard URL or Project Settings)
4. Push migrations:
   ```bash
   supabase db push
   ```
5. Verify migrations applied:
   - Go to Supabase Dashboard → SQL Editor
   - Run: `SELECT * FROM information_schema.tables WHERE table_schema = 'public';`
   - Check that all tables exist (organizations, projects, tasks, user_project_roles, etc.)

---

### 2.12 - Run Database Seed Script
**Status**: ⏳ Pending

**Action Required**:
1. First, create test users in Supabase Auth:
   - Go to Supabase Dashboard → Authentication → Users
   - Click "Add user" and create:
     - admin@example.com (password: test123456)
     - member@example.com (password: test123456)
     - viewer@example.com (password: test123456)
   - Copy the user IDs (UUIDs) for each user

2. Update the seed script with actual user IDs:
   - Open `supabase/seed.sql`
   - Replace the commented user UUID placeholders with actual IDs
   - Uncomment the INSERT statements for user_organization_roles, user_project_roles, and tasks

3. Run the seed script:
   - Go to Supabase Dashboard → SQL Editor
   - Copy and paste the contents of `supabase/seed.sql`
   - Click "Run"
   
4. Verify seed data:
   - Check organizations table has "Acme Corporation"
   - Check user_project_roles table has role assignments
   - Check projects table has "Website Redesign" project
   - Check tasks table has sample tasks

---

## Task 22.0: Deployment & Monitoring

### 22.3 - Vercel Deployment Setup
**Status**: ⏳ Pending

**Action Required**:
1. Push code to GitHub repository
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: (leave default)
   - Output Directory: (leave default)
5. Add all environment variables from `.env.local` to Vercel:
   - Go to Settings → Environment Variables
   - Add each variable for Production, Preview, and Development
6. Deploy!

---

### 22.7 - Resend Production Domain Verification
**Status**: ⏳ Pending

**Action Required**:
1. In Resend dashboard, verify your production domain
2. Add DNS records as instructed:
   - DKIM record
   - SPF record
   - DMARC record (optional but recommended)
3. Wait for verification (can take up to 48 hours)
4. Test email sending in production

---

## Completed Actions

(This section will be updated as you complete the manual steps above)

---

## Notes

- Keep this file updated as you complete each action
- Mark items as ✅ Complete when done
- Add any issues or notes encountered during setup
- This file is in .gitignore - your credentials stay local
