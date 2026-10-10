
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

const defaults = {
  title: '',
  description: '',
  price: 0,
  category: 'other',
  condition: 'used',
  status: 'active',
}

export default function ListingForm() {
  const nav = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(defaults)
  const [error, setError] = useState('')

  // Load the listing when editing.
  useEffect(() => {
    if (!id) return

    async function loadListing() {
      try {
        const res = await api.get(`/listings/${id}`)
        const listing = res.data.listing ?? res.data.data ?? res.data

        setForm({
          title: listing.title ?? '',
          description: listing.description ?? '',
          price: Number(listing.price ?? 0),
          category: listing.category ?? 'other',
          condition: listing.condition ?? 'used',
          status: listing.status ?? 'active',
        })
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load listing'
        )
      }
    }

    loadListing()
  }, [id])

  // Update form fields. Price must be a number.
  function onChange(e) {
    const { name, value, type } = e.target

    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }))
  }

  // Create or update the listing.
  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      if (id) {
        await api.patch(`/listings/${id}`, form)
      } else {
        await api.post('/listings', form)
      }

      nav('/listings')
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to save listing'
      )
    }
  }

  return (
    <div className="max-w-lg mx-auto card">
      <h1 className="text-xl font-semibold mb-4">
        {id ? 'Edit' : 'New'} Listing
      </h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={onChange}
            className="input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            name="price"
            min="0"
            step="any"
            value={form.price}
            onChange={onChange}
            className="input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={onChange}
            className="input"
            required
          >
            <option value="textbooks">Textbooks</option>
            <option value="electronics">Electronics</option>
            <option value="furniture">Furniture</option>
            <option value="clothing">Clothing</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Condition</label>
          <select
            name="condition"
            value={form.condition}
            onChange={onChange}
            className="input"
            required
          >
            <option value="new">New</option>
            <option value="like-new">Like-new</option>
            <option value="used">Used</option>
            <option value="worn">Worn</option>
          </select>
        </div>

        {id && (
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={onChange}
              className="input"
              required
            >
              <option value="active">Active</option>
              <option value="sold">Sold</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">
            Description (optional)
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows={4}
            className="input"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <button className="btn" type="submit">
          Save
        </button>
      </form>
    </div>
  )
}
