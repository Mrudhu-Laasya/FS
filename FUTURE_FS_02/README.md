# LeadFlow — Mini CRM

LeadFlow is a full-stack Customer Relationship Management (CRM) application built using the MERN stack. It helps administrators manage leads, track their status, maintain an activity history, schedule follow-ups, and monitor business performance through dashboard analytics.

## 🚀 Key Features

### 1. Dashboard & Analytics
- **Lead overview:** Displays key metrics such as total leads, new leads, converted leads, and conversion rate.
- **Status distribution:** Visualizes lead distribution across different statuses using charts, including pie charts where configured.
- **Time-based analytics:** Filter dashboard data by:
  - Daily
  - Weekly
  - Monthly
  - Custom date range
- **Date filtering:** Uses lead creation timestamps and selected date boundaries to calculate metrics for the chosen period.
- **Business insights:** Helps administrators understand lead acquisition, progress, and conversions at a glance.
- **Recent leads:** Displays recently created or updated leads for quick access.

### 2. Lead Management
- **CRUD operations:** Create, retrieve, update, and delete leads, according to the available UI and API operations.
- **Lead information:** Maintains details such as name, email, phone, company, service, message, source, status, and notes.
- **Lead status management:** Organizes leads into:
  - New
  - Contacted
  - Converted
  - Lost
- **Search and filtering:** Find leads and view leads by status.
- **Lead details:** View individual lead information, update its status, and manage notes and follow-ups.
- **Embedded notes:** Stores notes within the associated lead document rather than maintaining a separate notes collection.

### 3. Activity History
- Maintains a separate activity history to track important actions performed on leads.
- Records events such as:
  - Lead creation
  - Lead status changes
  - Follow-up scheduling
  - Follow-up rescheduling
  - Follow-up completion
- Stores activity descriptions, timestamps, and relevant lead and administrator references.
- Displays a chronological activity feed so administrators can understand what happened and when.
- Supports searching and filtering activities where implemented in the frontend.

### 4. Follow-up Management
- **Schedule follow-ups:** Create follow-up tasks for specific leads with a date, time, and purpose.
- **Separate task management:** Stores follow-ups in a dedicated collection instead of mixing scheduled tasks with activity history.
- **Follow-up categories:** Organizes tasks into overdue, due today, upcoming, completed, and cancelled categories.
- **Overdue management:** Allows overdue pending follow-ups to be rescheduled for a future date and time.
- **Completion tracking:** Records completion time and outcome when a follow-up is completed.
- **Activity integration:** Adds activity history entries for scheduling, rescheduling, and completing follow-ups.
- **Task retention:** Keeps completed follow-up records available for historical reference.

### 5. Administrator Authentication
- Administrator login using email and password.
- Password hashing with `bcrypt` for secure password storage.
- JSON Web Token (JWT) authentication.
- Protected backend routes using authentication middleware such as `protect`.
- Sends the JWT with authenticated API requests.
- Associates relevant actions with the authenticated administrator where supported by the implementation.

---

## 🖥️ Frontend Implementation

**Technologies:** React, Vite, React Router DOM, JavaScript, CSS, Fetch API, and charting components.

### React Concepts Used
- **React Router DOM:** Navigates between dashboard, lead lists, activity, follow-ups, and other application pages without full-page reloads.
- **React Context API:** Shares application-level data across components where configured, reducing unnecessary prop passing.
- **React Hooks:**
  - `useState` — manages form values, loading states, filters, modal visibility, and other UI state.
  - `useEffect` — loads data and performs side effects when components or dependencies change.
  - `useCallback` — memoizes callbacks where useful.
  - Custom hooks, where implemented, encapsulate reusable application logic.
- **Component-based architecture:** Separates pages, layouts, reusable UI elements, and API functions.
- **Controlled forms:** Uses React state to manage form inputs and handle user submissions.
- **Conditional rendering:** Displays loading indicators, error messages, empty states, and content based on application state.
- **Event handling:** Manages form submissions, status changes, follow-up actions, search, and filters.
- **API integration:** Communicates with the Express backend using asynchronous Fetch API requests.
- **Environment variables:** Uses `VITE_API_URL` to configure the backend URL.
- **Responsive styling:** Uses CSS layouts, reusable styles, and media queries to support different screen sizes.

### Frontend Pages and UI
- Dashboard with metric cards, charts, and date-range controls.
- Lead list pages organized by status.
- Lead details view with editable information and notes.
- Activity feed with event descriptions, timestamps, search, and activity-type filtering where configured.
- Follow-ups page with task categories, scheduling, completion, and rescheduling.
- Administrator login and logout.
- Feedback for loading, empty, success, and error states where implemented.

---

## ⚙️ Backend Implementation

