# Progress Tracking System Documentation

## Overview
This document describes the complete progress tracking system for the Climate Justice Guide application. The system tracks:
1. **Lesson Completion** - Which lessons/subsections students have completed
2. **Quiz Results** - Quiz scores and performance metrics
3. **Overall Progress** - Aggregated progress statistics for students and teachers

## Database Schema

### Progress Collection
Stores which lessons each student has completed.

\`\`\`javascript
{
  _id: ObjectId,
  userId: "user-id",
  completedSubsections: {
    "section-id": {
      0: true,  // subsectionIndex: completed
      1: true,
      2: false
    },
    "another-section": {
      0: true
    }
  },
  updatedAt: Date
}
\`\`\`

### Scores Collection
Stores quiz results for each student.

\`\`\`javascript
{
  _id: ObjectId,
  userId: "user-id",
  scores: {
    "subsection-id": {
      correct: 2,
      total: 3,
      pct: 67,
      at: 1234567890,
      savedAt: Date
    }
  },
  updatedAt: Date
}
\`\`\`

## API Endpoints

### Progress Endpoints

#### GET /api/progress/load
Load all completed lessons for the current user.

**Headers:**
- `Authorization: Bearer {token}`

**Response:**
\`\`\`json
{
  "progress": {
    "section-id": {
      "0": true,
      "1": true
    }
  }
}
\`\`\`

#### POST /api/progress/mark-done
Mark a lesson as completed.

**Headers:**
- `Authorization: Bearer {token}`

**Body:**
\`\`\`json
{
  "subId": "subsection-id"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Lesson marked as done"
}
\`\`\`

#### GET /api/progress/get-stats
Get progress statistics (completed/total lessons, percentage).

**Headers:**
- `Authorization: Bearer {token}`

**Response:**
\`\`\`json
{
  "stats": {
    "completed": 5,
    "total": 20,
    "percentage": 25
  }
}
\`\`\`

#### POST /api/progress/reset
Reset progress for a student (teacher only).

**Headers:**
- `Authorization: Bearer {token}`

**Body:**
\`\`\`json
{
  "userId": "student-id"
}
\`\`\`

### Scores Endpoints

#### GET /api/scores/load
Load all quiz results for the current user.

**Headers:**
- `Authorization: Bearer {token}`

**Response:**
\`\`\`json
{
  "scores": {
    "subsection-id": {
      "correct": 2,
      "total": 3,
      "pct": 67,
      "at": 1234567890,
      "savedAt": "2024-01-15T10:30:00Z"
    }
  }
}
\`\`\`

#### POST /api/scores/save
Save a quiz result.

**Headers:**
- `Authorization: Bearer {token}`

**Body:**
\`\`\`json
{
  "subId": "subsection-id",
  "result": {
    "correct": 2,
    "total": 3,
    "pct": 67,
    "at": 1234567890
  }
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Quiz result saved"
}
\`\`\`

#### POST /api/scores/reset
Reset quiz results for a student (teacher only).

**Headers:**
- `Authorization: Bearer {token}`

**Body:**
\`\`\`json
{
  "userId": "student-id"
}
\`\`\`

### Teacher Endpoints

#### GET /api/teacher/student-progress
Get progress for all students (teacher only).

**Headers:**
- `Authorization: Bearer {token}`

**Response:**
\`\`\`json
{
  "students": [
    {
      "id": "student-id",
      "name": "Student Name",
      "email": "student@example.com",
      "progress": {
        "completed": 5,
        "total": 20,
        "percentage": 25
      },
      "quizzesTaken": 3
    }
  ]
}
\`\`\`

## Frontend Integration

### Tracking Library (`lib/tracking.js`)

All progress tracking operations go through this library:

\`\`\`javascript
import {
  markLessonDone,
  saveQuizResult,
  loadProgress,
  loadScores,
  getProgressStats,
  resetProgressForStudent,
  resetScoresForStudent
} from "../lib/tracking"

// Mark a lesson as done
await markLessonDone(subsectionId, token)

// Save quiz result
await saveQuizResult(subsectionId, { correct, total, pct, at }, token)

// Get progress stats
const stats = await getProgressStats(token)
// Returns: { completed, total, percentage }
\`\`\`

### Components

#### ProgressTracker
Displays the student's overall progress bar and statistics.

\`\`\`javascript
import ProgressTracker from "@/components/ProgressTracker"

export default function Page() {
  return <ProgressTracker />
}
\`\`\`

#### TeacherView
Displays all students and their progress (teacher only).

\`\`\`javascript
import TeacherView from "@/components/TeacherView"

export default function TeacherDashboard() {
  return <TeacherView />
}
\`\`\`

#### LessonView
Displays lesson slides and quiz, marks lesson as done on completion.

\`\`\`javascript
import LessonView from "@/components/LessonView"

export default function LessonPage({ params }) {
  return <LessonView sectionId={params.sectionId} subsection={subsection} />
}
\`\`\`

## Event System

The system uses browser events to notify components of progress changes:

\`\`\`javascript
// Dispatch when progress changes
window.dispatchEvent(new Event("cj-progress-changed"))

// Listen for changes
window.addEventListener("cj-progress-changed", () => {
  // Refresh progress display
})
\`\`\`

## Flow Diagram

### Student Completes Lesson
1. Student views lesson slides
2. Student completes quiz
3. `QuizSlides` calls `saveQuizResult()`
4. `LessonView` calls `markLessonDone()`
5. Both dispatch `cj-progress-changed` event
6. `ProgressTracker` listens and refreshes stats
7. Progress bar updates

### Teacher Views Student Progress
1. Teacher navigates to dashboard
2. `TeacherView` fetches `/api/teacher/student-progress`
3. Displays all students with their progress
4. Teacher can select a student to see details
5. Teacher can reset progress or quiz results

## No localStorage Usage

All progress data is stored in MongoDB. The system no longer uses localStorage for:
- Progress tracking
- Quiz results
- Student data

Only authentication tokens are stored in localStorage temporarily (to be replaced with secure cookies).

## Error Handling

All API calls include error handling:
- Network errors are caught and logged
- Failed requests return empty data structures
- Components gracefully handle missing data
- Console logs include `[v0]` prefix for debugging

## Testing Checklist

- [ ] Student completes lesson and progress updates
- [ ] Quiz result is saved to MongoDB
- [ ] Progress bar reflects completed lessons
- [ ] Teacher can view all students
- [ ] Teacher can view individual student progress
- [ ] Teacher can reset student progress
- [ ] Teacher can reset student quiz results
- [ ] Progress persists after page refresh
- [ ] Multiple students have independent progress
