"use client"
import { useState } from "react"
import { saveQuizResult } from "../lib/tracking"

export default function QuizSlides({ subId, questions = [], onFinish, user }) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  if (!questions || questions.length === 0) return null

  const q = questions[index]

  function choose(val) {
    setAnswers((a) => ({ ...a, [index]: val }))
  }

  function next() {
    if (index < questions.length - 1) setIndex((i) => i + 1)
    else submitAll()
  }

  function prev() {
    setIndex((i) => Math.max(0, i - 1))
  }

  async function submitAll() {
    let correct = 0
    questions.forEach((qq, i) => {
      if (answers[i] != null && answers[i] === qq.correct) correct++
    })
    const pct = Math.round((correct / questions.length) * 100)
    const result = { correct, total: questions.length, pct, at: Date.now() }


    try {
      // Cookies handle authentication; no token needed
      const saved = await saveQuizResult(subId, result)
    } catch (err) {
      console.error("[v0] Failed to save quiz result:", err)
    }

    setSubmitted(true)
    if (onFinish) onFinish(result)
  }

  return (
    <div className="card">
      <div className="mb-3">
        <div className="font-medium">
          {index + 1}. {q.q}
        </div>
      </div>

      <div className="space-y-2">
        {(q.type === "tf" ? ["true", "false"] : q.options.map((o) => o.value)).map((val) => {
          const label =
            q.type === "tf"
              ? val === "true"
                ? "صح"
                : "خطأ"
              : q.options.find((o) => o.value === val).label
          const isCorrect = val === q.correct
          return (
            <label
              key={val}
              className={
                "flex items-center gap-2 p-2 rounded " +
                (answers[index] === val ? "bg-gray-50 " : "") +
                (showAnswer && isCorrect ? "border-2 border-cj-green bg-green-50" : "")
              }
            >
              <input
                type="radio"
                name={`q-${index}`}
                checked={answers[index] === val}
                onChange={() => choose(val)}
                disabled={showAnswer}
              />
              <span>{label}</span>
              {showAnswer && isCorrect && <span className="ml-2 text-cj-green font-bold">✓ الإجابة الصحيحة</span>}
            </label>
          )
        })}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button onClick={prev} disabled={index === 0} className="px-3 py-2 rounded border">
            السابق
          </button>
          <button onClick={next} className="px-3 py-2 bg-cj-green text-white rounded">
            {index < questions.length - 1 ? "التالي" : "إرسال الإجابات"}
          </button>
          {user && user.role === "teacher" && (
            <button
              type="button"
              onClick={() => setShowAnswer((a) => !a)}
              className="px-3 py-2 bg-cj-blue text-white rounded"
            >
              {showAnswer ? "إخفاء الإجابة" : "عرض الإجابة"}
            </button>
          )}
        </div>
        <div className="text-sm text-gray-500">
          سؤال {index + 1} من {questions.length}
        </div>
      </div>

      {submitted && <div className="mt-3 text-sm">تم إرسال الإجابات. النتيجة محفوظة.</div>}
    </div>
  )
}
