export async function getCurrentUser() {
  try {
    const response = await fetch("/api/auth/current-user", {
      method: "GET",
      credentials: "include", // Include cookies in request
    })
    const data = await response.json()
    return data.user || null
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function saveCurrentUser(user) {
  return { user }
}

export async function logout() {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include", // Include cookies
    })
  } catch (error) {
    console.error("Error logging out:", error)
  }
}

export async function getStudents() {
  try {
    const response = await fetch("/api/auth/students", {
      credentials: "include",
    })
    const data = await response.json()
    return data.students || []
  } catch (error) {
    console.error("Error fetching students:", error)
    return []
  }
}

export async function addStudent(name, email) {
  try {
    const response = await fetch("/api/auth/login-student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include cookies to set auth-token
      body: JSON.stringify({ name, email }),
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return { user: data.user }
  } catch (error) {
    console.error("Error adding student:", error)
    return null
  }
}

export function checkTeacherCredentials(username, password) {
  const valid = username === "admin" && password === "climate123"
  return valid
}

export async function loginTeacher(username, password) {
  try {
    if (!checkTeacherCredentials(username, password)) {
      return null
    }

    const response = await fetch("/api/auth/login-teacher", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include cookies to set auth-token
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return { user: data.user }
  } catch (error) {
    console.error("Error logging in teacher:", error)
    return null
  }
}

export default {
  getCurrentUser,
  saveCurrentUser,
  logout,
  getStudents,
  addStudent,
  checkTeacherCredentials,
  loginTeacher,
}
