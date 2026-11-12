import { useMemo, useState, type FormEvent } from 'react'
import { BOOKING_TIME_SLOTS, SERVICES, TIP_PRESETS_CENTS } from '../data/config'
import { useAppStore } from '../data/store'
import { money, moneyFromCents } from '../lib/format'
import type { ServiceId } from '../types'

interface BookingPanelProps {
  initialServiceId?: ServiceId
  onBooked?: () => void
}

export function BookingPanel({ initialServiceId = 'exterior', onBooked }: BookingPanelProps) {
  const { state, bookService } = useAppStore()
  const [serviceId, setServiceId] = useState<ServiceId>(initialServiceId)
  const [vehicleId, setVehicleId] = useState(state.customer.vehicles[0]?.id ?? '')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [time, setTime] = useState<string>(BOOKING_TIME_SLOTS[2])
  const [notes, setNotes] = useState('')
  const [tipCents, setTipCents] = useState(0)
  const [status, setStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const service = useMemo(() => SERVICES.find((s) => s.id === serviceId), [serviceId])
  const vehicle = state.customer.vehicles.find((v) => v.id === vehicleId)
  const price = service && vehicle ? service.prices[vehicle.size] : 0

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setStatus(null)
    try {
      const job = await bookService({ serviceId, vehicleId, date, time, notes, tipCents })
      setStatus(`Booked ${service?.name} for ${date} at ${time}. (+points stub)`)
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
      <label>
        Vehicle
        <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
          {state.customer.vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.year} {v.make} {v.model}
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
      </p>
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? 'Booking…' : 'Book now'}
      </button>
      {status && <p className="form-status">{status}</p>}
    </form>
  )
}
