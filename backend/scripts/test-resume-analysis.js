require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { parseResume } = require('../services/resumeParserService');
const { suggestDomains } = require('../services/domainMatcher');

console.log('🧪 Testing Resume Analysis Bot\n');

// Create a sample resume text for testing
const sampleResumeText = `
John Doe
Software Engineer

SUMMARY
Experienced full-stack developer with 5+ years of experience in building web applications.
Proficient in JavaScript, React, Node.js, and cloud technologies.

SKILLS
- Programming Languages: JavaScript, TypeScript, Python, Java
- Frontend: React, Vue.js, HTML, CSS, Tailwind CSS
- Backend: Node.js, Express, Django, Spring Boot
- Databases: MySQL, PostgreSQL, MongoDB, Redis
- Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD, Jenkins
- Tools: Git, GitHub, Jira, Agile, Scrum

EXPERIENCE
Senior Software Engineer | Tech Corp | 2020 - Present
- Developed microservices architecture using Node.js and Docker
- Implemented CI/CD pipelines with Jenkins and GitHub Actions
- Built RESTful APIs and GraphQL endpoints
- Managed AWS infrastructure including EC2, S3, and Lambda

Software Developer | StartupXYZ | 2018 - 2020
- Created responsive web applications using React and Redux
- Integrated third-party APIs and payment gateways
- Performed code reviews and mentored junior developers
- Implemented unit testing with Jest and integration testing with Cypress

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2014 - 2018

CERTIFICATIONS
- AWS Certified Solutions Architect
- Certified Scrum Master
`;

// Test skill extraction
console.log('📝 Testing Skill Extraction...\n');
const { extractSkills } = require('../services/resumeParserService');
const skills = extractSkills(sampleResumeText);
console.log('✅ Extracted Skills:', skills);
console.log('   Total skills found:', skills.length);
console.log('');

// Test domain suggestion
console.log('🎯 Testing Domain Suggestion...\n');
const domains = suggestDomains(skills, sampleResumeText, 5);
console.log('✅ Suggested Domains:');
domains.forEach((domain, index) => {
    console.log(`   ${index + 1}. ${domain.domain} (${domain.confidence}% confidence)`);
    console.log(`      Matched Skills: ${domain.matchedSkills.join(', ')}`);
});
console.log('');

// Test with different resume profiles
const testProfiles = [
    {
        name: 'Data Scientist',
        text: 'Data Scientist with expertise in Python, machine learning, deep learning, TensorFlow, PyTorch, pandas, numpy, scikit-learn. Experience with big data technologies like Spark and Hadoop. Proficient in data visualization using Tableau and Power BI. Strong background in statistics and data analysis.'
    },
    {
        name: 'UI/UX Designer',
        text: 'UI/UX Designer with 4 years of experience. Expert in Figma, Sketch, Adobe XD, Photoshop, and Illustrator. Specializing in user interface design, user experience research, wireframing, prototyping, and design systems. Strong understanding of responsive design and accessibility.'
    },
    {
        name: 'DevOps Engineer',
        text: 'DevOps Engineer specializing in cloud infrastructure and automation. Extensive experience with AWS, Azure, Docker, Kubernetes, Terraform, Ansible. Proficient in CI/CD pipeline development using Jenkins, GitLab CI, and GitHub Actions. Strong Linux administration skills.'
    }
];

console.log('🧪 Testing Different Resume Profiles...\n');
testProfiles.forEach(profile => {
    console.log(`\n--- ${profile.name} ---`);
    const profileSkills = extractSkills(profile.text);
    const profileDomains = suggestDomains(profileSkills, profile.text, 3);
    console.log('Skills:', profileSkills.slice(0, 5).join(', '), '...');
    console.log('Top Domain:', profileDomains[0]?.domain, `(${profileDomains[0]?.confidence}%)`);
});

console.log('\n\n✅ All tests completed successfully!');
console.log('\n💡 To test with actual PDF/DOCX files:');
console.log('   1. Upload a resume through the API');
console.log('   2. Check the backend logs for analysis results');
console.log('   3. Query the database to see stored analysis data');
