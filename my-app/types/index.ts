export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  match: number;
  type: string;
  posted: string;
  icon: string;
  description?: string;
  requirements?: string[];
  benefits?: string[];
}

export interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  company: string;
  status: 'under_review' | 'shortlisted' | 'interview' | 'rejected' | 'accepted';
  statusLabel: string;
  appliedDate: string;
  match: number;
  icon: string;
  coverLetter?: string;
  availability?: string;
  expectedSalary?: string;
  noticePeriod?: string;
  portfolio?: string;
  linkedin?: string;
  additionalInfo?: string;
}

export interface Project {
  id: number;
  title: string;
  client: string;
  status: 'Active' | 'Completed' | 'Pending';
  budget: string;
  deadline: string;
  icon: string;
}

export interface ApplicationStage {
  id: number;
  stage: string;
  status: 'completed' | 'current' | 'pending';
  date: string | null;
  description: string;
}
