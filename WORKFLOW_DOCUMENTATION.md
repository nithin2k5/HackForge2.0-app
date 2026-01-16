# GROEI App - Complete Workflow Documentation

## Table of Contents
1. [Job Application Workflow](#job-application-workflow)
2. [Project Application Workflow](#project-application-workflow)
3. [Company Exploration Workflow](#company-exploration-workflow)
4. [Profile Management Workflow](#profile-management-workflow)
5. [Saved Jobs Workflow](#saved-jobs-workflow)
6. [Application Tracking Workflow](#application-tracking-workflow)
7. [Chatbot Interaction Workflow](#chatbot-interaction-workflow)

---

## Job Application Workflow

### Step 1: Browse Jobs
**Location:** `/jobs` or Dashboard → Jobs tab

**Features:**
- Search bar: Filter by job title, company name, or location
- Filter chips: All, Remote, Hybrid, Onsite
- Job cards display:
  - Job title
  - Company name
  - Location
  - Salary range (₹ format)
  - Match percentage badge
  - Job type (Full-time, Contract, etc.)
  - Posted date
  - Bookmark icon (to save for later)

**User Actions:**
- Type in search bar to filter jobs
- Click filter chips to filter by location type
- Click bookmark icon to save job
- Click on job card to view details

---

### Step 2: View Job Details
**Location:** `/(jobs)/job-detail`

**Information Displayed:**
- Header section:
  - Job icon
  - Job title
  - Company name
  - Match percentage badge (if applicable)
  - "Applied" badge (if already applied)
- Info grid:
  - Location
  - Salary (₹ format)
  - Job type
  - Posted date
- Job description (full text)
- Requirements list (bullet points with checkmark icons)
- Benefits list (bullet points with star icons)
- Action buttons:
  - Bookmark/Save button (top right)
  - "APPLY NOW" button (bottom) OR "VIEW APPLICATION" (if already applied)

**User Actions:**
- Click bookmark to save/unsave job
- Click "APPLY NOW" to start application
- Click "VIEW APPLICATION" to see application status (if already applied)
- Scroll to read full job description

---

### Step 3: Start Application Process
**Location:** `/(jobs)/job-application`

**Pre-check:**
- System checks if user already applied
- If applied → Redirect to Applications page
- If not applied → Show application form

**Application Form Structure:**
Multi-step form with progress indicator showing "Step X of 3"

---

### Step 4: Fill Application Form

#### Step 1: Cover Letter
**Required Fields:**
- Cover Letter (text area, multiline)
  - Minimum 100 characters recommended
  - Placeholder: "Write a compelling cover letter explaining why you're the best fit for this position..."

**Validation:**
- Cover letter cannot be empty
- "Next" button disabled until field is filled

**User Actions:**
- Type cover letter in text area
- Click "Next" to proceed to Step 2
- Click "Back" to return to job detail page

---

#### Step 2: Availability & Salary
**Required Fields:**
- Availability (text input)
  - Placeholder: "e.g., Immediately available, 2 weeks notice, etc."
- Expected Salary (text input)
  - Placeholder: "e.g., ₹6,00,000 - ₹7,50,000"

**Optional Fields:**
- Notice Period (text input)

**Validation:**
- Availability cannot be empty
- Expected Salary cannot be empty
- "Next" button disabled until required fields are filled

**User Actions:**
- Fill in availability details
- Enter expected salary range
- Optionally add notice period
- Click "Next" to proceed to Step 3
- Click "Back" to return to Step 1

---

#### Step 3: Additional Details
**Optional Fields:**
- Portfolio URL (text input)
  - Placeholder: "https://yourportfolio.com"
  - Keyboard type: URL
- LinkedIn URL (text input)
  - Placeholder: "https://linkedin.com/in/yourprofile"
  - Keyboard type: URL
- Additional Information (text area, multiline)
  - Placeholder: "Any additional information you'd like to share..."

**User Actions:**
- Optionally add portfolio link
- Optionally add LinkedIn profile
- Optionally add additional information
- Click "SUBMIT" to submit application
- Click "Back" to return to Step 2

---

### Step 5: Submit Application
**Process:**
1. User clicks "SUBMIT" button
2. Loading state appears (1.5 seconds)
3. Application data is processed
4. Job ID is saved to AsyncStorage (`appliedJobs` array)
5. User is redirected to success page

**Data Saved:**
- Job ID added to `appliedJobs` array in AsyncStorage
- Application timestamp (implicit)

---

### Step 6: Application Success Page
**Location:** `/(jobs)/application-success`

**Display:**
- Success icon (green checkmark in circle)
- Title: "Application Submitted!"
- Subtitle: "Your application for [Job Title] at [Company] has been successfully submitted."
- Info cards:
  - Review timeline: "We'll review your application and get back to you within 3-5 business days."
  - Email notifications: "You'll receive email notifications about your application status."
  - Track progress: "Track your application progress in the Applications section."

**Action Buttons:**
- "View Applications" → Navigate to `/applications`
- "Back to Dashboard" → Navigate to `/dashboard`

---

### Step 7: Track Application Status
**Location:** `/applications` or Dashboard → Applications

**Features:**
- List of all submitted applications
- Status filter chips: All, Under Review, Shortlisted, Interview, Rejected, Accepted
- Each application card shows:
  - Job icon
  - Job title
  - Company name
  - Status badge (color-coded):
    - Under Review (blue)
    - Shortlisted (purple)
    - Interview (orange)
    - Rejected (red)
    - Accepted (green)
  - Applied date
  - Match percentage

**User Actions:**
- Click filter chips to filter by status
- Click on application card to view detailed status
- View application timeline and updates

**Detailed Status View:**
- Location: `/(jobs)/application-status`
- Shows:
  - Application timeline with milestones
  - Current status with icon
  - Status history
  - Next steps information

---

## Project Application Workflow

### Step 1: Browse Projects
**Location:** `/projects` or Dashboard → Projects tab

**Features:**
- Search bar: Filter by project title or client name
- Filter chips: All, Active, Completed
- Project cards display:
  - Project title
  - Client name
  - Budget (₹ format)
  - Duration
  - Required skills (tags)
  - Match percentage
  - Status badge (Active/Completed)
  - Posted date

**User Actions:**
- Type in search bar to filter projects
- Click filter chips to filter by status
- Click on project card to view details

---

### Step 2: View Project Details
**Location:** `/(projects)/project-detail`

**Information Displayed:**
- Project title
- Client name
- Details list:
  - Client
  - Budget (₹ format)
  - Duration
  - Status
- Required skills section (skill tags)
- Project description (full text)
- Action button: "Apply for Project"

**User Actions:**
- Read project details
- Review required skills
- Click "Apply for Project" button

---

### Step 3: Apply for Project
**Process:**
- Clicking "Apply for Project" redirects to job application form
- Uses same multi-step form as job applications:
  - Step 1: Cover Letter
  - Step 2: Availability & Expected Salary
  - Step 3: Additional Details (Portfolio, LinkedIn, etc.)
- Same submission and success flow as job applications

**Note:** Projects use the same application form structure as jobs for consistency.

---

## Company Exploration Workflow

### Step 1: Browse Companies
**Location:** `/companies` or Dashboard → Companies tab

**Features:**
- Search bar: Filter by company name or location
- Sort dropdown: Highest Rated, Most Positions, Name (A-Z)
- Company cards display:
  - Company initials/logo
  - Company name
  - Location
  - Employee count range
  - Open positions count
  - Rating (stars)
  - Featured badge (if applicable)

**User Actions:**
- Type in search bar to filter companies
- Select sort option from dropdown
- Click on company card to view details

---

### Step 2: View Company Details
**Location:** `/(companies)/company-detail`

**Information Displayed:**
- Company header:
  - Company logo/initials
  - Company name
  - Location
  - Rating with stars
  - Verified badge (if applicable)
- About section:
  - Company description
  - Founded year
  - Employee count
  - Website
- Open positions section:
  - List of available jobs at company
  - Each job shows: title, location, salary, match percentage
- Action buttons:
  - "View All Jobs" → Navigate to `/jobs` filtered by company
  - Individual "View Job" buttons on each position

**User Actions:**
- Read company information
- Browse open positions
- Click "View Job" to see job details
- Click "View All Jobs" to see all jobs from this company

---

## Profile Management Workflow

### Step 1: Access Profile
**Location:** Dashboard → Profile tab

**Information Displayed:**
- Profile header:
  - Profile picture/avatar
  - Full name
  - Email
  - Location
- Stats section:
  - Applications submitted
  - Jobs saved
  - Profile completion percentage
- Sections:
  - Personal Information
  - Skills & Experience
  - Education
  - Resume

**User Actions:**
- View profile information
- Click "Edit Profile" to update information

---

### Step 2: Edit Profile
**Location:** `/settings/edit-profile`

**Editable Fields:**
- Full Name
- Email
- Phone Number
- Location
- Bio/About
- Skills
- Experience
- Education
- Portfolio URL
- LinkedIn URL

**User Actions:**
- Update any field
- Click "Save Changes" to update profile
- Click "Cancel" to discard changes

---

### Step 3: Manage Resume
**Location:** `/settings/manage-resume`

**Features:**
- Current resume display (if uploaded)
- Upload new resume button
- Replace resume option
- Download current resume option
- Delete resume option

**User Actions:**
- Upload new resume file
- Replace existing resume
- Download current resume
- Delete resume

---

## Saved Jobs Workflow

### Step 1: Save a Job
**Methods:**
1. From Jobs listing page: Click bookmark icon on job card
2. From Job detail page: Click bookmark icon in header
3. From Dashboard: Click bookmark icon on recommended jobs

**Process:**
- Click bookmark icon (outline when not saved, filled when saved)
- Job ID is saved to AsyncStorage (`savedJobs` array)
- Icon changes to filled bookmark
- Job appears in Saved Jobs list

---

### Step 2: View Saved Jobs
**Location:** `/saved-jobs` or Dashboard → Saved Jobs

**Features:**
- List of all saved jobs
- Each job card shows:
  - Job title
  - Company name
  - Location
  - Salary (₹ format)
  - Match percentage
  - Saved date
  - Bookmark icon (filled, can click to unsave)

**Empty State:**
- If no saved jobs:
  - Icon: Bookmark outline
  - Message: "No Saved Jobs"
  - Subtitle: "Jobs you save will appear here"
  - Button: "Explore Jobs" → Navigate to `/jobs`

**User Actions:**
- Click on job card to view job details
- Click bookmark icon to unsave job
- Click "Explore Jobs" to browse more jobs

---

## Application Tracking Workflow

### Step 1: View All Applications
**Location:** `/applications` or Dashboard → Applications

**Display:**
- List of all submitted applications
- Status filter chips at top
- Each application card shows:
  - Job icon
  - Job title
  - Company name
  - Status badge (color-coded)
  - Applied date
  - Match percentage

**User Actions:**
- Click filter chips to filter by status
- Click on application card to view detailed status

---

### Step 2: View Application Status Details
**Location:** `/(jobs)/application-status`

**Information Displayed:**
- Job title and company
- Current status with icon and color
- Application timeline:
  - Applied (completed)
  - Under Review (current/upcoming)
  - Shortlisted (upcoming)
  - Interview (upcoming)
  - Decision (upcoming)
- Status history with dates
- Next steps information

**User Actions:**
- View timeline progress
- See status updates
- Navigate back to applications list

---

## Chatbot Interaction Workflow

### Step 1: Access Chatbot
**Methods:**
1. Floating button (bottom-right corner) on:
   - Home page
   - Dashboard
   - Jobs page
   - Explore page
2. Settings → Support → Chat Assistant
3. Help Center → Get Support → Chat Assistant

---

### Step 2: Chat Interface
**Location:** `/chatbot`

**Features:**
- Header:
  - Back button
  - Bot avatar
  - Bot name: "Chilli"
  - Status: "Online • Usually replies instantly"
  - More options button
- Message area:
  - Bot welcome message
  - User messages (right side, primary color)
  - Bot messages (left side, with avatar)
  - Message timestamps
  - Typing indicator (when bot is responding)
- Quick replies (shown initially):
  - "How do I apply for a job?"
  - "How does AI matching work?"
  - "How to update my profile?"
  - "View saved jobs"
- Input area:
  - Text input (multiline, max 500 characters)
  - Send button (disabled when empty)

**User Actions:**
- Type message in input field
- Click send button or press enter
- Click quick reply buttons for instant questions
- View bot responses
- Scroll through message history

---

### Step 3: Bot Responses
**Bot Capabilities:**
- Answers questions about:
  - Job application process
  - AI matching system
  - Profile management
  - Saved jobs
  - General GROEI platform questions
- Provides step-by-step guidance
- Offers helpful links and suggestions

**Response Types:**
- Direct answers to specific questions
- Step-by-step instructions
- General help information
- Navigation suggestions

---

## Key Data Storage

### AsyncStorage Keys:
- `savedJobs`: Array of job IDs that user has saved
- `appliedJobs`: Array of job IDs that user has applied to

### Data Flow:
1. **Saving Jobs:**
   - User clicks bookmark → Job ID added to `savedJobs` array
   - Saved to AsyncStorage immediately

2. **Applying for Jobs:**
   - User submits application → Job ID added to `appliedJobs` array
   - Saved to AsyncStorage on success page

3. **Checking Status:**
   - On job detail page: Check if job ID exists in `appliedJobs` array
   - Show "Applied" badge if found
   - Change "APPLY NOW" to "VIEW APPLICATION" if applied

---

## Navigation Flow Diagrams

### Job Application Flow:
```
Jobs Listing (/jobs)
    ↓ (click job card)
Job Detail (/job-detail)
    ↓ (click "APPLY NOW")
Job Application (/job-application)
    ├─ Step 1: Cover Letter
    │   ↓ (click "Next")
    ├─ Step 2: Availability & Salary
    │   ↓ (click "Next")
    └─ Step 3: Additional Details
        ↓ (click "SUBMIT")
Application Success (/application-success)
    ├─ → View Applications (/applications)
    └─ → Back to Dashboard (/dashboard)
```

### Project Application Flow:
```
Projects Listing (/projects)
    ↓ (click project card)
Project Detail (/project-detail)
    ↓ (click "Apply for Project")
Job Application (/job-application)
    [Same multi-step form as jobs]
    ↓ (click "SUBMIT")
Application Success (/application-success)
```

### Company Exploration Flow:
```
Companies Listing (/companies)
    ↓ (click company card)
Company Detail (/company-detail)
    ├─ → View Job (individual job detail)
    └─ → View All Jobs (/jobs?company=CompanyName)
```

---

## UI/UX Considerations

### Form Validation:
- Required fields must be filled before proceeding
- Visual feedback for empty required fields
- Disabled buttons until validation passes

### Loading States:
- Show loading spinner during form submission
- Prevent multiple submissions
- Disable navigation during loading

### Error Handling:
- Network errors: Show error message, allow retry
- Validation errors: Highlight invalid fields
- Storage errors: Log to console, show user-friendly message

### Responsive Design:
- All forms adapt to different screen sizes
- Text inputs adjust for keyboard
- Scrollable content areas
- Touch-friendly button sizes

### Accessibility:
- Clear labels on all inputs
- Proper contrast ratios
- Keyboard navigation support
- Screen reader friendly

---

## Currency Format

**Indian Rupee (₹) Format:**
- Use "L" for Lakhs (100,000)
- Examples:
  - ₹6L - ₹9L (instead of $80k - $120k)
  - ₹1.2L - ₹2L (instead of $15k - $25k)
  - ₹6,00,000 - ₹7,50,000 (for detailed amounts)

---

## Status Codes & Colors

### Application Status:
- **Under Review**: Blue (#3b82f6)
- **Shortlisted**: Purple (#9333EA)
- **Interview**: Orange (#f59e0b)
- **Rejected**: Red (#ef4444)
- **Accepted**: Green (#10b981)

---

## Notes for Web Implementation

1. **Replace AsyncStorage with:**
   - localStorage for web
   - Or IndexedDB for larger data
   - Or backend API calls

2. **Navigation:**
   - Use React Router or Next.js routing
   - Maintain same route structure
   - Handle browser back/forward buttons

3. **Form Handling:**
   - Use form libraries (React Hook Form, Formik)
   - Implement proper validation
   - Handle form state management

4. **API Integration:**
   - Replace mock data with API calls
   - Implement proper error handling
   - Add loading states for async operations

5. **Responsive Design:**
   - Use CSS Grid/Flexbox
   - Implement mobile-first approach
   - Test on various screen sizes

6. **State Management:**
   - Consider Redux, Zustand, or Context API
   - Manage application state globally
   - Sync with backend

---

## Testing Checklist

- [ ] Job application form validation
- [ ] Multi-step form navigation
- [ ] Save/unsave job functionality
- [ ] Application submission
- [ ] Application status tracking
- [ ] Project application flow
- [ ] Company exploration
- [ ] Profile editing
- [ ] Resume upload
- [ ] Chatbot interactions
- [ ] Search and filter functionality
- [ ] Responsive design on all devices
- [ ] Error handling
- [ ] Loading states
- [ ] Data persistence

---

**End of Workflow Documentation**
