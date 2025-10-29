import dynamic from 'next/dynamic'

const TeacherView = dynamic(() => import('../../components/TeacherView'), { ssr: false })

export default function Page() {
  return (
    <div className="container">
      <h2 className="text-2xl font-bold mb-4">لوحة المعلم</h2>
      <TeacherView />
    </div>
  )
}
