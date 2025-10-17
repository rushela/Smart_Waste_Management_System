# MongoDB Connection Setup Guide

## Issue: MongoDB Atlas IP Whitelist Error

If you see this error:
```
MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster
```

This means your current IP address is not whitelisted in MongoDB Atlas.

## Solutions

### Option 1: Whitelist Your IP in MongoDB Atlas (Recommended)

1. **Go to MongoDB Atlas Dashboard**
   - Visit: https://cloud.mongodb.com/
   - Log in with your credentials

2. **Navigate to Network Access**
   - Click on "Network Access" in the left sidebar
   - Click "ADD IP ADDRESS"

3. **Add Your IP Address**
   - **For Development**: Click "ALLOW ACCESS FROM ANYWHERE" (adds 0.0.0.0/0)
   - **For Production**: Click "ADD CURRENT IP ADDRESS" to whitelist only your IP
   - Add a description (e.g., "Development Machine")
   - Click "Confirm"

4. **Wait for Changes to Apply** (usually takes 1-2 minutes)

5. **Restart Your Backend Server**

### Option 2: Use Local MongoDB (Alternative)

1. **Install MongoDB locally**
   ```bash
   # macOS
   brew tap mongodb/brew
   brew install mongodb-community@7.0
   
   # Start MongoDB
   brew services start mongodb-community@7.0
   ```

2. **Update your .env file**
   ```env
   MONGO_URI=mongodb://localhost:27017/smartwaste
   PORT=5000
   JWT_SECRET=dev_secret_change_me
   ```

3. **Restart your backend server**

### Option 3: Run Without Database (Development Mode)

The backend is configured to work without a database connection for development.
Simply comment out or remove the `MONGO_URI` in your `.env` file:

```env
# MONGO_URI=mongodb+srv://...
PORT=5000
JWT_SECRET=dev_secret_change_me
```

The server will use in-memory storage for users (data will be lost on restart).

## Verify Connection

After implementing any solution, you should see:
```
✅ Connected to MongoDB
```

Instead of the error message.

## Common Issues

### 1. Wrong Connection String
- Verify your username and password in the connection string
- Check that special characters in password are URL-encoded

### 2. Network Issues
- Try connecting to a different network
- Check if your firewall is blocking MongoDB ports

### 3. Database User Permissions
- Ensure the database user has read/write permissions
- Check in Atlas: Database Access → Edit User → Built-in Role

## Current Connection String Format

Your connection string should look like:
```
mongodb+srv://<username>:<password>@cluster0.gcwzw05.mongodb.net/<database>?retryWrites=true&w=majority&appName=Cluster0
```

Make sure to replace:
- `<username>` - Your MongoDB Atlas username
- `<password>` - Your MongoDB Atlas password (URL-encoded)
- `<database>` - Your database name (e.g., smartwaste)
