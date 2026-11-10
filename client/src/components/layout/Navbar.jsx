import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, Shield, ArrowUpRight } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const NAV_LINKS = [
  { label: 'All Collections', to: '/' },
  { label: 'Men', to: '/men' },
  { label: 'Women', to: '/women' },
  { label: 'Kids', to: '/kids' },
  { label: 'Unisex', to: '/unisex' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E2D8] transition-all">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-[#1C1917] border border-[#3E3831] flex items-center justify-center font-serif font-bold text-sm text-[#DFBE76] shadow-xs">
            LD
          </div>
          <div>
            <span className="text-lg font-serif font-semibold tracking-wide text-[#1C1917] block leading-tight">
              LUXE <span className="italic font-normal text-[#C5A059]">DRAPE</span>
            </span>
            <span className="text-[10px] text-[#8E867B] block font-medium">
              Haute Atelier
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-1 bg-[#F4EFEA] p-1 rounded-full border border-[#E5DFD4]">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className="relative px-4 py-1.5 text-xs font-medium text-[#57524A] hover:text-[#1C1917] transition-colors rounded-full block"
              >
                {({ isActive }) => (
                  <>
                    <span className={isActive ? 'text-[#1C1917] font-semibold relative z-10' : 'relative z-10'}>
                      {link.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-white rounded-full shadow-[0_1px_4px_rgba(28,25,23,0.06)] border border-[#E0D7C9]"
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Auth / Admin CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 bg-[#F4EFEA] border border-[#E2DBD0] rounded-full pl-3 pr-1.5 py-1.5 shadow-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#C5A059]" />
                <span className="text-xs font-semibold text-[#1C1917]">{user.username}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-[#1C1917] text-[#DFBE76] px-2 py-0.5 rounded-full">
                  {user.role === 'master_admin' ? 'Master' : 'Secondary'}
                </span>
              </div>
              <Link
                to={user.role === 'master_admin' ? '/admin/dashboard' : '/admin/secondary'}
                className="text-xs font-medium bg-[#FFFFFF] hover:bg-[#FAF8F5] text-[#1C1917] border border-[#DDD5C7] px-3 py-1 rounded-full transition-all flex items-center gap-1 shadow-2xs"
              >
                Dashboard
                <ArrowUpRight className="w-3 h-3 text-[#8E867B]" />
              </Link>
              <button
                onClick={logout}
                title="Log out"
                className="p-1.5 text-[#8E867B] hover:text-[#DC2626] hover:bg-white rounded-full transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/admin/login"
              className="text-xs uppercase tracking-wider font-semibold text-[#1C1917] hover:text-[#9E7B36] bg-[#FFFFFF] border border-[#DDD5C7] px-4 py-2.5 rounded-full shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>Atelier Portal</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A059]" />
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-xl text-[#1C1917] hover:bg-[#F4EFEA] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden overflow-hidden border-t border-[#E8E2D8] bg-[#FAF8F5]"
          >
            <ul className="flex flex-col px-4 py-4 gap-1.5">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                        isActive
                          ? 'bg-[#1C1917] text-[#DFBE76]'
                          : 'text-[#57524A] hover:bg-[#F4EFEA]'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              {isAuthenticated && user ? (
                <li className="mt-3 pt-3 border-t border-[#E8E2D8]">
                  <div className="flex items-center justify-between px-3 py-2 bg-[#F4EFEA] rounded-xl">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#C5A059]" />
                      <span className="text-xs font-semibold text-[#1C1917]">{user.username}</span>
                      <span className="text-[10px] bg-[#1C1917] text-[#DFBE76] px-2 py-0.5 rounded-full font-bold uppercase">
                        {user.role === 'master_admin' ? 'Master' : 'Secondary'}
                      </span>
                    </div>
                    <button
                      onClick={() => { logout(); setMenuOpen(false) }}
                      className="p-1.5 text-[#DC2626] hover:bg-white rounded-lg cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ) : (
                <li className="mt-3 pt-3 border-t border-[#E8E2D8]">
                  <Link
                    to="/admin/login"
                    onClick={() => setMenuOpen(false)}
                    className="block text-center px-4 py-3 text-xs uppercase tracking-wider font-semibold bg-[#1C1917] text-[#DFBE76] rounded-xl"
                  >
                    Atelier Admin Portal &rarr;
                  </Link>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
