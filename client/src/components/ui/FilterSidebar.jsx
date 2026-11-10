import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X, Check } from 'lucide-react'
import { useState } from 'react'

const SUB_CATEGORIES = [
  'Shirt', 'Pant', 'Jacket', 'Dress', 'Skirt', 'Shorts',
  'Hoodie', 'Blazer', 'Kurta', 'Saree', 'Lehenga', 'T-Shirt', 'Jeans',
  'Suit', 'Leggings', 'Sweatshirt',
]

export default function FilterSidebar({ selectedSubCategory, onFilterChange }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const FilterList = () => (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EAE3D6]">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
          Garment Silhouette
        </h3>
        {selectedSubCategory && (
          <button
            onClick={() => { onFilterChange(''); setMobileOpen(false) }}
            className="text-[11px] text-[#8E867B] hover:text-[#DC2626] transition-colors underline cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      <button
        onClick={() => { onFilterChange(''); setMobileOpen(false) }}
        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer ${
          !selectedSubCategory
            ? 'bg-[#1C1917] text-[#DFBE76] shadow-sm'
            : 'text-[#57524A] hover:bg-[#FAF8F5] hover:text-[#1C1917]'
        }`}
      >
        <span>All Silhouettes</span>
        {!selectedSubCategory && <Check className="w-3.5 h-3.5 text-[#DFBE76]" />}
      </button>

      {SUB_CATEGORIES.map((sub) => {
        const isSelected = selectedSubCategory === sub
        return (
          <button
            key={sub}
            onClick={() => { onFilterChange(sub); setMobileOpen(false) }}
            className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
              isSelected
                ? 'bg-[#1C1917] text-[#DFBE76] font-semibold shadow-xs'
                : 'text-[#57524A] hover:bg-[#FAF8F5] hover:text-[#1C1917]'
            }`}
          >
            <span>{sub}</span>
            {isSelected && <Check className="w-3.5 h-3.5 text-[#DFBE76]" />}
          </button>
        )
      })}
    </div>
  )

  return (
    <>
      {/* Mobile trigger */}
      <div className="lg:hidden w-full mb-6 flex justify-between items-center">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#DDD5C7] rounded-xl text-xs font-semibold uppercase tracking-wider text-[#1C1917] shadow-2xs hover:border-[#C5A059] transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#C5A059]" />
          <span>Filter Silhouettes</span>
          {selectedSubCategory && (
            <span className="bg-[#1C1917] text-[#DFBE76] text-[10px] px-2 py-0.5 rounded-full ml-1">
              1
            </span>
          )}
        </button>
      </div>

      {/* Desktop sidebar panel */}
      <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-28">
        <div className="bg-white border border-[#E8E2D8] rounded-3xl p-6 shadow-[0_4px_24px_rgba(28,25,23,0.02)]">
          <FilterList />
        </div>
      </aside>

      {/* Mobile drawer modal */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-[#141210]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col overflow-y-auto z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE3D6] mb-4">
                <span className="font-serif font-semibold text-lg text-[#1C1917]">Filters</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg text-[#8E867B] hover:text-[#1C1917]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterList />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
