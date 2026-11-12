import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { BOOKING_TIME_SLOTS, SERVICES, SIZE_TITLES, TIP_PRESETS_CENTS } from '../data/config'
import { useAppStore } from '../data/store'
import { money, moneyFromCents } from '../lib/format'
import type { ServiceId, VehicleSize } from '../types'

const CONDITION_COPY =
  'Price is subject to change depending on the condition of the vehicle, because photos were not submitted for a better quote.'

const MAX_VEHICLE_YEAR = new Date().getFullYear() + 1

interface BookingPanelProps {
  initialServiceId?: ServiceId
  onBooked?: () => void
}

interface VehiclePhoto {
  id: string
  name: string
  url: string
}

export function BookingPanel({ initialServiceId = 'exterior', onBooked }: BookingPanelProps) {
  const { bookService } = useAppStore()
  const [serviceId, setServiceId] = useState<ServiceId>(initialServiceId)
  const [year, setYear] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [size, setSize] = useState<VehicleSize>('sedan')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [time, setTime] = useState<string>(BOOKING_TIME_SLOTS[2])
  const [notes, setNotes] = useState('')
  const [tipCents, setTipCents] = useState(0)
  const [photos, setPhotos] = useState<VehiclePhoto[]>([])
  const [conditionAck, setConditionAck] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const photosRef = useRef(photos)

  useEffect(() => {
    photosRef.current = photos
  }, [photos])

  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url))
    }
  }, [])

  const service = useMemo(() => SERVICES.find((s) => s.id === serviceId), [serviceId])
  const price = service ? service.prices[size] : 0
  const hasPhotos = photos.length > 0
  const needsConditionAck = !hasPhotos && !conditionAck
  const vehicleReady = year.trim().length === 4 && make.trim().length > 0 && model.trim().length > 0
  const maxYear = MAX_VEHICLE_YEAR

  function onPhotosSelected(e: ChangeEvent<HTMLInputElement>) {
    const files = [...(e.target.files ?? [])]
    if (!files.length) return
    setPhotos((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        url: URL.createObjectURL(file),
      })),
    ])
    setConditionAck(false)
    e.target.value = ''
  }

  function removePhoto(id: string) {
    setPhotos((prev) => {
      const photo = prev.find((item) => item.id === id)
      if (photo) URL.revokeObjectURL(photo.url)
      return prev.filter((item) => item.id !== id)
    })
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!vehicleReady || needsConditionAck) {
      setStatus(
        needsConditionAck
          ? 'Add vehicle photos, or confirm that the price can change without them.'
          : 'Enter the vehicle year, make, and model.',
      )
      return
    }
    const yearNumber = Number(year)
    if (!Number.isInteger(yearNumber) || yearNumber < 1980 || yearNumber > maxYear) {
      setStatus(`Enter a vehicle year between 1980 and ${maxYear}.`)
      return
    }

    setBusy(true)
    setStatus(null)
    try {
      const job = await bookService({
        serviceId,
        year: yearNumber,
        make,
        model,
        size,
        date,
        time,
        notes,
        tipCents,
        photoNames: photos.map((photo) => photo.name),
        priceSubjectToCondition: !hasPhotos,
      })
      const vehicleLabel = `${yearNumber} ${make.trim()} ${model.trim()}`
      const photoNote = hasPhotos
        ? ` ${photos.length} photo${photos.length === 1 ? '' : 's'} attached.`
        : ` ${CONDITION_COPY}`
      setStatus(`Booked ${service?.name} for the ${vehicleLabel} on ${date} at ${time}.${photoNote}`)
      requestAnimationFrame(() => {
        document.getElementById('booking-status')?.scrollIntoView({ block: 'center' })
      })
      onBooked?.()
      return job
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Booking failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="booking-panel" onSubmit={onSubmit}>
      {status && (
        <p
          id="booking-status"
          role="status"
          className={`book-toast${status.startsWith('Booked') ? '' : ' form-status--warn'}`}
        >
          {status}
        </p>
      )}
      <label>
        Service
        <select value={serviceId} onChange={(e) => setServiceId(e.target.value as ServiceId)}>
          {SERVICES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>
      <div className="booking-panel__vehicle">
        <label>
          Year
          <input
            type="number"
            inputMode="numeric"
            name="year"
            min={1980}
            max={maxYear}
            required
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="2021"
          />
        </label>
        <label>
          Make
          <input
            name="make"
            required
            value={make}
            onChange={(e) => setMake(e.target.value)}
            placeholder="Honda"
            autoComplete="off"
          />
        </label>
        <label>
          Model
          <input
            name="model"
            required
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Civic"
            autoComplete="off"
          />
        </label>
      </div>
      <label>
        Vehicle size
        <select value={size} onChange={(e) => setSize(e.target.value as VehicleSize)}>
          {(Object.keys(SIZE_TITLES) as VehicleSize[]).map((key) => (
            <option key={key} value={key}>
              {SIZE_TITLES[key]}
            </option>
          ))}
        </select>
      </label>
      <div className="booking-panel__row">
        <label>
          Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <label>
          Time
          <select value={time} onChange={(e) => setTime(e.target.value)}>
            {BOOKING_TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Notes
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Gate code, parking notes…" />
      </label>
      <fieldset className="photo-field">
        <legend>Vehicle photos <span className="muted">(optional)</span></legend>
        <p className="note">Add pictures of the vehicle you want done so we can quote its condition.</p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onPhotosSelected}
          aria-label="Upload vehicle photos"
        />
        {hasPhotos && (
          <div className="photo-picks">
            {photos.map((photo) => (
              <figure key={photo.id}>
                <img src={photo.url} alt={photo.name} />
                <button type="button" onClick={() => removePhoto(photo.id)}>
                  Remove
                </button>
              </figure>
            ))}
          </div>
        )}
      </fieldset>
      {!hasPhotos && (
        <button
          type="button"
          className={`btn btn-condition${conditionAck ? ' is-selected' : ''}`}
          aria-pressed={conditionAck}
          onClick={() => setConditionAck((ack) => !ack)}
        >
          {CONDITION_COPY}
        </button>
      )}
      <fieldset className="tip-field">
        <legend>Optional tip</legend>
        <div className="tip-field__row">
          {TIP_PRESETS_CENTS.map((cents) => (
            <button
              key={cents}
              type="button"
              className={`btn btn-chip${tipCents === cents ? ' is-selected' : ''}`}
              onClick={() => setTipCents(cents)}
            >
              {cents === 0 ? 'No tip' : moneyFromCents(cents)}
            </button>
          ))}
        </div>
      </fieldset>
      <p className="booking-panel__total">
        Starting at <strong>{money(price)}</strong>
        {tipCents > 0 ? ` + ${moneyFromCents(tipCents)} tip` : ''}
        {!hasPhotos ? ' · subject to vehicle condition' : ''}
      </p>
      <button type="submit" className="btn btn-primary" disabled={busy || needsConditionAck || !vehicleReady}>
        {busy ? 'Booking…' : 'Book now'}
      </button>
    </form>
  )
}
