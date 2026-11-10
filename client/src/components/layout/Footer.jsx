import { Link } from 'react-router-dom'
import { Sparkles, Shield, Compass, HeartHandshake, ArrowRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#141210] text-[#A8A196] border-t border-[#29241F] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#DFBE76] via-[#C5A059] to-[#9E7B36] p-[1px]">
                <div className="w-full h-full bg-[#1C1917] rounded-[11px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#DFBE76]" />
                </div>
              </div>
              <div>
                <span className="text-xl font-serif font-semibold tracking-wider text-[#FAF8F5]">
                  LUXE <span className="italic font-normal text-[#C5A059]">DRAPE</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.26em] text-[#8E867B] block font-medium">
                  Contemporary Haute Couture
                </span>
              </div>
            </Link>
            <p className="text-sm text-[#8E867B] max-w-sm leading-relaxed mb-6">
              Curated silhouettes engineered with pure organic fabrics, bespoke hand-draping, and modern architectural elegance. Designed for distinguished taste.
            </p>
            <div className="flex items-center gap-4 text-xs text-[#C5A059]">
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> 100% Certified Fabrics</span>
              <span className="flex items-center gap-1.5"><HeartHandshake className="w-3.5 h-3.5" /> Artisanal Craft</span>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#FAF8F5] mb-4">Collections</h4>
            <ul className="space-y-2.5 text-sm">
              {['Men', 'Women', 'Kids', 'Unisex'].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/category/${cat}`}
                    className="hover:text-[#DFBE76] transition-colors flex items-center gap-1.5"
                  >
                    <span>{cat} Atelier</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Access */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#FAF8F5] mb-4">Studio & Ops</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/admin/login" className="hover:text-[#DFBE76] transition-colors flex items-center gap-1.5">
                  <span>Atelier Admin Portal</span>
                  <ArrowRight className="w-3 h-3 text-[#C5A059]" />
                </Link>
              </li>
              <li className="text-xs text-[#7A7369]">
                Port 5000 API Active (Express + MongoDB)
              </li>
              <li className="text-xs text-[#7A7369]">
                Vite HMR Client @ Port 5173
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#231F1B] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A7369]">
          <p>&copy; {new Date().getFullYear()} LUXE DRAPE ATELIER. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Crafted with</span>
            <span className="text-[#C5A059]">&diams;</span>
            <span>Atelier Clay & Glass Design System</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
