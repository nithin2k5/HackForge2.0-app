const os = require('os');

const getLocalIP = () => {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }

  return 'localhost';
};

const ip = getLocalIP();
console.log(`\n📍 Your local IP address: ${ip}`);
console.log(`\n💡 For emulator connection, add this to your .env file:`);
console.log(`   EXPO_PUBLIC_API_URL=${ip}`);
console.log(`\n📱 Backend URL for emulator: http://${ip}:8085\n`);
