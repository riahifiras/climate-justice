"use client"
import { useState } from "react"
import references from "../data/references.json"

export default function ReferencesModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredReferences = references.references.filter(
    (ref) =>
      ref.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.authors.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-cj-green text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">المراجع والمصادر</h2>
          <button onClick={onClose} className="text-white hover:bg-cj-green/80 rounded p-2 transition">
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="ابحث عن مرجع..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cj-green text-right"
          />
        </div>

        {/* References List */}
        <div className="overflow-y-auto flex-1 p-6">
          <div className="space-y-4">
            {filteredReferences.length > 0 ? (
              filteredReferences.map((ref) => (
                <div key={ref.id} className="border-r-4 border-cj-green pr-4 py-3 hover:bg-gray-50 transition rounded">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 text-right">
                      <p className="font-semibold text-gray-900">{ref.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{ref.authors}</p>
                      {ref.year && <p className="text-xs text-gray-500 mt-1">({ref.year})</p>}
                    </div>
                    <span className="text-cj-green font-bold text-lg flex-shrink-0">{ref.id}</span>
                  </div>
                  {ref.url && (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cj-blue hover:underline text-sm mt-2 inline-block"
                    >
                      اذهب للمصدر ↗
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">لم يتم العثور على مراجع مطابقة</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t text-center text-sm text-gray-600">
          عدد المراجع: {filteredReferences.length} من {references.references.length}
        </div>
      </div>
    </div>
  )
}
