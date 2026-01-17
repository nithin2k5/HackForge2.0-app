require('dotenv').config();
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:8085';

// Test data
const testUser = {
    email: '2300031401cse2@gmail.com',
    password: 'password123'
};

async function testApplicationSubmission() {
    console.log('🧪 Testing Application Submission\n');

    try {
        // Step 1: Login to get token
        console.log('1️⃣ Logging in...');
        const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });

        if (!loginResponse.ok) {
            const error = await loginResponse.json();
            console.error('❌ Login failed:', error);
            return;
        }

        const loginData = await loginResponse.json();
        const token = loginData.token;
        console.log('✅ Login successful');
        console.log('   User:', loginData.user.name);
        console.log('');

        // Step 2: Get a job to apply to
        console.log('2️⃣ Fetching available jobs...');
        const jobsResponse = await fetch(`${BASE_URL}/api/jobs`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!jobsResponse.ok) {
            console.error('❌ Failed to fetch jobs');
            return;
        }

        const jobs = await jobsResponse.json();
        if (jobs.length === 0) {
            console.error('❌ No jobs available to apply to');
            return;
        }

        const job = jobs[0];
        console.log('✅ Found job:', job.title);
        console.log('   Company:', job.company_name);
        console.log('   Job ID:', job.id);
        console.log('   Company ID:', job.company_id);
        console.log('');

        // Step 3: Submit application
        console.log('3️⃣ Submitting application...');
        const applicationData = {
            job_id: job.id,
            company_id: job.company_id,
            status: 'Application Sent',
            match_score: 85,
            cover_letter: 'I am very interested in this position and believe my skills align well with the requirements.',
            notes: 'Applied via mobile app'
        };

        console.log('   Application data:', JSON.stringify(applicationData, null, 2));

        const applyResponse = await fetch(`${BASE_URL}/api/applications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(applicationData)
        });

        const responseText = await applyResponse.text();
        console.log('   Response status:', applyResponse.status);
        console.log('   Response body:', responseText);

        if (!applyResponse.ok) {
            console.error('❌ Application submission failed');
            try {
                const errorData = JSON.parse(responseText);
                console.error('   Error:', errorData.error || errorData.message);
            } catch (e) {
                console.error('   Raw error:', responseText);
            }
            return;
        }

        const applicationResult = JSON.parse(responseText);
        console.log('✅ Application submitted successfully!');
        console.log('   Application ID:', applicationResult.application.id);
        console.log('   Status:', applicationResult.application.status);
        console.log('');

        // Step 4: Verify in database
        console.log('4️⃣ Verifying application in database...');
        const verifyResponse = await fetch(`${BASE_URL}/api/applications`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!verifyResponse.ok) {
            console.error('❌ Failed to fetch applications');
            return;
        }

        const applications = await verifyResponse.json();
        console.log('✅ Found', applications.length, 'application(s) in database');

        if (applications.length > 0) {
            const app = applications[0];
            console.log('   Latest application:');
            console.log('     - Job:', app.job_title);
            console.log('     - Company:', app.company_name);
            console.log('     - Status:', app.status);
            console.log('     - Match Score:', app.match_score);
            console.log('     - Applied:', app.applied_at);
        }

        console.log('\n✅ All tests passed!');

    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
        console.error('   Stack:', error.stack);
    }
}

testApplicationSubmission();
