export async function markLessonDone(subId) {
  try {
    console.log("[v0] markLessonDone called with subId:", subId)

    const response = await fetch("/api/progress/mark-done", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },  
      credentials: "include", // Include cookies
      body: JSON.stringify({ subId }),
    })

    console.log("[v0] Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Failed to mark lesson done:", response.status, errorText)
      return false
    }

    const data = await response.json()
    console.log("[v0] Lesson marked done response:", data)

    if (typeof window !== "undefined") {
      console.log("[v0] Dispatching cj-progress-changed event")
      window.dispatchEvent(new Event("cj-progress-changed"))
    }

    return true
  } catch (error) {
    console.error("[v0] Error marking lesson done:", error.message, error.stack)
    return false
  }
}

export async function saveQuizResult(subId, result) {
  try {
    console.log("[v0] saveQuizResult called with subId:", subId, "result:", result)

    if (!subId || !result) {
      console.error("[v0] Missing subId or result")
      return false
    }

    console.log("[v0] Sending POST to /api/scores/save")
    const response = await fetch("/api/scores/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
      credentials: "include", // Include cookies
      body: JSON.stringify({ subId, result }),
    })

    console.log("[v0] Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Failed to save quiz result:", response.status, errorText)
      return false
    }

    const data = await response.json()
    console.log("[v0] Quiz result saved response:", data)

    if (typeof window !== "undefined") {
      console.log("[v0] Dispatching cj-progress-changed event")
      window.dispatchEvent(new Event("cj-progress-changed"))
    }

    return true
  } catch (error) {
    console.error("[v0] Error saving quiz result:", error.message, error.stack)
    return false
  }
}

export async function loadProgress() {
  try {
    console.log("[v0] loadProgress called")

    const response = await fetch("/api/progress/load", {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
      credentials: "include", // Include cookies
    })

    console.log("[v0] loadProgress response status:", response.status)

    if (!response.ok) {
      console.error("[v0] Failed to load progress:", response.status)
      return {}
    }

    const data = await response.json()
    console.log("[v0] Progress loaded:", data)
    return data.progress || {}
  } catch (error) {
    console.error("[v0] Error loading progress:", error.message)
    return {}
  }
}

export async function loadScores() {
  try {
    console.log("[v0] loadScores called")

    const response = await fetch("/api/scores/load", {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
      credentials: "include", // Include cookies
    })

    console.log("[v0] loadScores response status:", response.status)

    if (!response.ok) {
      console.error("[v0] Failed to load scores:", response.status)
      return {}
    }

    const data = await response.json()
    console.log("[v0] Scores loaded:", data)
    return data.scores || {}
  } catch (error) {
    console.error("[v0] Error loading scores:", error.message)
    return {}
  }
}

export async function getProgressStats() {
  try {
    console.log("[v0] getProgressStats called")

    const response = await fetch("/api/progress/get-stats", {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
      credentials: "include", // Include cookies
    })

    console.log("[v0] getProgressStats response status:", response.status)

    if (!response.ok) {
      console.error("[v0] Failed to get stats:", response.status)
      return { completed: 0, total: 0, percentage: 0 }
    }

    const data = await response.json()
    console.log("[v0] Stats loaded:", data)
    return data.stats || { completed: 0, total: 0, percentage: 0 }
  } catch (error) {
    console.error("[v0] Error getting stats:", error.message)
    return { completed: 0, total: 0, percentage: 0 }
  }
}

export async function resetProgressForStudent(userId) {
  try {
    const response = await fetch("/api/progress/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
      credentials: "include", // Include cookies
      body: JSON.stringify({ userId }),
    })

    if (!response.ok) {
      console.error("[v0] Failed to reset progress:", response.status)
      return false
    }

    console.log("[v0] Progress reset for student:", userId)
    return true
  } catch (error) {
    console.error("[v0] Error resetting progress:", error)
    return false
  }
}

export async function resetScoresForStudent(userId) {
  try {
    const response = await fetch("/api/scores/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
      credentials: "include", // Include cookies
      body: JSON.stringify({ userId }),
    })

    if (!response.ok) {
      console.error("[v0] Failed to reset scores:", response.status)
      return false
    }

    console.log("[v0] Scores reset for student:", userId)
    return true
  } catch (error) {
    console.error("[v0] Error resetting scores:", error)
    return false
  }
}

export default {
  markLessonDone,
  saveQuizResult,
  loadProgress,
  loadScores,
  getProgressStats,
  resetProgressForStudent,
  resetScoresForStudent,
}
