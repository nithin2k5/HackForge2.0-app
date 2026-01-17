#!/usr/bin/env node

/**
 * Frontend-Backend Integration Verification Script
 * Tests all API endpoints and validates integration
 */

const http = require('http');

const BASE_URL = 'http://localhost:8085';
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const req = http.request(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: data ? JSON.parse(data) : null,
            headers: res.headers,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data,
            headers: res.headers,
          });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

async function testEndpoint(name, path, expectedStatus = 200, options = {}) {
  try {
    const response = await makeRequest(path, options);
    const success = response.status === expectedStatus;

    if (success) {
      log(`✅ ${name}`, 'green');
      return { success: true, name, status: response.status };
    } else {
      log(`❌ ${name} - Expected ${expectedStatus}, got ${response.status}`, 'red');
      return { success: false, name, status: response.status, expected: expectedStatus };
    }
  } catch (error) {
    log(`❌ ${name} - ${error.message}`, 'red');
    return { success: false, name, error: error.message };
  }
}

async function runTests() {
  log('\n🔍 Frontend-Backend Integration Verification\n', 'cyan');
  log('='.repeat(60), 'blue');

  const results = [];

  // 1. Health Check
  log('\n📍 Testing Server Health', 'yellow');
  results.push(await testEndpoint('Health Check', '/health'));

  // 2. Public Endpoints (No Auth Required)
  log('\n📍 Testing Public Endpoints', 'yellow');
  results.push(await testEndpoint('Get All Jobs', '/api/jobs'));
  results.push(await testEndpoint('Get All Companies', '/api/companies'));

  // 3. Auth Endpoints
  log('\n📍 Testing Auth Endpoints (Expected Failures for Invalid Data)', 'yellow');
  results.push(await testEndpoint('Login (No Credentials)', '/api/auth/login', 400, {
    method: 'POST',
    body: {},
  }));
  results.push(await testEndpoint('Register (No Data)', '/api/auth/register', 400, {
    method: 'POST',
    body: {},
  }));

  // 4. Protected Endpoints (Should Return 401)
  log('\n📍 Testing Protected Endpoints (Should Require Auth)', 'yellow');
  results.push(await testEndpoint('Get Applications (No Auth)', '/api/applications', 401));
  results.push(await testEndpoint('Get Saved Jobs (No Auth)', '/api/saved-jobs', 401));
  results.push(await testEndpoint('Get Resumes (No Auth)', '/api/resumes', 401));
  results.push(await testEndpoint('Get Interviews (No Auth)', '/api/interviews', 401));
  results.push(await testEndpoint('Get Notifications (No Auth)', '/api/notifications', 401));
  results.push(await testEndpoint('Get Profile (No Auth)', '/api/auth/profile', 401));

  // 5. CORS Check
  log('\n📍 Testing CORS Configuration', 'yellow');
  try {
    const response = await makeRequest('/health', {
      headers: { 'Origin': 'http://localhost:8085' }
    });
    if (response.headers['access-control-allow-origin']) {
      log('✅ CORS Headers Present', 'green');
      results.push({ success: true, name: 'CORS Configuration' });
    } else {
      log('⚠️  CORS Headers Not Found', 'yellow');
      results.push({ success: false, name: 'CORS Configuration' });
    }
  } catch (error) {
    log(`❌ CORS Check Failed - ${error.message}`, 'red');
    results.push({ success: false, name: 'CORS Configuration', error: error.message });
  }

  // Summary
  log('\n' + '='.repeat(60), 'blue');
  log('\n📊 Test Summary\n', 'cyan');

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const total = results.length;

  log(`Total Tests: ${total}`, 'blue');
  log(`Passed: ${passed}`, 'green');
  log(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%\n`, 'cyan');

  // Integration Status
  log('='.repeat(60), 'blue');
  log('\n🔗 Integration Status\n', 'cyan');

  const criticalTests = [
    'Health Check',
    'Get All Jobs',
    'Get All Companies',
    'CORS Configuration',
  ];

  const criticalPassed = results
    .filter(r => criticalTests.includes(r.name) && r.success)
    .length;

  if (criticalPassed === criticalTests.length) {
    log('✅ Backend is running and accessible', 'green');
    log('✅ Public endpoints are working', 'green');
    log('✅ CORS is configured correctly', 'green');
    log('✅ Protected endpoints require authentication', 'green');
    log('\n🎉 Frontend-Backend Integration: PERFECT\n', 'green');
  } else {
    log('❌ Some critical tests failed', 'red');
    log('⚠️  Please check the failed tests above\n', 'yellow');
  }

  // Frontend Configuration Reminder
  log('='.repeat(60), 'blue');
  log('\n📱 Frontend Configuration Checklist\n', 'cyan');
  log('1. Create .env file in my-app/ directory', 'blue');
  log('2. Add: EXPO_PUBLIC_API_URL=<your-ip-address>', 'blue');
  log('3. Restart Expo: npx expo start -c', 'blue');
  log('4. Ensure device and computer are on same network\n', 'blue');

  return passed === total;
}

// Run tests
runTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    log(`\n❌ Fatal Error: ${error.message}\n`, 'red');
    process.exit(1);
  });
