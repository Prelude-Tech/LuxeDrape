import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, User, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, KeyRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const quickFill = (username, password) => {
    setForm({ username, password })
    toast.success(`Loaded credentials for ${username}`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username.trim() || !form.password) {
      toast.error('Please enter both username and password')
      return
    }
    setLoading(true)
    try {
      const user = await login(form.username, form.password)
      toast.success(`Welcome back, ${user.username}!`)
      if (user.role === 'master_admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/admin/secondary')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#141210] relative flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Ambient luxury lighting */}
      <div className="absolute top-[-15%] left-[-10%] w-[550px] h-[550px] rounded-full bg-[#C5A059]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#9E7B36]/10 blur-[130px] pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)',
          backgroundSize: '36px 36px'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[460px] z-10"
      >
        {/* Main atelier glass card */}
        <div className="bg-[#1C1917]/90 border border-[#C5A059]/25 rounded-[28px] p-8 sm:p-10 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
          {/* Brand header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#DFBE76] via-[#C5A059] to-[#9E7B36] p-[1px] mb-4 shadow-[0_8px_20px_rgba(197,160,89,0.25)]">
              <div className="w-full h-full bg-[#1C1917] rounded-[15px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#DFBE76]" />
              </div>
            </div>
            
            <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#C5A059] mb-1">
              Haute Couture Atelier
            </p>
            <h1 className="text-3xl font-serif font-medium tracking-wide text-[#FAF8F5]">
              LUXE <span className="italic text-[#DFBE76]">DRAPE</span>
            </h1>
            <p className="text-sm text-[#A8A196] mt-2 font-light">
              Executive Administration & Catalog Operations
            </p>
          </div>

          {/* Quick-fill helper chips for convenience */}
          <div className="mb-6 p-3 rounded-2xl bg-[#25211D] border border-[#3A342E] flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-[#A8A196]">
              <span className="flex items-center gap-1.5 font-medium text-[#D8D0C3]">
                <KeyRound className="w-3.5 h-3.5 text-[#C5A059]" /> Quick Fill Demo Role:
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => quickFill('master_admin', 'Admin@1234')}
                className="px-2.5 py-1.5 rounded-xl bg-[#1C1917] hover:bg-[#2F2924] border border-[#423B33] text-left transition-all group"
              >
                <div className="text-[11px] font-semibold text-[#DFBE76] group-hover:text-white">Master Admin</div>
                <div className="text-[10px] text-[#7A7369]">Full Access CRUD</div>
              </button>
              <button
                type="button"
                onClick={() => quickFill('secondary_admin', 'Admin@5678')}
                className="px-2.5 py-1.5 rounded-xl bg-[#1C1917] hover:bg-[#2F2924] border border-[#423B33] text-left transition-all group"
              >
                <div className="text-[11px] font-semibold text-[#D8D0C3] group-hover:text-white">Secondary Admin</div>
                <div className="text-[10px] text-[#7A7369]">Read & Delete</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#D8D0C3] mb-2">
                Administrator Identifier
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E867B]" />
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="e.g. master_admin"
                  autoComplete="username"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#25211D] border border-[#3A342E] focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all text-[#FAF8F5] placeholder-[#6E675E] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#D8D0C3] mb-2">
                Passphrase
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E867B]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter secure password"
                  autoComplete="current-password"
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-[#25211D] border border-[#3A342E] focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all text-[#FAF8F5] placeholder-[#6E675E] text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E867B] hover:text-[#D8D0C3] transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.985 }}
              whileHover={{ scale: 1.01 }}
              className="w-full relative group overflow-hidden rounded-xl font-medium py-3.5 px-4 text-[#1C1917] bg-gradient-to-r from-[#DFBE76] via-[#C5A059] to-[#B38C44] shadow-[0_4px_20px_rgba(197,160,89,0.3)] transition-all duration-300 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-[#1C1917]/30 border-t-[#1C1917] rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                  <span className="font-semibold text-sm">Authenticating Session...</span>
                </>
              ) : (
                <>
                  <span className="font-semibold text-sm tracking-wide">Enter Admin Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-5 border-t border-[#2F2924] flex items-center justify-between text-[11px] text-[#7A7369]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" /> TLS Encrypted & HTTP-only Cookie
            </span>
            <a href="/" className="hover:text-[#DFBE76] transition-colors">
              Storefront &rarr;
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
