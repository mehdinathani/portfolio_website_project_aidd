# Feature Specification: Portfolio & Lead Generation Platform

**Feature Branch**: `001-portfolio-platform`
**Created**: 2026-04-12
**Status**: Draft
**Input**: User description: "Build a dynamic portfolio and lead-generation platform for Mehdi Abbas Nathani, transitioning from Senior Finance Executive to Agentic AI & Software Engineer. Key features required: 1. Dynamic UI Pages: Home, About, Projects (Bidly, Hospital Reception System, etc.), Skills, Experience, Certifications. 2. Admin Dashboard: Protected via Supabase Auth to add/edit/delete portfolio content and view leads. 3. Smart Contact System: A form that stores leads in Supabase and categorizes them. 4. AI Assistant Layer: A floating chat widget powered by Gemini that answers questions about Mehdi's transition, fetches case studies via RAG, and captures lead contact info if the user wants to hire Mehdi."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Browse Portfolio Content (Priority: P1)

A visitor lands on the portfolio site to evaluate Mehdi's professional background. They navigate through the home page, about section, project showcase, skills listing, experience timeline, and certifications. All content loads dynamically from the database, ensuring it reflects the latest updates without any code deployment. The visitor can view project details including descriptions, technologies used, and links to live demos or source code.

**Why this priority**: This is the core purpose of the site — showcasing Mehdi's profile to recruiters, hiring managers, and potential clients. Without this, the site has no value.

**Independent Test**: Can be fully tested by navigating every public page, verifying all content renders correctly from the database, and confirming no hardcoded content exists. Delivers the primary value proposition: a discoverable, professional online presence.

**Acceptance Scenarios**:

1. **Given** the database contains Mehdi's profile, projects, skills, experience, and certifications, **When** a visitor opens the home page, **Then** they see a hero section with Mehdi's name, headline, and a professional tagline, with navigation to all sections.
2. **Given** projects exist in the database, **When** a visitor navigates to the Projects section, **Then** they see a gallery of projects with titles, descriptions, tech stacks, and links to live demos or repositories, ordered by display priority.
3. **Given** skills data exists, **When** a visitor views the Skills section, **Then** they see skills grouped by category (Languages, Frameworks, Databases, Tools, AI/ML) with proficiency indicators.
4. **Given** experience and certification records exist, **When** a visitor views those sections, **Then** they see a chronological timeline of roles and a list of certifications with issuing organizations and dates.
5. **Given** content has been updated in the database, **When** a visitor refreshes any page, **Then** they see the updated content without requiring a code redeployment.

---

### User Story 2 — Interact with AI Assistant Chatbot (Priority: P2)

A visitor has questions about Mehdi's career transition from finance to technology, or wants to understand specific project experience. Instead of manually browsing pages, they open the floating chat widget and ask natural-language questions. The chatbot retrieves relevant context from Mehdi's knowledge base and responds with accurate, grounded answers. If the visitor expresses interest in hiring Mehdi, the chatbot offers to collect their contact information.

**Why this priority**: The AI assistant is a key differentiator that demonstrates technical capability while simultaneously telling Mehdi's story. It reduces bounce rate and increases engagement.

**Independent Test**: Can be fully tested by sending 10+ varied questions to the chatbot and verifying responses are grounded in Mehdi's actual data (not hallucinated), cite sources, and correctly offer lead capture when intent to hire is detected.

**Acceptance Scenarios**:

1. **Given** the knowledge base contains embeddings of Mehdi's bio, projects, and career narrative, **When** a visitor asks "Tell me about Mehdi's background," **Then** the chatbot returns a response summarizing the finance-to-tech transition, grounded in retrieved knowledge base content.
2. **Given** the knowledge base contains project descriptions, **When** a visitor asks "What is Bidly?", **Then** the chatbot returns a response describing the project using retrieved context, with source attribution.
3. **Given** the chatbot is operating under the free-tier rate limit, **When** a visitor sends a message, **Then** a response appears within 30 seconds, either as streamed text or a complete reply.
4. **Given** a visitor expresses interest in hiring Mehdi (e.g., "I'd like to work with him," "How can I contact him for a project?"), **When** the chatbot detects this intent, **Then** it offers to collect the visitor's name, email, and message, storing it as a categorized lead.
5. **Given** the Gemini API is unavailable or rate-limited, **When** a visitor sends a message, **Then** the chatbot displays a friendly fallback message indicating Mehdi will respond shortly, and offers the contact form as an alternative.

---

### User Story 3 — Submit Contact Inquiry (Priority: P3)

A visitor wants to reach out to Mehdi directly — whether for a job opportunity, freelance project, collaboration, or general inquiry. They fill out the contact form with their name, email, message, and optionally select a category (job offer, freelance, collaboration, other). The submission is stored in the database and categorized for Mehdi's review.

