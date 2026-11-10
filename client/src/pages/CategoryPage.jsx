import { useEffect, useState, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Sparkles } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ProductGrid from '../components/ui/ProductGrid'
import FilterSidebar from '../components/ui/FilterSidebar'
import { useProducts } from '../hooks/useProducts'
import { subscribeToCatalogUpdates } from '../lib/broadcast'

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -15 },
}

export default function CategoryPage({ defaultCategory }) {
  const { categoryName, subCategory } = useParams()
  const navigate = useNavigate()
  const { products, pagination, loading, fetchProducts } = useProducts()

  // Derive normalized category name (e.g., 'women' -> 'Women')
  const rawCat = defaultCategory || categoryName || 'Women'
  const activeCategory = rawCat.charAt(0).toUpperCase() + rawCat.slice(1).toLowerCase()

  const [selectedSubCategory, setSelectedSubCategory] = useState(subCategory || '')

  // Keep state in sync if URL subCategory changes
  useEffect(() => {
    setSelectedSubCategory(subCategory || '')
  }, [subCategory, categoryName, defaultCategory])

  const load = useCallback(() => {
    fetchProducts({
      category: activeCategory,
      ...(selectedSubCategory ? { sub_category: selectedSubCategory } : {}),
      limit: 20,
    })
  }, [activeCategory, selectedSubCategory, fetchProducts])

  // Real-time visibility: load initially, on broadcast events, interval, and tab focus
  useEffect(() => {
    load()

    const unsubscribe = subscribeToCatalogUpdates(() => {
      load()
    })

    // Poll every 5s for real-time visibility of newly uploaded items
    const interval = setInterval(load, 5000)

    const handleFocus = () => load()
    window.addEventListener('focus', handleFocus)

    return () => {
      unsubscribe()
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
    }
  }, [load])

  const handleFilterChange = (sub) => {
    setSelectedSubCategory(sub)
    if (sub) {
      navigate(`/${activeCategory.toLowerCase()}/${sub.toLowerCase()}`)
    } else {
      navigate(`/${activeCategory.toLowerCase()}`)
    }
  }

  const totalCount = pagination?.total ?? products.length

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#8E867B] mb-8 font-medium">
          <Link to="/" className="hover:text-[#C5A059] transition-colors">Atelier</Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
          <Link to={`/${activeCategory.toLowerCase()}`} className="hover:text-[#C5A059] transition-colors font-semibold text-[#1C1917]">
            {activeCategory} Collection
          </Link>
          {selectedSubCategory && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="text-[#C5A059] font-bold capitalize">{selectedSubCategory}</span>
            </>
          )}
        </nav>

        {/* Page Header */}
        <div className="mb-10 pb-6 border-b border-[#EAE3D6] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span className="text-xs uppercase tracking-[0.24em] font-bold text-[#C5A059]">
                Curated Haute Catalog &bull; Real-Time Query
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-medium text-[#1C1917]">
              {activeCategory}&apos;s {selectedSubCategory ? <span className="capitalize">{selectedSubCategory}</span> : <span className="italic font-normal">Wardrobe</span>}
            </h1>
          </div>
          <p className="text-xs uppercase tracking-widest text-[#736B61] font-semibold bg-white border border-[#DDD5C7] px-4 py-2 rounded-full shadow-2xs">
            {loading ? 'Consulting Atelier Index...' : `${totalCount} Distinct Silhouette${totalCount !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Layout: Sidebar + Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <FilterSidebar
            selectedSubCategory={selectedSubCategory}
            onFilterChange={handleFilterChange}
          />
          <div className="flex-1 min-w-0 w-full">
            <ProductGrid products={products} loading={loading} skeletonCount={8} />
          </div>
        </div>
      </main>
      <Footer />
    </motion.div>
  )
}
