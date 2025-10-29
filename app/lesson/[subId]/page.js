import course from '../../../data/course.json'
import LessonView from '../../../components/LessonView'

export async function generateStaticParams() {
  // generate all subsection ids
  const params = []
  course.sections.forEach(s => {
    (s.subsections || []).forEach(sub => params.push({ subId: sub.id }))
  })
  return params
}

export default function LessonPage({ params }) {
  const { subId } = params
  let found = null
  let sectionId = null
  for (const s of course.sections) {
    const sub = (s.subsections || []).find(x => x.id === subId)
    if (sub) { found = sub; sectionId = s.id; break }
  }

  if (!found) return <div className="container card">المقطع غير موجود</div>

  return (
    <div className="lg:flex lg:flex-row-reverse lg:gap-6">
      <div className="flex-1">
        <LessonView sectionId={sectionId} subsection={found} />
      </div>
    </div>
  )
}
