import { useMemo, useState } from 'react'
import { GALLERY_CATEGORIES } from '../data/config'
import { useAppStore } from '../data/store'
import type { GalleryCategory } from '../types'

export function GalleryPage() {
  const { state } = useAppStore()
  const [category, setCategory] = useState<GalleryCategory | 'all'>('all')

  const items = useMemo(() => {
    if (category === 'all') return state.media
    return state.media.filter((m) => m.category === category)
  }, [category, state.media])

  return (
    <div className="page page-gallery">
      <header className="page-hero">
        <p className="eyebrow">Past work</p>
        <h1>Gallery</h1>
        <p className="lead">Washes, interiors, polishes, restorations, and commercial fleets.</p>
      </header>

      <aside className="callout">
        <strong>Instagram videos:</strong> automatic pull isn’t available yet — no Instagram API
        credentials or Graph API access in this environment. Placeholder showcase tiles are local.
        Owner can upload videos/photos manually into <code>public/gallery/</code> later.
      </aside>

      <div className="chip-row" role="tablist" aria-label="Gallery categories">
        <button
          type="button"
          className={`btn btn-chip${category === 'all' ? ' is-selected' : ''}`}
          onClick={() => setCategory('all')}
        >
          All
        </button>
        {GALLERY_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`btn btn-chip${category === cat.id ? ' is-selected' : ''}`}
            onClick={() => setCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="gallery-grid">
        {items.map((item) => (
          <figure key={item.id} className="gallery-card">
            <div className={`gallery-card__media gallery-card__media--${item.kind}`}>
              <span>{item.kind === 'video' ? 'Video' : 'Photo'}</span>
              <strong>{item.category.replace(/_/g, ' ')}</strong>
            </div>
            <figcaption>{item.caption}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
