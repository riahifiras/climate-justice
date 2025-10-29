"use client"
import course from "../data/course.json"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { getCurrentUser } from "../lib/auth"
import ReferencesModal from "../components/ReferencesModal"

const AuthGate = dynamic(() => import("../components/AuthGate"), { ssr: false })

export default function Home() {
  const [showAuth, setShowAuth] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showReferences, setShowReferences] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const u = await getCurrentUser()
      setUser(u)
      setLoading(false)
    }
    checkUser()

    // Listen for login/logout
    const handler = async () => {
      const u = await getCurrentUser()
      setUser(u)
    }
    window.addEventListener("cj-auth-changed", handler)
    return () => window.removeEventListener("cj-auth-changed", handler)
  }, [])

  if (loading)
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="card">تحميل...</div>
      </div>
    )

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="card mb-8 text-center">
        <h1 className="text-3xl font-extrabold mb-2">{course.guide_title}</h1>
        <p className="text-lg text-gray-700 mb-4">
          منصة تعليمية تشرح مفاهيم العدالة المناخية بأسلوب مبسط ومتاح للجميع.
        </p>
        <div className="mb-4">
          <span className="inline-block bg-cj-green text-white rounded px-3 py-1 text-sm">
            {course.sections.length} فصول تعليمية
          </span>
        </div>
        {!user && (
          <button
            onClick={() => setShowAuth(true)}
            className="mt-4 px-6 py-3 bg-cj-green text-white rounded text-lg font-semibold shadow hover:bg-cj-green/90 transition"
          >
            ابدأ التعلم
          </button>
        )}
        {user && user.role === "student" && (
          <Link
            href="/course"
            className="mt-4 inline-block px-6 py-3 bg-cj-green text-white rounded text-lg font-semibold shadow hover:bg-cj-green/90 transition"
          >
            دخول الدورة
          </Link>
        )}
        {user && user.role === "teacher" && (
          <div className="mt-6">
            <Link
              href="/teacher"
              className="inline-block px-5 py-2 bg-cj-blue text-white rounded font-semibold hover:bg-cj-blue/90 transition"
            >
              لوحة تحكم المعلم
            </Link>
          </div>
        )}
      </div>

      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-3">محتويات الدورة</h2>
        <ul className="list-disc pr-6 text-right text-gray-800 space-y-2">
          {course.sections.map((s) => (
            <li key={s.id} className="font-medium">
              {s.title}{" "}
              <span className="text-gray-500 text-sm">
                ({s.subsections ? s.subsections.length + " مقاطع" : "محتوى"})
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card mb-8 text-right">
        <h2 className="text-xl font-bold mb-5 text-center">فريق إعداد الدليل</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ">
          <div className="text-center">
            <img
              src="/team/monia.png"
              alt="منى الحامدي"
              className="w-28 h-28 mx-auto rounded-full object-cover mb-2"
            />
            <h3 className="font-bold text-lg">منى الحامدي</h3>
            <p className="text-sm text-gray-600">
              نقطة اتصال وعضو في فريق التنسيق الإقليمي للشرق الأوسط وشمال إفريقيا التابع لمجموعة المرأة والنوع الاجتماعي (WGC)
            </p>
          </div>

          <div className="text-center">
            <img
              src="/team/fatma.png"
              alt="د. فاطمة خفاجي"
              className="w-28 h-28 mx-auto rounded-full object-cover mb-2"
            />
            <h3 className="font-bold text-lg">د. فاطمة خفاجي</h3>
            <p className="text-sm text-gray-600">
              رئيسة مناوبة للشبكة العربية للمجتمع النسوي ونقطة اتصال لفريق التنسيق الإقليمي لمجموعة المرأة والنوع الاجتماعي (WGC)
            </p>
          </div>

          <div className="text-center">
            <img
              src="/team/fatna.png"
              alt="فاتنة أفييد"
              className="w-28 h-28 mx-auto rounded-full object-cover mb-2"
            />
            <h3 className="font-bold text-lg">فاتنة أفييد</h3>
            <p className="text-sm text-gray-600">
              عضو المكتب التنفيذي للائتلاف المغربي من أجل العدالة المناخية
            </p>
          </div>

          <div className="text-center">
            <img
              src="/team/ghada.png"
              alt="ﻋﻼء السقاف"
              className="w-28 h-28 mx-auto rounded-full object-cover mb-2"
            />
            <h3 className="font-bold text-lg">غداء السقاف</h3>
            <p className="text-sm text-gray-600">
              رئيسة منظمة بنية السلام للتنمية - اليمن
            </p>
          </div>

          <div className="text-center">
            <img
              src="/team/mala.png"
              alt="ﻫلا مراد"
              className="w-28 h-28 mx-auto rounded-full object-cover mb-2"
            />
            <h3 className="font-bold text-lg">ملا مراد</h3>
            <p className="text-sm text-gray-600">
              المدير التنفيذي لجمعية دِين للتنمية - الأردن
            </p>
          </div>
        </div>

        <hr className="my-6" />

        <ul className="text-gray-700 text-right space-y-1 text-sm">
          <li>إعداد وإشراف: الشبكة العربية للمجتمع المدني النسوي</li>
          <li>تنسيق المحتوى: فريق المناخ</li>
          <li>جميع الحقوق محفوظة © {new Date().getFullYear()}</li>
        </ul>
        <button
          onClick={() => setShowReferences(true)}
          className="mt-6 w-full px-4 py-2 bg-cj-blue text-white rounded font-semibold hover:bg-cj-blue/90 transition"
        >
          عرض المراجع والمصادر
        </button>
      </div>

      {showAuth && (
        <AuthGate
          onAuth={() => {
            setShowAuth(false)
            window.dispatchEvent(new Event("cj-auth-changed"))
          }}
        />
      )}

      <ReferencesModal isOpen={showReferences} onClose={() => setShowReferences(false)} />
    </div>
  )
}
