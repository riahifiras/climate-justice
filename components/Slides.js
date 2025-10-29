"use client"
import { useState } from 'react'

export default function Slides({ slides = [], onFinish }) {
  const [index, setIndex] = useState(0)

  if (!slides || slides.length === 0) return null

  const slide = slides[index]

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-8">
        <div>
          <h3 className="text-lg font-semibold">{slide.title}</h3>
          <div className="mt-2 text-gray-700">{slide.content}</div>
        </div>
        <div className="text-sm text-gray-500">شريحة {index + 1} / {slides.length}</div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button onClick={() => setIndex(i => Math.max(0, i - 1))} disabled={index === 0} className="px-3 py-2 rounded border">السابق</button>
          {index < slides.length - 1 ? (
            <button onClick={() => setIndex(i => Math.min(slides.length - 1, i + 1))} className="px-3 py-2 bg-cj-green text-white rounded">التالي</button>
          ) : (
            <button onClick={() => onFinish && onFinish()} className="px-3 py-2 bg-cj-blue text-white rounded">إنهاء الشرائح</button>
          )}
        </div>
        <div className="w-48">
          <div className="progress"><div style={{ width: `${((index+1)/slides.length)*100}%` }}></div></div>
        </div>
      </div>
    </div>
  )
}
