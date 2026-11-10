import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, LogOut, Sparkles, Trash2, Eye, ShieldAlert, BarChart3, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import api from '../../lib/api'
import { notifyCatalogUpdated } from '../../lib/broadcast'

const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-[#141210]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl p-8 max-w-sm w-full border border-[#E8E2D8] shadow-2xl"
      >
        <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mb-4 text-red-600">
          <Trash2 className="w-6 h-6" />
        </div>
        <h3 className="font-serif font-semibold text-xl text-[#1C1917] mb-2">Confirm Archival</h3>
        <p className="text-[#736B61] text-xs leading-relaxed mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#DDD5C7] text-xs uppercase tracking-wider font-semibold text-[#57524A] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer shadow-sm"
          >
            Delete Item
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function SecondaryDashboard() {
  const { user, logout } = useAuth()
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('products')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await api.get('/products', { params: { limit: 100 } })
      setProducts(res.data.data || [])
    } catch { /* silent */ } finally { setLoading(false) }
  }

  const fetchStats = async () => {
    try {
      const res = await api.get('/products/stats')
      setStats(res.data.data)
    } catch { /* silent */ }
  }

  useEffect(() => { fetchProducts(); fetchStats() }, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await api.delete(`/products/${deleteTarget._id}`)
      toast.success('Garment removed from catalog')
      notifyCatalogUpdated('product_deleted', { id: deleteTarget._id })
      setDeleteTarget(null)
      fetchProducts()
      fetchStats()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    }
  }

  const NAV = [
    { key: 'products', label: 'Catalog Roster', icon: Package },
    { key: 'stats', label: 'Inventory Metrics', icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#141210] text-[#FAF8F5] flex flex-col min-h-screen fixed left-0 top-0 bottom-0 z-30 border-r border-[#26211C]">
        <div className="p-6 border-b border-[#26211C]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#DFBE76] via-[#C5A059] to-[#9E7B36] p-[1px]">
              <div className="w-full h-full bg-[#1C1917] rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#DFBE76]" />
              </div>
            </div>
            <div>
              <span className="font-serif font-semibold text-lg tracking-wider block leading-tight">
                LUXE <span className="italic font-normal text-[#C5A059]">DRAPE</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.24em] text-[#8E867B] block font-medium">
                Admin Console
              </span>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-2xl bg-[#1C1917] border border-[#2F2923]">
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#A8A196]">Logged In Operator</p>
            <p className="font-semibold text-sm text-[#FAF8F5] truncate">{user?.username}</p>
            <div className="inline-flex items-center gap-1.5 mt-1.5 px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[10px] font-bold uppercase tracking-wider">
              Secondary Admin
            </div>
          </div>

          <div className="mt-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl p-3 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-200/90 leading-tight">
              Scope: Read and Delete only. Creation &amp; modifications restricted to Master.
            </p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          {NAV.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === key
                  ? 'bg-gradient-to-r from-[#DFBE76] via-[#C5A059] to-[#9E7B36] text-[#1C1917] font-bold shadow-[0_4px_16px_rgba(197,160,89,0.25)]'
                  : 'text-[#A8A196] hover:bg-[#1C1917] hover:text-[#FAF8F5]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}

          <div className="pt-4 border-t border-[#26211C] mt-6">
            <Link
              to="/"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider text-[#A8A196] hover:bg-[#1C1917] hover:text-[#FAF8F5] transition-colors"
            >
              <Eye className="w-4 h-4 text-[#C5A059]" />
              <span>View Storefront</span>
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider text-[#DC2626] hover:bg-[#2A1616] transition-colors mt-1 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 ml-64 p-8 sm:p-10 min-h-screen">
        <AnimatePresence mode="wait">
          {activeTab === 'products' && (
            <motion.div key="products" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EAE3D6]">
                <div>
                  <p className="text-xs uppercase font-bold tracking-[0.24em] text-[#C5A059] mb-1">
                    Catalog Inspection & Maintenance
                  </p>
                  <h1 className="text-3xl font-serif font-medium text-[#1C1917]">
                    Catalog Roster ({products.length})
                  </h1>
                </div>
                <button
                  onClick={fetchProducts}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#DDD5C7] text-xs font-semibold uppercase tracking-wider text-[#1C1917] hover:border-[#C5A059] transition-all shadow-2xs cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Refresh Index</span>
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-24">
                  <motion.div className="w-8 h-8 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-[0_4px_24px_rgba(28,25,23,0.03)] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#F0EAE1] bg-[#FCFBF9]">
                          {['Silhouette', 'Title & SKU', 'Category', 'Price', 'Sizes', 'Status', 'Action'].map(h => (
                            <th key={h} className="text-left text-[11px] font-bold uppercase tracking-wider text-[#8E867B] px-5 py-4">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0EAE1]">
                        {products.map(product => (
                          <motion.tr key={product._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-[#FAF8F5] transition-colors">
                            <td className="px-5 py-4">
                              <div className="w-12 h-14 rounded-xl overflow-hidden bg-[#F7F4EE] border border-[#E5DFD4]">
                                {product.image_path ? (
                                  <img src={product.image_path} alt={product.product_name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xs text-[#8E867B]">N/A</div>
                                )}
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <p className="font-serif font-semibold text-[#1C1917] text-base line-clamp-1">{product.product_name}</p>
                              <p className="text-[10px] text-[#C5A059] font-mono">{product.product_number}</p>
                              <p className="text-xs text-[#8E867B]">{product.sub_category} &bull; {product.fabric}</p>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F4EFEA] border border-[#E5DFD4] text-[#57524A] px-2.5 py-1 rounded-full">
                                {product.category}
                              </span>
                            </td>
                            <td className="px-5 py-4 font-serif font-bold text-base text-[#1C1917]">{formatPrice(product.price)}</td>
                            <td className="px-5 py-4">
                              <div className="flex flex-wrap gap-1 max-w-[140px]">
                                {(product.sizes_available || []).slice(0, 3).map(s => (
                                  <span key={s} className="text-[9px] font-mono border border-[#E0D7C9] bg-[#FAF8F5] px-1.5 py-0.5 rounded text-[#57524A]">{s}</span>
                                ))}
                                {(product.sizes_available || []).length > 3 && (
                                  <span className="text-[9px] text-[#8E867B]">+{product.sizes_available.length - 3}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                product.is_active
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-red-50 text-red-700 border border-red-200'
                              }`}>
                                {product.is_active ? 'Active' : 'Archived'}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <button
                                onClick={() => setDeleteTarget(product)}
                                className="p-2 hover:bg-red-50 rounded-xl text-[#DC2626] transition-colors cursor-pointer"
                                title="Delete Silhouette"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                    {products.length === 0 && (
                      <div className="text-center py-20 text-[#8E867B]">
                        <Package className="w-12 h-12 mx-auto mb-3 opacity-40 text-[#C5A059]" />
                        <p className="font-serif text-lg">No garments indexed in catalog.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div key="stats" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="mb-8 pb-4 border-b border-[#EAE3D6]">
                <p className="text-xs uppercase font-bold tracking-[0.24em] text-[#C5A059] mb-1">
                  Atelier Metrics
                </p>
                <h1 className="text-3xl font-serif font-medium text-[#1C1917]">
                  Inventory Analytics
                </h1>
              </div>

              {stats ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white rounded-3xl p-6 border border-[#EBE5DC] shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#8E867B] mb-1">Total Items</p>
                        <p className="text-3xl font-serif font-bold text-[#1C1917]">{stats.summary.total}</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-[#1C1917] text-[#DFBE76] flex items-center justify-center">
                        <Package className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="bg-white rounded-3xl p-6 border border-[#EBE5DC] shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#8E867B] mb-1">Active Catalog</p>
                        <p className="text-3xl font-serif font-bold text-[#1C1917]">{stats.summary.active}</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="bg-white rounded-3xl p-6 border border-[#EBE5DC] shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#8E867B] mb-1">Archived</p>
                        <p className="text-3xl font-serif font-bold text-[#1C1917]">{stats.summary.inactive}</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-8 border border-[#E8E2D8] shadow-sm">
                    <h2 className="font-serif font-semibold text-xl text-[#1C1917] mb-6">
                      Distribution by Collection
                    </h2>
                    <div className="space-y-4">
                      {stats.byCategory.map(cat => (
                        <div key={cat._id} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#57524A]">
                            <span>{cat._id}</span>
                            <span className="font-mono text-[#1C1917]">{cat.count} items</span>
                          </div>
                          <div className="w-full bg-[#FAF8F5] rounded-full h-2.5 overflow-hidden border border-[#EAE3D6]">
                            <div
                              className="bg-gradient-to-r from-[#DFBE76] to-[#C5A059] h-full rounded-full"
                              style={{ width: `${(cat.count / (stats.summary.total || 1)) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-20">
                  <motion.div className="w-8 h-8 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {deleteTarget && (
        <ConfirmModal
          message={`Are you certain you wish to archive "${deleteTarget.product_name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
