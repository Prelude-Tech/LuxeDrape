import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, PlusCircle, Package, LogOut, Sparkles,
  Upload, X, Edit2, Trash2, BarChart3, Eye, ShieldCheck, Tag,
  CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import api from '../../lib/api'
import { notifyCatalogUpdated } from '../../lib/broadcast'

const CATEGORIES = ['Men', 'Women', 'Kids', 'Unisex']
const SUB_CATEGORIES = ['Shirt','Pant','Jacket','Dress','Skirt','Shorts','Hoodie','Blazer','Kurta','Saree','Lehenga','T-Shirt','Jeans','Suit','Leggings','Sweatshirt']
const SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'Free Size']
const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)

const EMPTY_FORM = {
  product_name: '', description: '', category: 'Women', sub_category: 'Dress',
  price: '', sizes_available: ['M', 'L'], fabric: 'Pure Raw Silk', product_number: '', is_active: true,
}

function StatCard({ label, value, icon: Icon, accent = 'gold', subtext }) {
  const accentStyles = {
    gold: 'bg-[#C5A059]/15 text-[#DFBE76] border-[#C5A059]/30',
    dark: 'bg-[#1C1917] text-[#DFBE76] border-[#3A342E]',
    emerald: 'bg-[#1E6744]/15 text-[#2E8B57] border-[#1E6744]/30',
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#EBE5DC] shadow-[0_4px_20px_rgba(28,25,23,0.03)] flex items-center justify-between">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8E867B] mb-1">{label}</p>
        <p className="text-3xl font-serif font-bold text-[#1C1917]">{value ?? '—'}</p>
        {subtext && <p className="text-xs text-[#736B61] mt-1 font-light">{subtext}</p>}
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${accentStyles[accent] || accentStyles.gold}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  )
}

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

