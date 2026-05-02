This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Supabase Integration

This project is integrated with Supabase for database operations. Here's how to set it up:

### 1. Install Dependencies
Supabase JS client is already installed. If needed, reinstall with:
```bash
npm install @supabase/supabase-js
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

To get these values:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to Settings > API
4. Copy "Project URL" as `NEXT_PUBLIC_SUPABASE_URL`
5. Copy "anon public" key as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Database Setup
Create a `products` table in your Supabase database with at least these columns:
- `id` (integer, primary key, auto-increment)
- `name` (text)
- `description` (text, optional)
- `price` (numeric)
- `image_url` (text, optional)
- `category` (text, optional)
- `created_at` (timestamp with time zone, default: now())

### 4. Running the Application
Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3001` to see the products fetched from your Supabase database.

### 5. Project Structure
- `lib/supabase.ts` - Supabase client configuration
- `lib/products.ts` - Product fetching utilities
- `app/page.tsx` - Homepage displaying products
- `.env.local` - Environment variables (not committed to git)

### 6. Testing
The homepage will display products from your `products` table. If no products are found, you'll see a message prompting you to add products to your database.
