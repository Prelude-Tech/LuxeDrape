import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)

export default function ProductCard({ product }) {
  const { _id, product_name, category, sub_category, price, fabric, image_path, sizes_available = [], product_number, description } = product

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="bg-white rounded-2xl overflow-hidden border border-[#E8E2D8] hover:border-[#C5A059]/60 shadow-[0_2px_8px_rgba(28,25,23,0.04)] hover:shadow-[0_12px_24px_rgba(28,25,23,0.07)] transition-all duration-200 group cursor-pointer flex flex-col h-full"
    >
      <Link to={`/product/${_id}`} className="block flex flex-col h-full">
        {/* Image / Silhouette Showcase */}
        <div className="relative overflow-hidden aspect-[3/4] bg-[#F7F4EE]">
          {image_path ? (
            <img
              src={image_path}
              alt={product_name}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
          ) : null}

          {/* Fallback Luxury Atelier Graphic */}
          <div
            className="absolute inset-0 bg-[#F4EFEA] items-center justify-center flex-col text-[#8E867B] p-6 text-center"
            style={{ display: image_path ? 'none' : 'flex' }}
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-[#DDD5C7] flex items-center justify-center mb-2 font-serif font-bold text-xs text-[#9E7B36] shadow-xs">
              LD
            </div>
            <span className="text-xs font-serif italic text-[#57524A]">Luxe Drape Atelier</span>
            <span className="text-[10px] text-[#9E9588] mt-1">{fabric || 'Artisanal Weave'}</span>
          </div>

          {/* Floating Category Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            <span className="bg-[#1C1917]/90 text-[#DFBE76] text-[10px] font-medium px-2.5 py-0.5 rounded-md shadow-xs">
              {sub_category}
            </span>
            {product_number && (
              <span className="bg-white/95 text-[#57524A] text-[9px] font-mono tabular-nums px-2 py-0.5 rounded-md border border-[#E8E2D8] w-fit">
                {product_number}
              </span>
            )}
          </div>
        </div>

        {/* Details Content */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#9E7B36] font-medium mb-1">
              <span>{category}</span>
              {fabric && <span className="text-[#8E867B] font-normal italic font-serif text-xs">{fabric}</span>}
            </div>

            <h3 className="font-serif font-semibold text-base sm:text-lg text-[#1C1917] line-clamp-2 leading-snug group-hover:text-[#9E7B36] transition-colors mb-1.5">
              {product_name}
            </h3>

            {/* Truncated Description */}
            {description && (
              <p className="text-xs text-[#736B61] line-clamp-2 leading-relaxed mb-3 font-light">
                {description}
              </p>
            )}

            {/* Sizes Available */}
            {sizes_available.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {sizes_available.slice(0, 4).map((size) => (
                  <span
                    key={size}
                    className="text-[10px] font-medium bg-[#FAF8F5] border border-[#E5DFD4] text-[#57524A] px-2 py-0.5 rounded"
                  >
                    {size}
                  </span>
                ))}
                {sizes_available.length > 4 && (
                  <span className="text-[10px] text-[#8E867B] self-center">
                    +{sizes_available.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Price & Action */}
          <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between mt-auto">
            <div>
              <span className="text-[10px] text-[#8E867B] block font-medium">Price</span>
              <span className="text-base sm:text-lg font-serif font-semibold tabular-nums text-[#1C1917]">{formatPrice(price)}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#FAF8F5] group-hover:bg-[#1C1917] border border-[#E2DBD0] group-hover:border-[#1C1917] flex items-center justify-center transition-colors">
              <ArrowUpRight className="w-4 h-4 text-[#57524A] group-hover:text-[#DFBE76] transition-colors" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