function EditModal({ product, onClose, onSaved }) {
  const [form, setForm] = useState({
    product_name: product.product_name,
    description: product.description,
    category: product.category,
    sub_category: product.sub_category,
    price: product.price,
    sizes_available: product.sizes_available || [],
    fabric: product.fabric,
    is_active: product.is_active,
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(product.image_path)
  const [saving, setSaving] = useState(false)

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const toggleSize = (size) => {
    setForm(f => ({
      ...f,
      sizes_available: f.sizes_available.includes(size)
        ? f.sizes_available.filter(s => s !== size)
        : [...f.sizes_available, size]
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'sizes_available') fd.append(k, JSON.stringify(v))
        else fd.append(k, v)
      })
      if (imageFile) fd.append('image', imageFile)
      await api.put(`/products/${product._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Silhouette updated in catalog!')
      notifyCatalogUpdated('product_updated', { id: product._id })
      onSaved()
      onClose()
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.map(e => e.message).join(', ') || 'Update failed'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-[#141210]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl p-8 w-full max-w-lg border border-[#E8E2D8] shadow-2xl my-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE3D6] mb-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-[#C5A059] block">
              Atelier Product Editing
            </span>
            <h3 className="text-2xl font-serif font-semibold text-[#1C1917]">
              {product.product_name}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-[#8E867B] hover:text-[#1C1917] hover:bg-[#FAF8F5]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          {imagePreview && (
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-[#E5DFD4] bg-[#F7F4EE]">
              <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
            </div>
          )}

          <label className="block">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#57524A] mb-1.5 block">
              Replace Garment Visual
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="block w-full text-xs text-[#736B61] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:uppercase file:tracking-wider file:bg-[#1C1917] file:text-[#DFBE76] hover:file:opacity-90"
            />
          </label>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#57524A] mb-1">
              Garment Title
            </label>
            <input
              type="text"
              value={form.product_name}
              onChange={e => setForm(f => ({ ...f, product_name: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C7] text-sm focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#57524A] mb-1">
                Valuation (₹)
              </label>
              <input
                type="number"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C7] text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#57524A] mb-1">
                Fabric Spec
              </label>
              <input
                type="text"
                value={form.fabric}
                onChange={e => setForm(f => ({ ...f, fabric: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C7] text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#57524A] mb-1">
              Atelier Narrative
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C7] text-sm focus:outline-none focus:border-[#C5A059] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#57524A] mb-1">
                Category
              </label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C7] text-xs font-semibold focus:outline-none focus:border-[#C5A059]"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#57524A] mb-1">
                Silhouette
              </label>
              <select
                value={form.sub_category}
                onChange={e => setForm(f => ({ ...f, sub_category: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C7] text-xs font-semibold focus:outline-none focus:border-[#C5A059]"
              >
                {SUB_CATEGORIES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#57524A] mb-2">
              Size Matrix
            </label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    form.sizes_available.includes(size)
                      ? 'bg-[#1C1917] text-[#DFBE76]'
                      : 'border border-[#DDD5C7] text-[#736B61] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t border-[#EAE3D6]">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#DDD5C7] text-xs uppercase tracking-wider font-semibold text-[#57524A] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#1C1917] hover:bg-[#2A241F] text-[#DFBE76] text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {saving ? 'Updating...' : 'Commit Changes'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function MasterDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('add')
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState(null)
  const [productsLoading, setProductsLoading] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const fileInputRef = useRef()

  const fetchProducts = async () => {
    setProductsLoading(true)
    try {
      const res = await api.get('/products', { params: { limit: 100 } })
      setProducts(res.data.data || [])
    } catch { /* silent */ } finally { setProductsLoading(false) }
  }

  const fetchStats = async () => {
    try {
      const res = await api.get('/products/stats')
      setStats(res.data.data)
    } catch { /* silent */ }
  }

  useEffect(() => { fetchProducts(); fetchStats() }, [])

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  const toggleSize = (size) => {
    setForm(f => ({
      ...f,
      sizes_available: f.sizes_available.includes(size)
        ? f.sizes_available.filter(s => s !== size)
        : [...f.sizes_available, size]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!imageFile) { toast.error('Please upload an authentic product photo'); return }
    setSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'sizes_available') fd.append(k, JSON.stringify(v))
        else fd.append(k, String(v))
      })
      fd.append('image', imageFile)
      await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Garment registered to Luxe Drape Catalog!')
      notifyCatalogUpdated('product_created')
      setForm(EMPTY_FORM)
      setImageFile(null)
      setImagePreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      fetchProducts()
      fetchStats()
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.map(e => e.message).join(', ') || 'Failed to add garment'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

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
    { key: 'add', label: 'Add Silhouette', icon: PlusCircle },
    { key: 'products', label: 'Atelier Roster', icon: Package },
    { key: 'stats', label: 'Analytics & Stats', icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex">
      {/* Atelier Sidebar */}
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
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#C5A059]">Active Session</p>
            <p className="font-semibold text-sm text-[#FAF8F5] truncate">{user?.username}</p>
            <div className="inline-flex items-center gap-1.5 mt-1.5 px-2 py-0.5 rounded-full bg-[#DFBE76]/15 border border-[#DFBE76]/30 text-[#DFBE76] text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" /> Master Admin
            </div>
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
          {/* TAB 1: ADD PRODUCT */}
          {activeTab === 'add' && (
            <motion.div key="add" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="mb-8 pb-4 border-b border-[#EAE3D6] flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase font-bold tracking-[0.24em] text-[#C5A059] mb-1">
                    Catalog Registration
                  </p>
                  <h1 className="text-3xl font-serif font-medium text-[#1C1917]">
                    Register New Atelier Silhouette
                  </h1>
                </div>
                <span className="text-xs text-[#8E867B] font-mono bg-white px-3 py-1.5 rounded-full border border-[#DDD5C7]">
                  Master Admin Clearance
                </span>
              </div>

              <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8E2D8] shadow-[0_4px_24px_rgba(28,25,23,0.03)] max-w-3xl space-y-6">
                {/* Image upload zone */}
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#57524A] mb-2.5">
                    High-Resolution Garment Photography *
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#DDD5C7] rounded-3xl p-8 text-center cursor-pointer hover:border-[#C5A059] hover:bg-[#FAF8F5] transition-all group bg-[#FCFBF9]"
                  >
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img src={imagePreview} alt="preview" className="w-40 h-52 object-cover rounded-2xl mx-auto shadow-md" />
                        <span className="text-xs text-[#C5A059] block mt-2 font-medium">Click to choose another photo</span>
                      </div>
                    ) : (
                      <div className="text-[#8E867B] group-hover:text-[#57524A] transition-colors py-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#F4EFEA] border border-[#E2DBD0] flex items-center justify-center mx-auto mb-3 text-[#C5A059]">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="font-serif text-lg text-[#1C1917]">Select garment image from device</p>
                        <p className="text-xs text-[#8E867B] mt-1 font-mono">Accepts JPG, PNG, WEBP (Max 5MB)</p>
                      </div>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => { setImagePreview(null); setImageFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                      className="mt-2 text-xs text-[#DC2626] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Remove current selection
                    </button>
                  )}
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { label: 'Garment Name *', key: 'product_name', type: 'text', placeholder: 'e.g. Raw Mulberry Silk Anarkali' },
                    { label: 'Product SKU (Optional)', key: 'product_number', type: 'text', placeholder: 'Auto-indexed if left empty' },
                    { label: 'Atelier Price (₹) *', key: 'price', type: 'number', placeholder: '14999' },
                    { label: 'Fabric / Weave *', key: 'fabric', type: 'text', placeholder: 'e.g. 100% Banarasi Silk' },
                  ].map(({ label, key, type, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs uppercase font-bold tracking-wider text-[#57524A] mb-1.5">
                        {label}
                      </label>
                      <input
                        type={type}
                        value={form[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        required={label.includes('*')}
                        min={type === 'number' ? 0 : undefined}
                        className="w-full px-4 py-3 rounded-xl border border-[#DDD5C7] text-sm focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/15 transition-all text-[#1C1917] bg-[#FAF8F5]"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#57524A] mb-1.5">
                    Atelier Narrative & Specifications *
                  </label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3}
                    placeholder="Provide details on styling, drape, occasion and maintenance..."
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#DDD5C7] text-sm focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/15 transition-all text-[#1C1917] bg-[#FAF8F5] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase font-bold tracking-wider text-[#57524A] mb-1.5">
                      Target Collection *
                    </label>
                    <select
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-[#DDD5C7] text-xs font-semibold focus:outline-none focus:border-[#C5A059] bg-[#FAF8F5]"
                    >
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold tracking-wider text-[#57524A] mb-1.5">
                      Garment Silhouette *
                    </label>
                    <select
                      value={form.sub_category}
                      onChange={e => setForm(f => ({ ...f, sub_category: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-[#DDD5C7] text-xs font-semibold focus:outline-none focus:border-[#C5A059] bg-[#FAF8F5]"
                    >
                      {SUB_CATEGORIES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#57524A] mb-2.5">
                    Available Sizes in Atelier Inventory
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          form.sizes_available.includes(size)
                            ? 'bg-[#1C1917] text-[#DFBE76] shadow-2xs'
                            : 'border border-[#DDD5C7] bg-[#FAF8F5] text-[#736B61] hover:border-[#1C1917]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#1C1917] hover:bg-[#2A241F] text-[#DFBE76] font-semibold py-4 rounded-2xl transition-all shadow-[0_4px_20px_rgba(28,25,23,0.15)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs uppercase tracking-wider"
                >
                  {submitting ? (
                    <>
                      <motion.div className="w-4 h-4 border-2 border-[#DFBE76]/30 border-t-[#DFBE76] rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                      <span>Transmitting to Database...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Commit Silhouette to Catalog</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* TAB 2: ALL PRODUCTS ROSTER */}
          {activeTab === 'products' && (
            <motion.div key="products" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EAE3D6]">
                <div>
                  <p className="text-xs uppercase font-bold tracking-[0.24em] text-[#C5A059] mb-1">
                    Inventory Overview
                  </p>
                  <h1 className="text-3xl font-serif font-medium text-[#1C1917]">
                    Atelier Master Roster ({products.length})
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

              {productsLoading ? (
                <div className="flex items-center justify-center py-24">
                  <motion.div className="w-8 h-8 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-[0_4px_24px_rgba(28,25,23,0.03)] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#F0EAE1] bg-[#FCFBF9]">
                          {['Silhouette', 'Title & SKU', 'Category', 'Price', 'Sizes', 'Status', 'Actions'].map(h => (
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
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setEditTarget(product)}
                                  className="p-2 hover:bg-[#FAF8F5] rounded-xl text-[#57524A] hover:text-[#C5A059] transition-colors cursor-pointer"
                                  title="Edit Garment"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteTarget(product)}
                                  className="p-2 hover:bg-red-50 rounded-xl text-[#DC2626] transition-colors cursor-pointer"
                                  title="Delete Garment"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                    {products.length === 0 && (
                      <div className="text-center py-20 text-[#8E867B]">
                        <Package className="w-12 h-12 mx-auto mb-3 opacity-40 text-[#C5A059]" />
                        <p className="font-serif text-lg">No garments indexed in database yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: STATS */}
          {activeTab === 'stats' && (
            <motion.div key="stats" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="mb-8 pb-4 border-b border-[#EAE3D6]">
                <p className="text-xs uppercase font-bold tracking-[0.24em] text-[#C5A059] mb-1">
                  Atelier Metrics
                </p>
                <h1 className="text-3xl font-serif font-medium text-[#1C1917]">
                  Executive Analytics & Performance
                </h1>
              </div>

              {stats ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <StatCard label="Total Silhouettes" value={stats.summary.total} icon={Package} accent="dark" subtext="All indexed pieces" />
                    <StatCard label="Active Catalog" value={stats.summary.active} icon={CheckCircle2} accent="emerald" subtext="Currently displayed" />
                    <StatCard label="Archived / Inactive" value={stats.summary.inactive} icon={AlertCircle} accent="gold" subtext="Hidden items" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* By Category */}
                    <div className="bg-white rounded-3xl p-8 border border-[#E8E2D8] shadow-[0_4px_24px_rgba(28,25,23,0.03)]">
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
                                className="bg-gradient-to-r from-[#DFBE76] to-[#C5A059] h-full rounded-full transition-all duration-500"
                                style={{ width: `${(cat.count / (stats.summary.total || 1)) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Items */}
                    <div className="bg-white rounded-3xl p-8 border border-[#E8E2D8] shadow-[0_4px_24px_rgba(28,25,23,0.03)]">
                      <h2 className="font-serif font-semibold text-xl text-[#1C1917] mb-6">
                        Recently Registered Silhouettes
                      </h2>
                      <div className="space-y-3">
                        {stats.recentProducts.map(p => (
                          <div key={p._id} className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-[#FAF8F5] transition-colors">
                            <div className="w-11 h-13 rounded-xl overflow-hidden bg-[#F7F4EE] border border-[#E2DBD0] flex-shrink-0">
                              {p.image_path ? (
                                <img src={p.image_path} alt={p.product_name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-[#8E867B]">Luxe</div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-serif font-medium text-[#1C1917] text-sm truncate">{p.product_name}</p>
                              <p className="text-xs text-[#8E867B]">{p.category} &bull; <span className="font-mono text-[#C5A059]">{formatPrice(p.price)}</span></p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-24">
                  <motion.div className="w-8 h-8 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Confirmation & Edit Modals */}
      {deleteTarget && (
        <ConfirmModal
          message={`Are you certain you wish to archive "${deleteTarget.product_name}"? It will be removed from customer view.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {editTarget && (
        <EditModal product={editTarget} onClose={() => setEditTarget(null)} onSaved={fetchProducts} />
      )}
    </div>
  )
}
