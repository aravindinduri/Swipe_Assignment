
# Swipe Internship Assignment: Crisp — The AI-Powered Interview Assistant

- **Live Demo:** [Live](https://swipe-assignment-iota.vercel.app/)
- **Demo Video:** [Demo](https://jumpshare.com/share/njA2TEton9wAfm8G8z5X)
- **Portfolio:** [Link](https://aravind-induri.vercel.app/)

## ✅ Features Checklist

This project successfully implements all the core requirements outlined in the assignment brief.

### **Core Functionality**
- [x] **Dual-Tab Interface:** A single-page application with two distinct, synchronized views: `Interviewee` (chat) and `Interviewer` (dashboard).
- [x] **Responsive Design:** A clean, modern, and responsive UI built with **Shadcn UI** and Tailwind CSS, ensuring a great experience on all devices.
- [x] **Friendly Error Handling:** Implemented user-friendly `toast` notifications for events like invalid file uploads or API errors.

### **Interviewee Experience (Chat Tab)**
- [x] **Resume Upload:** Candidates can upload their resume in both **PDF** and **DOCX** formats.
- [x] **Intelligent Field Extraction:** The system automatically parses the resume to extract **Name**, **Email**, and **Phone Number**.
- [x] **Automated Missing Field Collection:** If any of the three required fields are not found, a form is presented to the candidate to collect the missing information before the interview begins.
- [x] **Dynamic AI Question Generation:** The AI generates a total of **6 questions** for a "Full Stack (React/Node.js)" role.
- [x] **Progressive Difficulty:** The interview follows the specified structure: **2 Easy → 2 Medium → 2 Hard** questions.
- [x] **Strictly Timed Questions:** Each question is timed according to its difficulty:
    - `Easy`: **20 seconds**
    - `Medium`: **60 seconds**
    - `Hard`: **120 seconds**
- [x] **Automatic Submission:** If the timer runs out, the current answer is automatically submitted, and the interview proceeds to the next question.
- [x] **AI-Powered Evaluation & Final Summary:** After the final question, the AI evaluates the entire performance, calculates a final score, and generates a concise professional summary.

### **Interviewer Experience (Dashboard Tab)**
- [x] **Scored & Ordered Candidate List:** The dashboard displays a list of all completed candidates, automatically sorted by their final score in descending order.
- [x] **Comprehensive Candidate Details:** Clicking on a candidate opens a modal with a detailed view, including:
    - [x] The candidate's full profile (Name, Email).
    - [x] The final AI-generated summary.
    - [x] A complete interview transcript showing every **question**, **answer**, **score**, and the AI's **feedback**.
- [x] **Search & Sort Functionality:** The dashboard includes robust client-side **searching** (by name or email) and **sorting** (by name, email, or score) capabilities.

### **Data Persistence & State Management**
- [x] **Full Local Persistence:** Utilizes **Redux Toolkit** and **`redux-persist`** to save the entire application state (all candidates, session progress, timers, etc.) to local storage.
- [x] **Seamless Session Restoration:** Closing or refreshing the browser restores the application to its exact previous state.
- [x] **"Welcome Back" Modal:** For any unfinished interview session, a "Welcome Back" modal appears on page load, giving the candidate the option to **resume** where they left off or **start over**.

## 🛠️ Local Setup & Installation

Follow these steps to get the project running on your local machine.

### **Prerequisites**
-   Node.js (v20 or later recommended)
-   npm or yarn

### **Installation Guide**

1.  **Clone the Repository**
    ```sh
    git clone https://github.com/your-username/crisp-ai-interview.git
    cd crisp-ai-interview
    ```

2.  **Install Dependencies**
    ```sh
    npm install
    ```

3.  **Set Up Environment Variables**
    The application requires an API key from Google's Gemini to power the AI features.

    -   Create a new file named `.env` in the root directory of the project.
    -   Add your API key to this file as shown below:

    ```env
    VITE_GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
    ```
    *Replace `YOUR_GOOGLE_GEMINI_API_KEY` with your actual key.*

4.  **Run the Development Server**
    ```sh
    npm run dev
    ```

5.  **Open the Application**
    The project will now be running and accessible at `http://localhost:5173`.

## ✨ Extra Features & Innovations

To elevate the project beyond the core requirements, I implemented several unique features.

- [x] **Two-Factor Field Verification (AI + Regex):** Instead of relying on a single method, I implemented a more robust, two-pass system for resume parsing.
    1.  **First Pass (Regex):** A quick, initial extraction of email and phone numbers is performed using regular expressions for immediate results.
    2.  **Second Pass (AI Verification):** The extracted data, along with the resume context, is sent to the Gemini AI. The AI then acts as a verification layer, correcting inaccuracies and identifying the most likely correct `Name`, `Email`, and `Phone`, providing a much higher degree of accuracy than Regex alone.
- [x] **Advanced UI/UX with Shadcn & Toasts:** The UI was built with the highly-regarded Shadcn UI library, providing a polished and professional aesthetic. Non-intrusive `sonner` toasts are used for all notifications, creating a smooth user experience.
- [x] **Voice-to-Text Input:** Candidates can use their microphone to answer questions via the browser's built-in Speech Recognition API, offering a more natural and accessible way to interact.
- [x] **At-a-Glance Dashboard Analytics:** The interviewer dashboard includes summary cards for **Total Interviews**, **Average Score**, and **Top Performer**, providing immediate, high-level insights into the talent pool.

## 🧠 Challenges Faced & Solutions Implemented

A significant challenge was ensuring the "Welcome Back" modal and session restoration logic was completely bug-free.

-   **The Problem:** When a user with an in-progress session re-opened the tab, a race condition occurred. The main app would sometimes render before the persistence logic had fully rehydrated the Redux store, causing the app to incorrectly display the initial "Upload Resume" screen instead of the "Welcome Back" modal.

-   **The Solution & Debugging Process:**
    1.  **Redux DevTools:** I used the Redux DevTools extension extensively to monitor the state rehydration process. This allowed me to visualize the exact sequence of actions and confirm that the `session` and `candidates` state was being correctly loaded from `localStorage` by `redux-persist`.
    2.  **State-Driven Gatekeeping:** I introduced a new boolean flag in the `sessionSlice` called `isSessionReady`. This flag defaults to `true` but is programmatically set to `false` at the application's root component (`App.jsx`) if it detects a potentially resumable session.
    3.  **Controlled UI Rendering:** The UI now uses this `isSessionReady` flag as a "gatekeeper." While it's `false`, a loading spinner is shown, and the main interview components are not rendered. The "Welcome Back" modal logic runs, and only when the user chooses to "Resume" or "Start Over" is the `isSessionReady` flag set back to `true`, allowing the correct UI to finally render with the fully hydrated state. This completely eliminated the race condition.