/**
 * Domain Matcher Service
 * Matches extracted skills to relevant job domains
 */

// Define job domains with their associated keywords and skills
const JOB_DOMAINS = {
    'Software Development': {
        keywords: ['software', 'developer', 'programming', 'coding', 'engineer'],
        skills: ['JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js', 'Git', 'API', 'Microservices'],
        weight: 1.0
    },
    'Web Development': {
        keywords: ['web', 'frontend', 'backend', 'full stack', 'fullstack'],
        skills: ['HTML/CSS', 'JavaScript', 'React', 'Vue.js', 'Angular', 'Node.js', 'PHP', 'TypeScript'],
        weight: 1.0
    },
    'Mobile Development': {
        keywords: ['mobile', 'ios', 'android', 'app development'],
        skills: ['Mobile Development', 'Swift', 'Kotlin', 'React', 'JavaScript'],
        weight: 1.0
    },
    'Data Science': {
        keywords: ['data scientist', 'data analysis', 'analytics', 'statistics'],
        skills: ['Python', 'R', 'Data Science', 'Machine Learning', 'Data Visualization', 'SQL'],
        weight: 1.0
    },
    'Machine Learning / AI': {
        keywords: ['machine learning', 'artificial intelligence', 'deep learning', 'neural network', 'ai', 'ml'],
        skills: ['Python', 'Machine Learning', 'Data Science', 'Big Data'],
        weight: 1.0
    },
    'DevOps / Cloud Engineering': {
        keywords: ['devops', 'cloud', 'infrastructure', 'sre', 'site reliability'],
        skills: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'DevOps', 'Git'],
        weight: 1.0
    },
    'Database Administration': {
        keywords: ['database', 'dba', 'data management'],
        skills: ['SQL', 'NoSQL', 'Database'],
        weight: 1.0
    },
    'UI/UX Design': {
        keywords: ['ui', 'ux', 'user interface', 'user experience', 'design', 'designer'],
        skills: ['UI/UX', 'Graphic Design'],
        weight: 1.0
    },
    'Quality Assurance': {
        keywords: ['qa', 'quality assurance', 'testing', 'test engineer', 'sdet'],
        skills: ['Testing', 'API', 'Git'],
        weight: 1.0
    },
    'Cybersecurity': {
        keywords: ['security', 'cybersecurity', 'infosec', 'penetration testing', 'ethical hacking'],
        skills: ['Cybersecurity'],
        weight: 1.0
    },
    'Blockchain Development': {
        keywords: ['blockchain', 'cryptocurrency', 'web3', 'defi', 'smart contract'],
        skills: ['Blockchain', 'JavaScript', 'Python'],
        weight: 1.0
    },
    'Big Data Engineering': {
        keywords: ['big data', 'data engineer', 'etl', 'data pipeline'],
        skills: ['Big Data', 'Python', 'SQL', 'NoSQL'],
        weight: 1.0
    },
    'Project Management': {
        keywords: ['project manager', 'scrum master', 'product manager', 'agile', 'pm'],
        skills: ['Agile'],
        weight: 0.8
    }
};

/**
 * Calculate domain match score based on skills and text
 */
const calculateDomainScore = (domain, skills, resumeText) => {
    const domainData = JOB_DOMAINS[domain];
    let score = 0;

    // Check skill matches (higher weight)
    const skillMatches = skills.filter(skill => domainData.skills.includes(skill));
    score += skillMatches.length * 10 * domainData.weight;

    // Check keyword matches in resume text (lower weight)
    const lowerText = resumeText.toLowerCase();
    domainData.keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        const matches = lowerText.match(regex);
        if (matches) {
            score += matches.length * 2 * domainData.weight;
        }
    });

    return score;
};

/**
 * Suggest job domains based on extracted skills and resume text
 */
const suggestDomains = (skills, resumeText, topN = 5) => {
    const domainScores = [];

    // Calculate scores for all domains
    Object.keys(JOB_DOMAINS).forEach(domain => {
        const score = calculateDomainScore(domain, skills, resumeText);
        if (score > 0) {
            domainScores.push({
                domain: domain,
                score: score,
                matchedSkills: skills.filter(skill => JOB_DOMAINS[domain].skills.includes(skill))
            });
        }
    });

    // Sort by score (descending) and return top N
    domainScores.sort((a, b) => b.score - a.score);

    // Calculate confidence percentage
    const maxScore = domainScores.length > 0 ? domainScores[0].score : 1;
    const results = domainScores.slice(0, topN).map(item => ({
        domain: item.domain,
        confidence: Math.min(Math.round((item.score / maxScore) * 100), 100),
        matchedSkills: item.matchedSkills,
        score: item.score
    }));

    return results;
};

/**
 * Get domain categories
 */
const getDomainCategories = () => {
    return Object.keys(JOB_DOMAINS);
};

module.exports = {
    suggestDomains,
    getDomainCategories,
    JOB_DOMAINS
};
