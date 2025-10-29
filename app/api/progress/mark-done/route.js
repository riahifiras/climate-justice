import { getDatabase } from "../../../../lib/mongodb";
import { verifyToken } from "../../../../lib/jwt";
import course from "../../../../data/course.json";

export async function POST(request) {
  try {
    console.log("[v0] mark-done API called");

    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      console.error("[v0] No auth token in cookies");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      console.error("[v0] Invalid token");
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userId = decoded.id;
    console.log("[v0] User ID:", userId);

    const { subId } = await request.json();
    console.log("[v0] SubId:", subId);

    let sectionId = null;
    let subsectionIndex = null;

    for (const section of course.sections) {
      const idx = (section.subsections || []).findIndex((x) => x.id === subId);
      if (idx !== -1) {
        sectionId = section.id;
        subsectionIndex = idx;
        break;
      }
    }

    if (!sectionId || subsectionIndex === null) {
      console.error("[v0] Subsection not found:", subId);
      return new Response(JSON.stringify({ error: "Subsection not found" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("[v0] Found section:", sectionId, "subsection index:", subsectionIndex);

    const db = await getDatabase();
    const progressCollection = db.collection("progress");

    const existing = await progressCollection.findOne({ userId }) || {};
    const completedSubsections = existing.completedSubsections || {};
    if (!completedSubsections[sectionId] || typeof completedSubsections[sectionId] !== "object") {
      completedSubsections[sectionId] = {};
    }

    completedSubsections[sectionId][subsectionIndex] = true;

    const result = await progressCollection.updateOne(
      { userId },
      {
        $set: {
          userId,
          completedSubsections,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log("[v0] Update result:", result);

    return new Response(JSON.stringify({ success: true, message: "Lesson marked as done" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[v0] Error marking subsection done:", error);
    return new Response(
      JSON.stringify({ error: "Failed to mark subsection done", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