**Why this priority**: Lead generation is a primary business goal. The contact form is the fallback path when the chatbot isn't sufficient, and it MUST work reliably.

**Independent Test**: Can be fully tested by submitting the form with valid and invalid data, verifying the submission is stored in the database with correct categorization, and confirming no spam entries are accepted.

**Acceptance Scenarios**:

1. **Given** a visitor fills the contact form with valid name, email, and message, **When** they submit the form, **Then** the submission is stored in the database with a "new" status and the visitor sees a confirmation message.
2. **Given** a visitor selects a category (e.g., "Job Offer"), **When** they submit the form, **Then** the lead is stored with that category for Mehdi's prioritized review.
3. **Given** a visitor submits the form with missing required fields, **When** they attempt to submit, **Then** the form displays inline validation errors and does not submit.
4. **Given** a visitor submits the form with an invalid email format, **When** they attempt to submit, **Then** the form rejects the submission and displays an email format error.

---

### User Story 4 — Manage Content via Admin Dashboard (Priority: P1)

Mehdi logs into a protected admin dashboard to manage all portfolio content. He can add, edit, and delete projects, skills, experience entries, certifications, testimonials, and knowledge base entries. He can also view and manage contact form submissions (leads), marking them as reviewed, replied, or archived.

**Why this priority**: Without the admin dashboard, every content update requires a database manipulation or code change — violating the zero-hardcoded-data principle and making the site impractical to maintain.

**Independent Test**: Can be fully tested by logging in as admin, performing CRUD operations on each content type, and verifying changes appear on the public frontend pages. Lead management can be tested by viewing, categorizing, and updating lead statuses.

**Acceptance Scenarios**:

1. **Given** Mehdi has valid admin credentials, **When** he navigates to the admin login page and authenticates, **Then** he is redirected to the admin dashboard with content management and lead management sections.
2. **Given** Mehdi is authenticated as admin, **When** he adds a new project with title, description, tech stack, and links, **Then** the project appears on the public Projects page within 60 seconds.
3. **Given** Mehdi is authenticated as admin, **When** he edits an existing skill's proficiency or category, **Then** the updated skill appears on the public Skills page.
4. **Given** Mehdi is authenticated as admin, **When** he views the leads section, **Then** he sees all contact form submissions with their categories, dates, and current status (new/reviewed/replied/archived).
5. **Given** Mehdi updates a lead's status to "replied," **When** he refreshes the leads view, **Then** the lead shows the updated status.
6. **Given** an unauthenticated user attempts to access the admin dashboard, **When** they navigate to the admin URL, **Then** they are redirected to the login page.

---

### User Story 5 — AI Assistant Populates Knowledge Base (Priority: P2)

Mehdi adds or updates knowledge base entries through the admin dashboard. These entries are automatically embedded (vector embeddings generated) so the RAG chatbot can retrieve them for future visitor queries. When Mehdi updates a project description or adds a new certification, the corresponding knowledge base entries are updated.

**Why this priority**: The chatbot is only as good as its knowledge base. Automated embedding generation ensures the AI assistant always has current, accurate data without manual intervention.

**Independent Test**: Can be fully tested by adding a new knowledge base entry via the admin dashboard, verifying embeddings are generated, and then asking the chatbot a question that should retrieve that entry.

**Acceptance Scenarios**:

1. **Given** Mehdi creates a new knowledge base entry with content and source type, **When** he saves it, **Then** a vector embedding is automatically generated and stored alongside the content.
2. **Given** Mehdi edits an existing project description, **When** he saves the change, **Then** the corresponding knowledge base embedding is regenerated with the updated content.
3. **Given** Mehdi deletes a knowledge base entry, **When** he confirms deletion, **Then** the entry and its embedding are removed, and the chatbot no longer retrieves it.

---

### Edge Cases

