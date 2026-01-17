const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extract text from PDF file
 */
const extractTextFromPDF = async (filePath) => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text;
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        throw new Error('Failed to parse PDF file');
    }
};

/**
 * Extract text from DOCX file
 */
const extractTextFromDOCX = async (filePath) => {
    try {
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value;
    } catch (error) {
        console.error('Error extracting text from DOCX:', error);
        throw new Error('Failed to parse DOCX file');
    }
};

/**
 * Extract text from resume file based on file extension
 */
const extractTextFromResume = async (filePath) => {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.pdf') {
        return await extractTextFromPDF(filePath);
    } else if (ext === '.docx' || ext === '.doc') {
        return await extractTextFromDOCX(filePath);
    } else {
        throw new Error('Unsupported file format. Only PDF and DOCX are supported.');
    }
};

/**
 * Extract skills and technologies from resume text
 */
const extractSkills = (text) => {
    const skillsDatabase = {
        // Programming Languages
        'JavaScript': ['javascript', 'js', 'node.js', 'nodejs', 'react', 'vue', 'angular'],
        'Python': ['python', 'django', 'flask', 'pandas', 'numpy', 'pytorch', 'tensorflow'],
        'Java': ['java', 'spring', 'spring boot', 'hibernate', 'maven', 'gradle'],
        'C++': ['c++', 'cpp'],
        'C#': ['c#', 'csharp', '.net', 'asp.net'],
        'PHP': ['php', 'laravel', 'symfony', 'wordpress'],
        'Ruby': ['ruby', 'rails', 'ruby on rails'],
        'Go': ['golang', 'go'],
        'Swift': ['swift', 'ios'],
        'Kotlin': ['kotlin', 'android'],
        'TypeScript': ['typescript', 'ts'],
        'R': ['r programming', 'r language'],

        // Web Technologies
        'HTML/CSS': ['html', 'css', 'sass', 'scss', 'less', 'tailwind'],
        'React': ['react', 'reactjs', 'react.js', 'react native', 'redux', 'next.js', 'nextjs'],
        'Vue.js': ['vue', 'vuejs', 'vue.js', 'nuxt'],
        'Angular': ['angular', 'angularjs'],
        'Node.js': ['node', 'nodejs', 'node.js', 'express', 'nestjs'],

        // Databases
        'SQL': ['sql', 'mysql', 'postgresql', 'postgres', 'sqlite', 'mariadb', 'oracle', 'mssql'],
        'NoSQL': ['mongodb', 'nosql', 'cassandra', 'couchdb', 'dynamodb', 'redis'],
        'Database': ['database', 'db', 'rdbms'],

        // Cloud & DevOps
        'AWS': ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'cloudformation'],
        'Azure': ['azure', 'microsoft azure'],
        'GCP': ['gcp', 'google cloud', 'google cloud platform'],
        'Docker': ['docker', 'containerization', 'containers'],
        'Kubernetes': ['kubernetes', 'k8s'],
        'CI/CD': ['ci/cd', 'jenkins', 'gitlab ci', 'github actions', 'travis ci', 'circleci'],
        'DevOps': ['devops', 'infrastructure', 'terraform', 'ansible', 'puppet', 'chef'],

        // Data Science & ML
        'Machine Learning': ['machine learning', 'ml', 'deep learning', 'neural networks', 'ai', 'artificial intelligence'],
        'Data Science': ['data science', 'data analysis', 'data analytics', 'statistics'],
        'Big Data': ['big data', 'hadoop', 'spark', 'kafka', 'hive'],
        'Data Visualization': ['tableau', 'power bi', 'data visualization', 'matplotlib', 'seaborn', 'd3.js'],

        // Design
        'UI/UX': ['ui', 'ux', 'user interface', 'user experience', 'figma', 'sketch', 'adobe xd'],
        'Graphic Design': ['photoshop', 'illustrator', 'indesign', 'graphic design', 'adobe creative'],

        // Mobile Development
        'Mobile Development': ['mobile', 'ios', 'android', 'react native', 'flutter', 'xamarin'],

        // Other Technologies
        'Git': ['git', 'github', 'gitlab', 'bitbucket', 'version control'],
        'Agile': ['agile', 'scrum', 'kanban', 'jira'],
        'Testing': ['testing', 'unit testing', 'jest', 'mocha', 'selenium', 'cypress', 'qa'],
        'API': ['rest', 'restful', 'api', 'graphql', 'soap'],
        'Microservices': ['microservices', 'microservice architecture'],
        'Blockchain': ['blockchain', 'ethereum', 'solidity', 'web3', 'cryptocurrency'],
        'Cybersecurity': ['security', 'cybersecurity', 'penetration testing', 'ethical hacking'],
    };

    const lowerText = text.toLowerCase();
    const foundSkills = [];

    Object.entries(skillsDatabase).forEach(([skill, keywords]) => {
        const found = keywords.some(keyword => {
            const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            return regex.test(lowerText);
        });

        if (found) {
            foundSkills.push(skill);
        }
    });

    return foundSkills;
};

/**
 * Parse resume and extract all relevant information
 */
const parseResume = async (filePath) => {
    try {
        // Extract text from file
        const text = await extractTextFromResume(filePath);

        // Extract skills
        const skills = extractSkills(text);

        return {
            parsedText: text,
            skills: skills,
            parsedAt: new Date()
        };
    } catch (error) {
        console.error('Error parsing resume:', error);
        throw error;
    }
};

module.exports = {
    parseResume,
    extractTextFromResume,
    extractSkills
};
