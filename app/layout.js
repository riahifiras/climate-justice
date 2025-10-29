import './globals.css'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Image from 'next/image'

export const metadata = {
  title: 'دليل العدالة المناخية - منصة تعليمية',
    generator: 'v0.app'
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Google Fonts for Arabic readability */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="min-h-screen bg-cj-sand">
          <header className="bg-white shadow-sm border-b">
  <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-cj-green flex items-center justify-center text-white font-bold">J</div>
      <div>
        <h1 className="text-lg md:text-xl font-semibold">دليل العدالة المناخية</h1>
        <p className="text-xs md:text-sm text-gray-600">منصة تعليمية - الشبكة العربية للمجتمع المدني النسوي</p>
      </div>
    </div>

    {/* Mobile menu toggle */}
    <div className="md:hidden ml-auto">
      <button
        className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
    </div>

    {/* Navigation */}
    <nav className={`flex flex-col md:flex-row gap-2 md:gap-2 ${menuOpen ? "flex" : "hidden"} md:flex`}>
      <Link href="/" className="px-3 py-2 rounded-full text-sm text-gray-700 hover:bg-gray-100">الرئيسية</Link>
      <Link href="/course" className="px-3 py-2 rounded-full text-sm text-gray-700 hover:bg-gray-100">المحتوى</Link>
    </nav>

    {/* User badge */}
    <div className="ml-auto md:ml-4">
      <UserBadge />
    </div>
  </div>
</header>


          {/* Hero area */}
          <section className="bg-gradient-to-b from-white to-cj-sand py-8">
            <div className="container flex flex-col lg:flex-row-reverse lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-3xl font-extrabold">مرحبًا بك في دليل العدالة المناخية</h2>
                <p className="mt-2 text-gray-700">منصة تعليمية تشرح مفاهيم العدالة المناخية بأسلوب مبسط ومتاح. تصفح الفصول، تابع تقدّمك، وشارك الموارد.</p>
              </div>
              <div className="w-48 h-32 rounded-lg flex items-center justify-center text-white font-semibold">
                <Image
                  src="/pics/logo.png"
                  alt="شعار دليل العدالة المناخية"
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>
            </div>
          </section>

          <main className="container py-8">{children}</main>

          <footer className="bg-white">
            <div className="container py-6 text-sm text-gray-600">© {new Date().getFullYear()} الشبكة العربية للمجتمع المدني النسوي</div>
          </footer>
          {/* Auth gate removed from layout; now only shown on demand from landing page */}
        </div>
      </body>
    </html>
  )
}

// load a client-only wrapper that shows the auth gate when needed
const AuthGateWrapper = dynamic(() => import('../components/AuthGateWrapper'), { ssr: false })
const UserBadge = dynamic(() => import('../components/UserBadge'), { ssr: false })
