import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, ArrowLeft, Sparkles, ShieldCheck, Tag } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import api from '../lib/api'

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)

const SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'Free Size']

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`)
        setProduct(res.data.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col bg-[#FAF8F5]"
    >
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb Navigation */}
        {product && (
          <nav className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#8E867B] mb-8 font-medium">
            <Link to="/" className="hover:text-[#C5A059] transition-colors">Atelier</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
            <Link to={`/category/${product.category}`} className="hover:text-[#C5A059] transition-colors">{product.category}</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="text-[#1C1917] font-semibold line-clamp-1">{product.product_name}</span>
          </nav>
        )}

        {loading && <div className="py-32"><LoadingSpinner size="lg" /></div>}

        {error && (
          <div className="text-center py-32 bg-white rounded-3xl border border-[#EAE3D6] p-8 max-w-md mx-auto shadow-sm">
            <p className="text-[#8E867B] mb-4 text-sm">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#1C1917] hover:text-[#C5A059] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Catalog
            </button>
          </div>
        )}

        {product && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Silhouette Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl overflow-hidden bg-[#F7F4EE] border border-[#EBE5DC] aspect-[3/4] shadow-[0_16px_36px_rgba(28,25,23,0.06)] relative"
            >
              {product.image_path ? (
                <img
                  src={product.image_path}
                  alt={product.product_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#FAF8F5] via-[#F4EFEA] to-[#EAE3D6] p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/80 border border-[#DDD5C7] flex items-center justify-center mb-4 shadow-sm">
                    <Sparkles className="w-8 h-8 text-[#C5A059]" />
                  </div>
                  <span className="font-serif italic text-2xl text-[#57524A]">Luxe Drape Atelier</span>
                  <span className="text-xs uppercase tracking-widest text-[#8E867B] mt-2">
                    {product.sub_category} &bull; {product.fabric || 'Couture Handloom'}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Silhouette Details */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex flex-col bg-white border border-[#E8E2D8] rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgba(28,25,23,0.03)]"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-[#1C1917] text-[#DFBE76] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <span className="bg-[#FAF8F5] border border-[#E0D7C9] text-[#57524A] text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
                  {product.sub_category}
                </span>
                {product.product_number && (
                  <span className="text-[10px] text-[#8E867B] font-mono ml-auto">
                    {product.product_number}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#1C1917] mb-3 leading-snug">
                {product.product_name}
              </h1>

              <div className="mb-6 pb-6 border-b border-[#F0EAE1]">
                <span className="text-[11px] uppercase tracking-wider text-[#8E867B] block font-medium mb-1">
                  Atelier Retail Valuation
                </span>
                <p className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1917]">
                  {formatPrice(product.price)}
                </p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-2.5">
                  Atelier Description
                </h3>
                <p className="text-sm text-[#57524A] leading-relaxed font-light">
                  {product.description}
                </p>
              </div>

              {/* Fabric */}
              <div className="mb-6 p-4 rounded-2xl bg-[#FAF8F5] border border-[#ECE5DA]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#8E867B] mb-0.5">
                      Textile & Weave
                    </h3>
                    <p className="text-sm font-serif font-semibold text-[#1C1917]">
                      {product.fabric || 'Organic Handspun Silk Blend'}
                    </p>
                  </div>
                  <Tag className="w-5 h-5 text-[#C5A059]" />
                </div>
              </div>

              {/* Sizes Available */}
              {product.sizes_available?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-3">
                    Size Matrix
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map((size) => {
                      const available = product.sizes_available.includes(size)
                      return (
                        <span
                          key={size}
                          className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-all ${
                            available
                              ? 'border border-[#1C1917] bg-[#1C1917] text-[#DFBE76] font-semibold'
                              : 'border border-[#E5DFD4] bg-[#FAF8F5] text-[#B0A79A] line-through'
                          }`}
                        >
                          {size}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-[#F0EAE1] flex items-center justify-between mt-auto">
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#57524A] hover:text-[#1C1917] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-[#C5A059]" /> Back to Collection
                </button>
                <span className="flex items-center gap-1.5 text-xs text-[#8E867B]">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" /> Certified Authentic
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </main>
      <Footer />
    </motion.div>
  )
}
