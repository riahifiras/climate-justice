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
            <div className="container flex flex-wrap items-center justify-between py-3 sm:py-4 gap-2">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cj-green flex items-center justify-center text-white font-bold text-sm sm:text-base shrink-0">J</div>
                <div className="truncate">
                  <h1 className="text-lg sm:text-xl font-semibold truncate">دليل العدالة المناخية</h1>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">منصة تعليمية - الشبكة العربية للمجتمع المدني النسوي</p>
                </div>
              </div>
              <nav className="flex flex-wrap items-center gap-1 sm:gap-2 mt-2 sm:mt-0">
                <Link href="/" className="px-2 py-1 sm:px-3 sm:py-2 rounded-full text-xs sm:text-sm text-gray-700 hover:bg-gray-100">الرئيسية</Link>
                <Link href="/course" className="px-2 py-1 sm:px-3 sm:py-2 rounded-full text-xs sm:text-sm text-gray-700 hover:bg-gray-100">المحتوى</Link>
              </nav>
              <div className="ml-2 sm:ml-4 mt-2 sm:mt-0">
                <UserBadge />
              </div>
            </div>
          </header>

          {/* Hero area */}
          <section className="bg-gradient-to-b from-white to-cj-sand py-8">
            <div className="container flex flex-col lg:flex-row-reverse lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-extrabold">مرحبًا بك في دليل العدالة المناخية</h2>
                <p className="mt-2 text-gray-700 text-sm sm:text-base">منصة تعليمية تشرح مفاهيم العدالة المناخية بأسلوب مبسط ومتاح. تصفح الفصول، تابع تقدّمك، وشارك الموارد.</p>
              </div>
              <div className="w-36 sm:w-48 h-24 sm:h-32 rounded-lg flex items-center justify-center text-white font-semibold">
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
        </div>
      </body>
    </html>
  )
}

// load a client-only wrapper that shows the auth gate when needed
const AuthGateWrapper = dynamic(() => import('../components/AuthGateWrapper'), { ssr: false })
const UserBadge = dynamic(() => import('../components/UserBadge'), { ssr: false })
