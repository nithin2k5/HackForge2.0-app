# Network Setup Guide for React Native Development

## Problem
When running the Expo app on a physical device or emulator, `localhost` doesn't work because it refers to the device itself, not your development machine.

## Solution

### Step 1: Find Your Computer's IP Address

**On macOS/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```
Look for an IP like `192.168.1.xxx` or `10.0.0.xxx`

**On Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter.

**Alternative (macOS):**
```bash
ipconfig getifaddr en0
```

### Step 2: Create .env File

Create a `.env` file in the `my-app` directory:

```env
EXPO_PUBLIC_API_URL=192.168.1.100
```

Replace `192.168.1.100` with your actual IP address.

### Step 3: Update Backend Server

Make sure your backend server is listening on all interfaces (0.0.0.0), not just localhost:

In `backend/server.js`, the server should already be configured correctly:
```javascript
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

This will listen on all network interfaces by default.

### Step 4: Restart Expo

After creating/updating the `.env` file:
1. Stop the Expo dev server (Ctrl+C)
2. Clear cache: `npx expo start -c`
3. Restart: `npx expo start`

### Step 5: Verify Connection

1. Make sure your phone/emulator and computer are on the same WiFi network
2. Check that the backend is running: `http://YOUR_IP:8081/health`
3. Try the app again

## Troubleshooting

### Still getting "Network request failed"?

1. **Check firewall**: Make sure port 8081 is not blocked
2. **Check network**: Device and computer must be on same network
3. **Try different IP**: Your IP might have changed
4. **Use ngrok** (alternative): For testing across networks
   ```bash
   npx ngrok http 8081
   ```
   Then use the ngrok URL in your `.env` file

### For iOS Simulator
iOS Simulator can use `localhost` directly, so you can keep using `http://localhost:8081` if testing only on iOS Simulator.

### For Android Emulator
Android Emulator uses `10.0.2.2` to refer to the host machine's localhost:
```env
EXPO_PUBLIC_API_URL=10.0.2.2
```

## Quick Reference

- **Physical Device**: Use your computer's local IP (e.g., `192.168.1.100`)
- **iOS Simulator**: Can use `localhost`
- **Android Emulator**: Use `10.0.2.2`
- **Production**: Use your production API URL
