# MongoDB Connection Fix Guide

## Issue: MongoDB Atlas IP Whitelist Error

The error indicates that your current IP address is not whitelisted in MongoDB Atlas.

## Solutions (Choose One)

### Option 1: Whitelist Your Current IP in MongoDB Atlas (Recommended for Production)

1. **Get Your Current IP Address:**
   ```bash
   curl ifconfig.me
   ```
   Or visit: https://whatismyipaddress.com/

2. **Add IP to MongoDB Atlas:**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Select your cluster
   - Click "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Enter your IP address or click "Add Current IP Address"
   - Click "Confirm"
   - Wait 1-2 minutes for the change to propagate

### Option 2: Allow Access from Anywhere (For Development Only)

⚠️ **Warning**: Not recommended for production!

1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (adds `0.0.0.0/0`)
4. Click "Confirm"

### Option 3: Use Local MongoDB (Best for Development)

Instead of MongoDB Atlas, use a local MongoDB instance:

#### Install MongoDB Locally:

**Using Homebrew (macOS):**
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB service
brew services start mongodb-community@7.0

# Verify it's running
mongosh
```

**Using Docker:**
```bash
# Run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Verify connection
docker exec -it mongodb mongosh
```

#### Update Your .env File:

```env
# Comment out Atlas connection
# MONGO_URI=mongodb+srv://...

# Use local MongoDB
MONGO_URI=mongodb://localhost:27017/waste_management
PORT=5000
NODE_ENV=development
```

### Option 4: Fix MongoDB Atlas Connection String

Sometimes the issue is with the connection string format. Update your `.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/waste_management?retryWrites=true&w=majority&appName=<your-app-name>
```

Replace:
- `<username>` - Your MongoDB Atlas username
- `<password>` - Your MongoDB Atlas password (URL-encoded if it contains special characters)
- `<cluster>` - Your cluster address (e.g., `ac-uuyaqki-shard-00-00.df6enii`)
- `<your-app-name>` - Your application name

**Note**: If your password contains special characters, encode them:
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- `?` → `%3F`
- `#` → `%23`

Example:
```
Password: P@ss:word/123
Encoded: P%40ss%3Aword%2F123
```

## After Making Changes

1. **Restart your server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm start
   ```

2. **Test the connection:**
   ```bash
   # You should see:
   # "Backend dev server listening on http://localhost:5000"
   # No MongoDB connection errors
   ```

3. **Run the seed script:**
   ```bash
   node seed/collectionSeed.js
   ```

## Recommended Setup for Development

Use **local MongoDB** for development:

```bash
# 1. Install MongoDB locally (using Homebrew on macOS)
brew tap mongodb/brew
brew install mongodb-community@7.0

# 2. Start MongoDB
brew services start mongodb-community@7.0

# 3. Update .env
echo "MONGO_URI=mongodb://localhost:27017/waste_management" >> .env

# 4. Restart your server
npm start

# 5. Seed the database
node seed/collectionSeed.js
```

## Verify Connection

Once connected successfully, you should see:
```
Backend dev server listening on http://localhost:5000
```

No error messages should appear.

Test with:
```bash
curl http://localhost:5000/health
# Should return: {"ok":true}
```

## Troubleshooting

### Still getting connection errors?

1. **Check if MongoDB is running:**
   ```bash
   # For Homebrew installation
   brew services list | grep mongodb
   
   # For Docker
   docker ps | grep mongo
   ```

2. **Test MongoDB connection directly:**
   ```bash
   mongosh mongodb://localhost:27017/waste_management
   ```

3. **Check your .env file:**
   ```bash
   cat .env
   # Verify MONGO_URI is set correctly
   ```

4. **For Atlas, verify credentials:**
   - Username and password are correct
   - Database user has read/write permissions
   - IP address is whitelisted

## Quick Fix Summary

**For immediate development work:**

```bash
# Install local MongoDB
brew install mongodb-community@7.0

# Start it
brew services start mongodb-community@7.0

# Update .env (create if doesn't exist)
cat > .env << 'EOF'
MONGO_URI=mongodb://localhost:27017/waste_management
PORT=5000
NODE_ENV=development
EOF

# Restart server
npm start

# Seed database
node seed/collectionSeed.js
```

This will get you up and running immediately without Atlas configuration issues!