**Technologies:** Node.js, Express.js, MongoDB, Mongoose, bcrypt, and JSON Web Tokens.

### REST API Architecture
- Uses Express.js to define API endpoints and handle HTTP requests.
- Organizes code into routes, controllers, models, and middleware.
- Separates business logic from route definitions.
- Uses JSON request and response bodies for frontend-backend communication.
- Uses HTTP methods such as `GET`, `POST`, `PATCH`, and `DELETE` according to each operation.

### MongoDB and Mongoose
The application uses MongoDB to persist CRM data and Mongoose to define schemas, relationships, validation rules, and queries.

Core collections include:

- **Admins:** Administrator account and authentication information.
- **Leads:** Contact details, lead source, status, and embedded notes.
- **Activities:** Historical records of actions and changes.
- **Follow-ups:** Scheduled follow-up tasks, completion details, and outcomes.

### Authentication and Authorization
- Hashes passwords using `bcrypt`.
- Generates JWTs after successful administrator authentication.
- Validates tokens through protected-route middleware.
- Restricts protected API operations to authenticated administrators.
- Uses the authenticated administrator's identity when recording actions where supported.

### CRUD and Business Operations
- Creates and retrieves lead records.
- Updates lead details and statuses.
- Deletes leads through the relevant API operation.
- Adds notes to leads.
- Creates, retrieves, completes, and reschedules follow-up tasks.
- Creates activity records to preserve the history of relevant operations.
- Checks required fields and validates important inputs in the relevant controllers.

### Timestamp-Based Analytics
- Uses Mongoose timestamps such as `createdAt` and `updatedAt`.
- Filters records using date ranges for daily, weekly, monthly, and custom-period analytics.
- Uses start and end boundaries to retrieve records within the selected period.
- Calculates dashboard metrics from the filtered records.
- Supports time-based reporting without requiring separate database collections for each reporting period.

---

## 🧠 Business Logic & Design Decisions

### Activity History vs. Follow-ups
These features have different responsibilities:

- **Activities answer:** What happened?
- **Follow-ups answer:** What needs to happen next?

A follow-up is a task that can be pending, overdue, completed, or cancelled. An activity is a historical record of an event, such as scheduling or completing that task.

Keeping them separate makes task management clearer while preserving an audit-style history.

### Lead Lifecycle
A lead progresses through the sales workflow:

1. A potential customer submits an inquiry or an administrator creates a lead.
2. The lead is stored with its contact information and source.
3. An administrator reviews the lead and changes its status as communication progresses.
4. Follow-ups are scheduled to maintain contact.
5. Activities record important changes and actions.
6. The lead may eventually be converted or marked as lost.

### Overdue Follow-up Handling
- Identifies pending follow-ups whose scheduled date has passed.
- Separates overdue tasks from today's and upcoming tasks.
- Allows the administrator to schedule a new date for an overdue task.
- Preserves the rescheduling event in the activity history.

### Analytics and Reporting
- Applies the selected reporting period to relevant data.
- Derives metrics from stored records instead of hardcoding dashboard values.
- Uses charts to make status distribution and lead performance easier to interpret.
- Provides a custom date range for more flexible reporting.

### Data Modeling
- Embeds notes within a lead because they are closely associated with that lead.
- Stores activities separately because they represent historical events.
- Stores follow-ups separately because they have their own lifecycle, scheduling information, and completion status.
- Uses document references to associate follow-ups and activities with their related leads and administrators.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Routing | React Router DOM |
| State management | React Hooks, Context API where configured |
| API communication | Fetch API |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| Analytics | Date-range queries and chart components |
| Deployment configuration | Environment variables |

## 📚 What This Project Demonstrates

- Full-stack application development using the MERN stack.
- Designing and consuming REST APIs.
- Authentication and protected routes.
- Database schema design and document relationships.
- React state management, hooks, and component architecture.
- CRUD operations and form handling.
- Date-based filtering and dashboard analytics.
- Workflow management and business-oriented application logic.
- Separation of operational tasks from historical activity records.
- Asynchronous API handling and user-friendly interface design.

## 🔮 Potential Future Enhancements

- Role-based access control with distinct administrator and staff permissions.
- Pagination and server-side filtering for large lead datasets.
- Email notifications and automated follow-up reminders.
- Lead assignment to team members.
- Exporting leads and analytics to CSV or PDF.
- More detailed conversion trends and source-wise performance reports.
- Automated tests for controllers, API routes, and frontend components.
- Improved validation, centralized error handling, and transactional consistency between follow-up operations and activity records.

---

**LeadFlow** demonstrates how a CRM can combine lead tracking, follow-up scheduling, activity history, authentication, and analytics in one application.
