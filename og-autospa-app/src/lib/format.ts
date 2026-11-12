import { SIZE_TITLES } from '../data/config'
import type { Vehicle, VehicleSize } from '../types'

export function money(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export function moneyFromCents(cents: number): string {
  return money(cents / 100)
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function vehicleLabel(vehicle: Vehicle): string {
  return `${vehicle.year} ${vehicle.make} ${vehicle.model}`
}

export function sizeLabel(size: VehicleSize): string {
  return SIZE_TITLES[size]
}
