# MongoDB Setup Guide

This guide will help you set up MongoDB Atlas for the leaderboard feature.

## Step 1: Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" and create an account
3. Choose the **FREE** tier (M0 Sandbox)

## Step 2: Create a Cluster

1. After signing up, you'll be prompted to create a cluster
2. Choose:
   - **Cloud Provider**: AWS (recommended)
   - **Region**: Choose the closest region to your users
   - **Cluster Tier**: M0 Sandbox (FREE)
3. Click "Create Cluster" (takes 3-5 minutes)

## Step 3: Set Up Database Access

1. Go to **Database Access** in the left sidebar
2. Click "Add New Database User"
3. Choose **Password** authentication
4. Set a username (e.g., `dmvcalifornia`)
5. Click "Autogenerate Secure Password" and **save it somewhere safe**
6. Set **Database User Privileges** to "Read and write to any database"
7. Click "Add User"

## Step 4: Set Up Network Access

1. Go to **Network Access** in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (or add specific IPs)
4. Click "Confirm"

> **Note**: For production, it's better to restrict to specific IPs, but "Allow Access from Anywhere" works for both development and Vercel deployment.

## Step 5: Get Your Connection String

1. Go to **Database** in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select:
   - **Driver**: Node.js
   - **Version**: 5.5 or later
5. Copy the connection string (it looks like this):
   ```
   mongodb+srv://username:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual database password
7. Add `/dmvcalifornia` after `.net/` to specify the database name:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/dmvcalifornia?retryWrites=true&w=majority
   ```

## Step 6: Add to Environment Variables

### Local Development

1. Create `.env.local` file in the project root (if it doesn't exist)
2. Add your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dmvcalifornia?retryWrites=true&w=majority
   ```

### Vercel Production

1. Go to your Vercel project dashboard
2. Click on "Settings"
3. Click on "Environment Variables"
4. Add a new variable:
   - **Name**: `MONGODB_URI`
   - **Value**: Your MongoDB connection string
   - **Environment**: Select all (Production, Preview, Development)
5. Click "Save"
6. Redeploy your application

## Step 7: Test the Connection

1. Complete a quiz on your local site
2. Submit your name to the leaderboard
3. Check MongoDB Atlas:
   - Go to **Database** > **Browse Collections**
   - You should see a `dmvcalifornia` database
   - Inside it, a `leaderboard` collection with your entry

## Troubleshooting

### "MongoServerError: bad auth"
- Double-check your username and password in the connection string
- Make sure you replaced `<password>` with your actual password

### "MongoNetworkError: connection timeout"
- Check Network Access settings in MongoDB Atlas
- Make sure "Allow Access from Anywhere" is enabled
- If using specific IPs, add Vercel's IP ranges

### "Cannot read property 'db' of undefined"
- Make sure `MONGODB_URI` is set in your `.env.local` file
- Restart your development server after adding the environment variable

## Database Schema

### Leaderboard Collection

```typescript
{
  _id: ObjectId,
  quizId: number,
  name: string,
  email: string (optional),
  points: number,
  percentage: number,
  date: string (YYYY-MM-DD),
  completedAt: string (ISO datetime),
  createdAt: Date
}
```

## Costs

MongoDB Atlas M0 (Free Tier) includes:
- 512 MB storage
- Shared RAM
- No credit card required
- Perfect for small to medium traffic sites

This should be sufficient for the leaderboard feature. Monitor your usage in the MongoDB Atlas dashboard.
