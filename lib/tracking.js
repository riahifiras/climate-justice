export async function markLessonDone(subId) {
  try {

    const response = await fetch("/api/progress/mark-done", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },  
      credentials: "include", // Include cookies
      body: JSON.stringify({ subId }),
    })


    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Failed to mark lesson done:", response.status, errorText)
      return false
    }

    const data = await response.json()

    if (typeof window !== "undefined") {
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

    if (!subId || !result) {
      console.error("[v0] Missing subId or result")
      return false
    }

    const response = await fetch("/api/scores/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
      credentials: "include", // Include cookies
      body: JSON.stringify({ subId, result }),
    })


    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Failed to save quiz result:", response.status, errorText)
      return false
    }

    const data = await response.json()

    if (typeof window !== "undefined") {
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

    const response = await fetch("/api/progress/load", {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
      credentials: "include", // Include cookies
    })


    if (!response.ok) {
      console.error("[v0] Failed to load progress:", response.status)
      return {}
    }

    const data = await response.json()
    return data.progress || {}
  } catch (error) {
    console.error("[v0] Error loading progress:", error.message)
    return {}
  }
}

export async function loadScores() {
  try {

    const response = await fetch("/api/scores/load", {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
      credentials: "include", // Include cookies
    })


    if (!response.ok) {
      console.error("[v0] Failed to load scores:", response.status)
      return {}
    }

    const data = await response.json()
    return data.scores || {}
  } catch (error) {
    console.error("[v0] Error loading scores:", error.message)
    return {}
  }
}

export async function getProgressStats() {
  try {

    const response = await fetch("/api/progress/get-stats", {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
      credentials: "include", // Include cookies
    })


    if (!response.ok) {
      console.error("[v0] Failed to get stats:", response.status)
      return { completed: 0, total: 0, percentage: 0 }
    }

    const data = await response.json()
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
