"use client"
export default function QuizResultModal({ result, onClose, onGoToModule }) {
  if (!result) return null
  const isPass = result.pct >= 60
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className={`bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center border-4 ${isPass ? 'border-cj-green' : 'border-red-500'}`}>
        <h2 className={`text-2xl font-bold mb-4 ${isPass ? 'text-cj-green' : 'text-red-500'}`}>{isPass ? 'أحسنت!' : 'حاول مرة أخرى'}</h2>
        <div className="text-lg mb-2">نتيجتك: <span className="font-bold">{result.correct} / {result.total}</span> ({result.pct}%)</div>
        <div className="mb-6 text-gray-600">{isPass ? 'لقد اجتزت الاختبار بنجاح.' : 'لم تحقق درجة النجاح المطلوبة. يمكنك مراجعة الدرس والمحاولة مجددًا.'}</div>
        <div className="flex justify-center gap-3 mt-4">
          <button onClick={onGoToModule} className="px-5 py-2 bg-cj-green text-white rounded font-semibold hover:bg-cj-green/90 transition">العودة إلى الفصل</button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">إغلاق</button>
        </div>
      </div>
    </div>
  )
}
