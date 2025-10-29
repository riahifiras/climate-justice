import course from '../../../data/course.json'
import Sidebar from '../../../components/Sidebar'
import SectionCard from '../../../components/SectionCard'
import dynamic from 'next/dynamic'

const ForceRerenderOnAuth = dynamic(() => import('../../../components/ForceRerenderOnAuth'), { ssr: false })

export async function generateStaticParams() {
  return course.sections.map(s => ({ id: s.id }))
}

export default function SectionPage({ params }) {
  const section = course.sections.find(s => s.id === params.id) || { title: 'غير موجود', subsections: [] }
  return (
    <ForceRerenderOnAuth>
      <div className="lg:flex">
        <Sidebar current={section.id} />
        <div className="flex-1">
          <SectionCard section={section} />
        </div>
      </div>
    </ForceRerenderOnAuth>
  )
}
