"use client"
import { useState } from 'react'
import { saveQuizResult } from '../lib/tracking'

export default function Quiz({ subId, questions, onComplete }) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(null)

  function choose(qi, val) {
    setAnswers(a => ({ ...a, [qi]: val }))
  }

  function submit() {
    let correct = 0
    questions.forEach((q, i) => {
      if (answers[i] != null && answers[i] === q.correct) correct++
    })
    const pct = Math.round((correct / questions.length) * 100)
    setScore({ correct, total: questions.length, pct })
    setSubmitted(true)
    saveQuizResult(subId, { correct, total: questions.length, pct, at: Date.now() })
    if (onComplete) onComplete({ correct, total: questions.length, pct })
  }

  return (
    <div className="card">
      <h4 className="font-semibold mb-3">اختبار قصير</h4>
      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={i} className="">
            <div className="font-medium">{i+1}. {q.q}</div>
            <div className="mt-2 space-y-2">
              {q.type === 'tf' ? (
                ['true','false'].map((v) => (
                  <label key={v} className={"flex items-center gap-2 p-2 rounded " + (answers[i] === v ? 'bg-gray-50' : '')}>
                    <input type="radio" name={`q-${i}`} checked={answers[i]===v} onChange={() => choose(i, v)} />
                    <span className="text-sm">{v === 'true' ? 'صح' : 'خطأ'}</span>
                  </label>
                ))
              ) : (
                q.options.map((opt, oi) => (
                  <label key={oi} className={"flex items-center gap-2 p-2 rounded " + (answers[i] === opt.value ? 'bg-gray-50' : '')}>
                    <input type="radio" name={`q-${i}`} checked={answers[i]===opt.value} onChange={() => choose(i, opt.value)} />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        {!submitted ? (
          <button onClick={submit} className="bg-cj-green text-white px-4 py-2 rounded">إرسال</button>
        ) : (
          <div className="text-sm">نتيجتك: {score.correct} / {score.total} — {score.pct}%</div>
        )}
      </div>
    </div>
  )
}
