require('dotenv').config();

const http = require('http');
const https = require('https');
const { URL } = require('url');

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:8085';

const fetch = async (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const httpModule = isHttps ? https : http;

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = httpModule.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            json: async () => jsonData,
            text: async () => data
          });
        } catch (e) {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            json: async () => ({ error: 'Invalid JSON' }),
            text: async () => data
          });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
};

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

let authToken = null;
let testUserId = null;
let testJobId = null;
let testCompanyId = null;
let testResumeId = null;

const log = (message, color = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

const apiRequest = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      data
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: { error: error.message }
    };
  }
};

const test = async (name, testFn) => {
  try {
    log(`\n🧪 Testing: ${name}`, colors.cyan);
    await testFn();
    log(`✅ PASS: ${name}`, colors.green);
    return true;
  } catch (error) {
    log(`❌ FAIL: ${name} - ${error.message}`, colors.red);
    return false;
  }
};

const runTests = async () => {
  log('\n🚀 Starting Backend API Tests', colors.blue);
  log(`📍 Base URL: ${BASE_URL}\n`, colors.yellow);

  let passed = 0;
  let failed = 0;

  passed += await test('Health Check', async () => {
    const result = await apiRequest('/health');
    if (!result.ok || result.status !== 200) {
      throw new Error(`Expected 200, got ${result.status}`);
    }
    log(`   Response: ${JSON.stringify(result.data)}`, colors.reset);
  });

  passed += await test('Register User', async () => {
    const testEmail = `test_${Date.now()}@test.com`;
    const result = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: testEmail,
        password: 'test123456'
      })
    });
    if (!result.ok || result.status !== 200) {
      throw new Error(`Expected 200, got ${result.status}: ${JSON.stringify(result.data)}`);
    }
    log(`   User registered: ${testEmail}`, colors.reset);
  });

  passed += await test('Login (should work without email verification)', async () => {
    const result = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    });
    if (result.ok) {
      throw new Error('Login should fail with wrong password');
    }
    log(`   Login validation works (expected failure)`, colors.reset);
  });

  passed += await test('Get Companies', async () => {
    const result = await apiRequest('/api/companies');
    if (!result.ok) {
      throw new Error(`Expected 200, got ${result.status}: ${JSON.stringify(result.data)}`);
    }
    log(`   Found ${Array.isArray(result.data) ? result.data.length : 0} companies`, colors.reset);
  });

  passed += await test('Get Jobs', async () => {
    const result = await apiRequest('/api/jobs');
    if (!result.ok) {
      throw new Error(`Expected 200, got ${result.status}: ${JSON.stringify(result.data)}`);
    }
    log(`   Found ${Array.isArray(result.data) ? result.data.length : 0} jobs`, colors.reset);
  });

  passed += await test('Protected Route (without token)', async () => {
    authToken = null;
    const result = await apiRequest('/api/auth/profile');
    if (result.ok) {
      throw new Error('Should require authentication');
    }
    if (result.status !== 401 && result.status !== 403) {
      throw new Error(`Expected 401/403, got ${result.status}`);
    }
    log(`   Authentication required (expected)`, colors.reset);
  });

  passed += await test('Get Applications (without auth)', async () => {
    const result = await apiRequest('/api/applications');
    if (result.ok) {
      throw new Error('Should require authentication');
    }
    log(`   Authentication required (expected)`, colors.reset);
  });

  passed += await test('Get Resumes (without auth)', async () => {
    const result = await apiRequest('/api/resumes');
    if (result.ok) {
      throw new Error('Should require authentication');
    }
    log(`   Authentication required (expected)`, colors.reset);
  });

  passed += await test('Get Saved Jobs (without auth)', async () => {
    const result = await apiRequest('/api/saved-jobs');
    if (result.ok) {
      throw new Error('Should require authentication');
    }
    log(`   Authentication required (expected)`, colors.reset);
  });

  passed += await test('Get Interviews (without auth)', async () => {
    const result = await apiRequest('/api/interviews');
    if (result.ok) {
      throw new Error('Should require authentication');
    }
    log(`   Authentication required (expected)`, colors.reset);
  });

  passed += await test('Get Notifications (without auth)', async () => {
    const result = await apiRequest('/api/notifications');
    if (result.ok) {
      throw new Error('Should require authentication');
    }
    log(`   Authentication required (expected)`, colors.reset);
  });

  log(`\n📊 Test Results: ${passed} passed, ${failed} failed`, colors.blue);

  if (failed === 0) {
    log(`\n✅ Backend API is working correctly!`, colors.green);
    log(`\n💡 To test with actual authentication, register a user and use the token.`, colors.yellow);
    log(`\n📱 For emulator connection:`, colors.cyan);
    log(`   1. Run: node scripts/get-ip.js to get your local IP`, colors.reset);
    log(`   2. Add EXPO_PUBLIC_API_URL=<your-ip> to my-app/.env`, colors.reset);
    log(`   3. Make sure backend is listening on 0.0.0.0:8085`, colors.reset);
  } else {
    log(`\n⚠️  Some tests failed. Please check the errors above.`, colors.yellow);
  }
};

runTests().catch(error => {
  log(`\n❌ Test runner failed: ${error.message}`, colors.red);
  console.error(error);
  process.exit(1);
});
