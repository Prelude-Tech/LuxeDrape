import { useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Crown, Gem, Layers, Scissors, ShieldCheck } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ProductGrid from '../components/ui/ProductGrid'
import { useProducts } from '../hooks/useProducts'
import { subscribeToCatalogUpdates } from '../lib/broadcast'

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -15 },
}

const CATEGORIES = [
  {
    name: 'Women',
    icon: Crown,
    tag: 'Haute Silhouettes',
    desc: 'Lehengas, Anarkalis & Handcrafted Silk Sarees',
    badge: 'Popular',
    accent: '#C5A059',
  },
  {
    name: 'Men',
    icon: Scissors,
    tag: 'Architectural Cuts',
    desc: 'Bandhgalas, Structured Sherwanis & Linen Kurtas',
    badge: 'New Season',
    accent: '#8E7341',
  },
  {
    name: 'Kids',
    icon: Gem,
    tag: 'Celebratory Miniatures',
    desc: 'Comfortable pure cottons & festive silk sets',
    badge: 'Festive',
    accent: '#A68A56',
  },
  {
    name: 'Unisex',
    icon: Layers,
    tag: 'Modern Drapes',
    desc: 'Pashmina shawls, stoles & versatile capes',
    badge: 'Essentials',
    accent: '#9A8250',
  },
]

export default function HomePage() {
  const { products, loading, fetchProducts } = useProducts()
  const featuredRef = useRef(null)

  useEffect(() => {
    fetchProducts({ limit: 8 })

    const unsubscribe = subscribeToCatalogUpdates(() => {
      fetchProducts({ limit: 8 })
    })

    const interval = setInterval(() => {
      fetchProducts({ limit: 8 })
    }, 10000)

    const handleFocus = () => fetchProducts({ limit: 8 })
    window.addEventListener('focus', handleFocus)

    return () => {
      unsubscribe()
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
    }
  }, [fetchProducts])

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-[#141210] text-[#FAF8F5] overflow-hidden py-24 sm:py-32">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-[#201C18] border border-[#3E3831] rounded-full px-4 py-1 text-xs text-[#DFBE76] mb-8 font-medium"
          >
            Spring / Summer Bridal &amp; Haute Couture 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-serif font-medium tracking-tight leading-[1.08] mb-6 text-[#FAF8F5]"
          >
            The Art of <br />
            <span className="italic font-normal text-[#DFBE76]">
              Modern Draping
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-base sm:text-lg text-[#B5ADA1] max-w-2xl mx-auto mb-10 font-light leading-relaxed"
          >
            Handcrafted silhouettes engineered with timeless artisanal textiles, architectural cuts, and supreme contemporary drape.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            <button
              onClick={() => featuredRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#C5A059] hover:bg-[#B38E46] text-[#141210] font-semibold px-7 py-3.5 rounded-xl transition-all cursor-pointer text-sm"
            >
              <span>Explore Latest Drapes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/category/Women"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-[#2A241F] text-[#FAF8F5] border border-[#3E3831] font-medium px-7 py-3.5 rounded-xl transition-all text-sm"
            >
              Couture Lookbook
            </Link>
          </motion.div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-12 border-t border-[#29241F] text-left">
            <div>
              <p className="text-xl sm:text-2xl font-serif text-[#DFBE76] font-medium tabular-nums">100%</p>
              <p className="text-xs text-[#A8A196] font-medium mt-0.5">Pure handwoven silks</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-serif text-[#DFBE76] font-medium">Auto SKU</p>
              <p className="text-xs text-[#A8A196] font-medium mt-0.5">Sequential product indexing</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-serif text-[#DFBE76] font-medium">Multi-Tier</p>
              <p className="text-xs text-[#A8A196] font-medium mt-0.5">Role-based atelier access</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-serif text-[#DFBE76] font-medium tabular-nums">0.05mm</p>
              <p className="text-xs text-[#A8A196] font-medium mt-0.5">Artisanal seam tolerance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <section className="py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <p className="text-xs uppercase font-bold tracking-[0.24em] text-[#C5A059] mb-2">
              Curated Wardrobe
            </p>
            <h2 className="text-4xl sm:text-5xl font-serif font-medium text-[#1C1917] mb-3">
              Shop by Silhouette Category
            </h2>
            <p className="text-sm text-[#736B61] max-w-md mx-auto">
              Select an atelier collection tailored with handcrafted textiles and precise draping techniques.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat, i) => {
              const IconComponent = cat.icon
              return (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.45 }}
                >
                  <Link
                    to={`/category/${cat.name}`}
                    className="block group bg-white border border-[#EBE5DC] rounded-3xl p-7 hover:border-[#C5A059]/60 hover:shadow-[0_16px_36px_rgba(28,25,23,0.06)] transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-[#F7F4EE] border border-[#E6DFC2] flex items-center justify-center group-hover:bg-[#1C1917] group-hover:border-[#1C1917] transition-colors duration-300">
                          <IconComponent className="w-5 h-5 text-[#C5A059] group-hover:text-[#DFBE76] transition-colors" />
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#FAF8F5] text-[#8E867B] border border-[#E7E1D8]">
                          {cat.badge}
                        </span>
                      </div>

                      <p className="text-[11px] uppercase tracking-widest font-semibold text-[#C5A059] mb-1">
                        {cat.tag}
                      </p>
                      <h3 className="text-2xl font-serif font-semibold text-[#1C1917] mb-2 group-hover:text-[#9E7B36] transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-[#736B61] leading-relaxed mb-6">
                        {cat.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#F2ECE3] flex items-center justify-between text-xs font-semibold text-[#1C1917]">
                      <span>View Collection</span>
                      <ArrowRight className="w-4 h-4 text-[#C5A059] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section ref={featuredRef} className="py-20 bg-[#F5F2EB] border-t border-[#E8E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4"
          >
            <div>
              <p className="text-xs uppercase font-bold tracking-[0.24em] text-[#C5A059] mb-2">
                Atelier Showcase
              </p>
              <h2 className="text-4xl sm:text-5xl font-serif font-medium text-[#1C1917] mb-2">
                Latest Atelier Arrivals
              </h2>
              <p className="text-sm text-[#736B61]">
                Masterfully tailored garments recently released to our physical and digital catalog.
              </p>
            </div>
            <Link
              to="/category/Women"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#1C1917] hover:text-[#9E7B36] transition-colors bg-white border border-[#DDD5C7] px-4 py-2.5 rounded-full shadow-2xs"
            >
              <span>Explore All Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
            </Link>
          </motion.div>

          <ProductGrid products={products} loading={loading} skeletonCount={8} />
        </div>
      </section>

      <Footer />
    </motion.div>
  )
}
