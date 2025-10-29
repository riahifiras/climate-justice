"use client"
import Link from 'next/link'
import course from '../data/course.json'

export default function Sidebar({ current }) {
  return (
    <aside className="w-64 mr-6 hidden lg:block">
      <div className="sticky top-6">
        <div className="card">
          <h3 className="font-semibold mb-3">{course.guide_title}</h3>
          <nav className="text-sm space-y-3">
            {course.sections.map((s) => (
              <div key={s.id}>
                <Link href={`/course/${s.id}`} className={"block py-2 px-2 rounded " + (current === s.id ? 'text-white bg-cj-green' : 'text-gray-700 hover:bg-gray-50')}>{s.title}</Link>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-4">
          {/* progress will be shown in the right column; this small widget can be used on narrow layouts */}
        </div>
      </div>
    </aside>
  )
}
