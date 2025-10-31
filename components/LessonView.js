"use client"
import Slides from "./Slides"
import QuizSlides from "./QuizSlides"
import QuizResultModal from "./QuizResultModal"
import { markLessonDone } from "../lib/tracking"
import { getCurrentUser } from "../lib/auth"
import { useState, useEffect } from "react"
import React from 'react' // Import React for keys and element creation

// Helper function to process text and safely convert newlines into <p> or <hr> tags
const processTextForDisplay = (text) => {
  if (!text) return null;

  const blocks = text.split('\n\n');

  return blocks.map((block, blockIndex) => {
    const key = `${blockIndex}`;
    const trimmedBlock = block.trim();

    if (trimmedBlock === '---') {
      return <hr key={key} className="my-4 border-t-2 border-gray-300" />;
    }

    if (trimmedBlock === '') {
      return null;
    }

    const htmlContent = trimmedBlock
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');

    return (
      <p
        key={key}
        className="mb-4 text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  }).filter(Boolean);
};

// ✅ Enhanced: combines text, image, and optional caption into a single React element array
const processContentItem = (item) => {
  const elements = [];

  // Process text
  if (item.text) {
    elements.push(...processTextForDisplay(item.text));
  }

  // Handle image and caption
  if (item.image) {
    elements.push(
      <div key={`${item.id}-img`} className="my-6 flex flex-col items-center">
        <img
          src={item.image}
          alt={item.subtitle || "Content image"}
          className="rounded-2xl shadow-md max-h-96 object-contain"
        />
        {item.image_caption && (
          <p className="mt-2 text-sm text-gray-500 text-center italic max-w-md">
            {item.image_caption}
          </p>
        )}
      </div>
    );
  }

  return elements;
};

export default function LessonView({ sectionId, subsection }) {
  const [slidesDone, setSlidesDone] = useState(false)
  const [quizResult, setQuizResult] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [user, setUser] = useState(null) // ✅ user state

  useEffect(() => {
    // fetch current user from server via cookie
    async function fetchUser() {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    }
    fetchUser()
  }, [])

  const slides = (subsection.content || []).map((item) => ({
    title: item.subtitle,
    content: processContentItem(item),
  }))

  const questions = (subsection.quizzes || [])
    .map((quiz) => {
      if (quiz.type === "yes_no") {
        return {
          type: "tf",
          q: quiz.question,
          correct: quiz.answer === "نعم" ? "true" : "false",
        }
      } else if (quiz.type === "multiple_choice") {
        return {
          type: "mcq",
          q: quiz.question,
          options: quiz.options.map((opt, idx) => ({
            value: String.fromCharCode(97 + idx),
            label: opt,
          })),
          correct: String.fromCharCode(97 + quiz.options.indexOf(quiz.answer)),
        }
      }
      return null
    })
    .filter(Boolean)

  async function onQuizFinish(result) {
    setQuizResult(result)
    setShowResult(true)

    await markLessonDone(subsection.id)
  }

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold mb-2">{subsection.title}</h2>
      </div>

      <div className="mt-4">
        {!slidesDone ? (
          <Slides slides={slides} onFinish={() => setSlidesDone(true)} />
        ) : (
          // ✅ Pass user as prop to QuizSlides
          <QuizSlides
            subId={subsection.id}
            questions={questions}
            onFinish={onQuizFinish}
            user={user}
          />
        )}
      </div>

      {showResult && quizResult && (
        <QuizResultModal
          result={quizResult}
          onClose={() => setShowResult(false)}
          onGoToModule={() => (window.location.href = `/course/${sectionId}`)}
        />
      )}
    </div>
  )
}