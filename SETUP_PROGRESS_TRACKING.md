# Progress Tracking System Setup Guide

## Prerequisites
- MongoDB database (local or cloud)
- Node.js environment
- Environment variables configured

## Step 1: Environment Variables

Ensure these variables are set in your `.env.local`:

\`\`\`
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB=climate-justice
JWT_SECRET=your-secret-key
\`\`\`

## Step 2: Initialize Database

Run the initialization script to create collections and indexes:

\`\`\`bash
node scripts/init-mongodb.js
\`\`\`

Expected output:
\`\`\`
Created users collection
Created users indexes
Created progress collection
Created progress indexes
Created scores collection
Created scores indexes
Database initialization complete
\`\`\`

## Step 3: Verify Schema

Run the verification script:

\`\`\`bash
node scripts/verify-schema.js
\`\`\`

## Step 4: Test Progress Tracking

Run the test script:

\`\`\`bash
node scripts/test-progress.js
\`\`\`

Expected output:
\`\`\`
=== Progress Tracking System Test ===

Test 1: Checking collections...
✓ Collections exist

Test 2: Inserting test progress document...
✓ Progress document inserted: ...

Test 3: Querying progress document...
✓ Progress document found:
...

Test 4: Inserting test scores document...
✓ Scores document inserted: ...

Test 5: Querying scores document...
✓ Scores document found:
...

Test 6: Updating progress document...
✓ Progress updated: 1 document(s)

Test 7: Verifying update...
✓ Updated progress:
...

Test 8: Calculating progress stats...
✓ Completed lessons: 3
✓ Total lessons in test data: 4

Test 9: Cleaning up test data...
✓ Test data cleaned up

=== All Tests Passed ===
\`\`\`

## Step 5: Start Application

\`\`\`bash
npm run dev
\`\`\`

## Testing the System

### As a Student

1. Log in as a student
2. Navigate to a lesson
3. Complete the lesson slides
4. Take the quiz
5. Submit answers
6. Verify:
   - Progress bar updates
   - Quiz result is saved
   - Lesson shows as completed

### As a Teacher

1. Log in as a teacher
2. Navigate to the teacher dashboard
3. Select a student from the dropdown
4. Verify:
   - Student's overall progress is displayed
   - Progress bar shows correct percentage
   - Quiz results are listed
   - Can reset progress
   - Can reset quiz results

## Troubleshooting

### Progress not updating
- Check browser console for errors
- Verify token is valid
- Check MongoDB connection
- Ensure collections exist: `node scripts/verify-schema.js`

### Quiz results not saving
- Check API response in Network tab
- Verify `/api/scores/save` endpoint is working
- Check MongoDB scores collection

### Teacher dashboard not loading
- Verify user role is "teacher"
- Check `/api/teacher/student-progress` endpoint
- Verify MongoDB has student data

### Database connection errors
- Verify `MONGODB_URI` environment variable
- Check MongoDB credentials
- Ensure IP whitelist includes your server

## API Testing with curl

### Mark lesson as done
\`\`\`bash
curl -X POST http://localhost:3000/api/progress/mark-done \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"subId":"intro-1"}'
\`\`\`

### Get progress stats
\`\`\`bash
curl http://localhost:3000/api/progress/get-stats \\
  -H "Authorization: Bearer YOUR_TOKEN"
\`\`\`

### Save quiz result
\`\`\`bash
curl -X POST http://localhost:3000/api/scores/save \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"subId":"intro-1","result":{"correct":2,"total":3,"pct":67,"at":1234567890}}'
\`\`\`

### Get teacher student progress
\`\`\`bash
curl http://localhost:3000/api/teacher/student-progress \\
  -H "Authorization: Bearer YOUR_TEACHER_TOKEN"
\`\`\`

## Monitoring

### Check progress collection
\`\`\`javascript
db.progress.find().pretty()
\`\`\`

### Check scores collection
\`\`\`javascript
db.scores.find().pretty()
\`\`\`

### Get student progress stats
\`\`\`javascript
db.progress.findOne({ userId: "student-id" })
\`\`\`

## Performance Considerations

- Progress and scores collections have unique indexes on userId for fast lookups
- Nested object structure for completedSubsections allows efficient updates
- Consider adding TTL indexes if you want to auto-delete old data

## Security Notes

- All endpoints require valid JWT token
- Teacher endpoints check for teacher role
- Progress data is isolated per user
- No localStorage is used for sensitive data