- What happens when a visitor sends a chatbot message while the Gemini API is rate-limited (15 RPM)? The system displays a cached or fallback response and offers the contact form.
- How does the system handle a contact form submission with a suspicious or malformed email? The form rejects it with a validation error; server-side validation also rejects it as a defense-in-depth measure.
- What happens when the database is temporarily unavailable? Public pages display a graceful degradation message ("Content temporarily unavailable, please try again shortly") rather than a raw error.
- How does the admin dashboard handle concurrent content edits? Last-write-wins with optimistic concurrency — the second save displays a conflict warning with the latest data.
- What happens when a knowledge base embedding generation fails? The entry is saved without an embedding, flagged for retry, and the admin is notified.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display Mehdi's profile information (name, headline, bio, photo, social links) on the home and about pages, sourced from the database.
- **FR-002**: System MUST display a gallery of projects with title, description, tech stack, images, and external links (live demo, GitHub), sourced from the database.
- **FR-003**: System MUST display skills grouped by category with proficiency indicators, sourced from the database.
- **FR-004**: System MUST display a chronological timeline of work experience entries, sourced from the database.
- **FR-005**: System MUST display a list of certifications with name, issuer, date, and optional credential URL, sourced from the database.
- **FR-006**: System MUST provide a floating chat widget on all public pages that allows visitors to send natural-language questions and receive AI-generated responses.
- **FR-007**: The AI chatbot MUST ground its responses in retrieved knowledge base content — it MUST NOT generate information not present in Mehdi's data (no hallucination).
- **FR-008**: The AI chatbot MUST detect when a visitor expresses intent to hire or contact Mehdi, and MUST offer to collect their name, email, and message as a lead.
- **FR-009**: System MUST provide a contact form with required fields (name, email, message) and an optional category selector (Job Offer, Freelance, Collaboration, Other).
- **FR-010**: System MUST store all contact form submissions in the database with a status (new, reviewed, replied, archived) and timestamp.
- **FR-011**: System MUST provide a protected admin dashboard requiring authentication to access.
- **FR-012**: Admin users MUST be able to create, read, update, and delete projects, skills, experience entries, certifications, testimonials, and knowledge base entries.
- **FR-013**: Admin users MUST be able to view all contact form submissions (leads), filter by category, and update their status.
- **FR-014**: System MUST automatically generate vector embeddings for knowledge base entries when they are created or updated.
- **FR-015**: System MUST enforce rate limiting on the chatbot endpoint to stay within the Gemini API free-tier limit of 15 requests per minute.
- **FR-016**: System MUST cache frequent chatbot queries to reduce API calls and improve response time.
- **FR-017**: System MUST log all errors with structured context for debugging and observability.
- **FR-018**: System MUST return appropriate HTTP error codes (400, 401, 404, 429, 500, 503) for all API endpoints.
- **FR-019**: System MUST be fully responsive across mobile (320px+), tablet (768px+), and desktop (1280px+) viewports.
- **FR-020**: System MUST meet WCAG 2.1 AA accessibility standards, including keyboard navigation, screen reader compatibility, and minimum color contrast ratios.

### Key Entities

- **Profile**: Mehdi's professional identity — full name, headline, biography, contact details, social links, profile photo. Single record.
- **Project**: A portfolio project showcasing Mehdi's work — title, descriptions (short and long), tech stack, URLs (live demo, GitHub), images, featured flag, display order, date range.
- **Skill**: A technical competency — name, category (Languages, Frameworks, Databases, Tools, AI/ML), proficiency level (1-5), display order.
- **Experience**: A professional role — company name, role title, start/end dates, responsibilities description.
- **Certification**: A professional credential — name, issuing organization, date earned, optional credential URL.
- **Testimonial**: A professional recommendation — author name, role, company, quote, date, optional LinkedIn URL.
- **Knowledge Base Entry**: A content chunk for RAG retrieval — text content, source type, source reference, metadata tags, vector embedding.
- **Lead (Contact Submission)**: A visitor inquiry — name, email, message, category, status (new/reviewed/replied/archived), submission timestamp.
- **Chat Session**: An anonymous chat interaction — session identifier, conversation history, timestamp.

### Assumptions

- Only one admin user (Mehdi) — no multi-admin or role-based access needed for MVP.
- Public visitors do not require accounts or authentication.
- Lead email notifications to Mehdi are desirable but can be implemented post-MVP.
- The Gemini API free tier (15 RPM) is sufficient for expected portfolio traffic (100-500 daily visitors).
- Knowledge base content is derived from Mehdi's resume, project descriptions, and career narrative — not external sources.
- Content is available in English only for MVP.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visitors can load any public page and see all content rendered from the database within 3 seconds on a standard broadband connection.
- **SC-002**: The AI chatbot responds to questions about Mehdi's background with 90%+ accuracy (responses grounded in actual knowledge base content, verified by manual review of 20 test queries).
- **SC-003**: Contact form submissions are stored in the database with 100% reliability (zero lost submissions under normal operating conditions).
- **SC-004**: Mehdi can add, edit, or delete any portfolio content item through the admin dashboard and see the change reflected on the public site within 60 seconds.
- **SC-005**: The site achieves a Lighthouse accessibility score of 90+ across all public pages.
- **SC-006**: The chatbot handles up to 15 concurrent user sessions per minute without degradation (aligned with Gemini API free-tier limit).
- **SC-007**: Mehdi can review and categorize all incoming leads through the admin dashboard, with the ability to filter by category and status.
- **SC-008**: The site scores 90+ on Lighthouse performance for the home page, with First Contentful Paint under 1.5 seconds.
