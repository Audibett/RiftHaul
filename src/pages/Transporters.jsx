import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Star, MapPin, Package, Truck, Filter, CheckCircle } from 'lucide-react'
import { transporters } from '../data/mockData'

const cargoTypes = ['All', 'General', 'Agricultural', 'Electronics', 'Furniture', 'Building Materials', 'Perishables', 'Heavy Machinery']
const capacities = ['All', '1-2 tonnes', '3-5 tonnes', '10+ tonnes']

function matchesCapacity(transporter, filter) {
  const cap = parseInt(transporter.capacity)
  if (filter === 'All') return true
  if (filter === '1-2 tonnes') return cap <= 2
  if (filter === '3-5 tonnes') return cap >= 3 && cap <= 5
  if (filter === '10+ tonnes') return cap >= 10
  return true
}

function TransporterCard({ t }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-brand-dark to-gray-800 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-brand-orange flex items-center justify-center text-white font-extrabold text-lg">
            {t.name.charAt(0)}
          </div>
          <div>
            <p className="text-white font-bold text-sm">{t.name}</p>
            <p className="text-gray-400 text-xs flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {t.location}
            </p>
          </div>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          t.available ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
        }`}>
          {t.available ? 'Available' : 'Busy'}
        </span>
      </div>

      {/* Card Body */}
      <div className="px-5 py-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Truck className="w-4 h-4 text-brand-orange shrink-0" />
          <span className="font-medium">{t.truck}</span>
          <span className="text-gray-400">·</span>
          <span>{t.capacity}</span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-yellow-500 font-semibold">
            <Star className="w-4 h-4 fill-yellow-400" />
            {t.rating}
          </div>
          <span className="text-gray-400 text-xs">{t.trips} trips completed</span>
        </div>

        <div className="flex items-center justify-between bg-orange-50 rounded-lg px-3 py-2">
          <span className="text-xs text-gray-500">Rate per km</span>
          <span className="text-brand-orange font-extrabold text-sm">
            KES {t.pricePerKm}/km
          </span>
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-1.5 flex items-center gap-1">
            <Package className="w-3 h-3" /> Handles
          </p>
          <div className="flex flex-wrap gap-1.5">
            {t.cargoTypes.map((type) => (
              <span key={type} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 pb-5">
        {t.available ? (
          <Link
            to={`/book/${t.id}`}
            className="block w-full text-center bg-brand-orange hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm transition"
          >
            Book Now
          </Link>
        ) : (
          <button
            disabled
            className="block w-full text-center bg-gray-100 text-gray-400 font-bold py-2.5 rounded-xl text-sm cursor-not-allowed"
          >
            Currently Unavailable
          </button>
        )}
      </div>
    </div>
  )
}

export default function Transporters() {
  const [search, setSearch] = useState('')
  const [cargoFilter, setCargoFilter] = useState('All')
  const [capacityFilter, setCapacityFilter] = useState('All')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const filtered = transporters.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.truck.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase())

    const matchesCargo =
      cargoFilter === 'All' || t.cargoTypes.includes(cargoFilter)

    const matchesCap = matchesCapacity(t, capacityFilter)

    const matchesAvail = !availableOnly || t.available

    return matchesSearch && matchesCargo && matchesCap && matchesAvail
  })

  const activeFilterCount = [
    cargoFilter !== 'All',
    capacityFilter !== 'All',
    availableOnly,
  ].filter(Boolean).length

  function clearFilters() {
    setCargoFilter('All')
    setCapacityFilter('All')
    setAvailableOnly(false)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-brand-dark">Find a Transporter</h1>
        <p className="text-gray-500 mt-1">
          {filtered.length} transporter{filtered.length !== 1 ? 's' : ''} available near Eldoret
        </p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, truck, or location..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition bg-white"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition ${
            showFilters || activeFilterCount > 0
              ? 'bg-brand-dark text-white border-brand-dark'
              : 'bg-white text-gray-700 border-gray-200 hover:border-brand-dark'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-brand-orange text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mb-6 space-y-5">

          {/* Cargo type */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Cargo Type</p>
            <div className="flex flex-wrap gap-2">
              {cargoTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setCargoFilter(type)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    cargoFilter === type
                      ? 'bg-brand-orange text-white border-brand-orange'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-brand-orange'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Capacity */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Truck Capacity</p>
            <div className="flex flex-wrap gap-2">
              {capacities.map((cap) => (
                <button
                  key={cap}
                  onClick={() => setCapacityFilter(cap)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    capacityFilter === cap
                      ? 'bg-brand-dark text-white border-brand-dark'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-brand-dark'
                  }`}
                >
                  {cap}
                </button>
              ))}
            </div>
          </div>

          {/* Available only toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700">Available Now Only</p>
              <p className="text-xs text-gray-400">Hide transporters marked as busy</p>
            </div>
            <button
              onClick={() => setAvailableOnly(!availableOnly)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                availableOnly ? 'bg-brand-orange' : 'bg-gray-200'
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                availableOnly ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-500 hover:underline font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Results Grid */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t) => (
            <TransporterCard key={t.id} t={t} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <Truck className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold text-gray-500">No transporters match your filters</p>
          <p className="text-sm mt-1">Try adjusting your search or clearing filters</p>
          <button
            onClick={clearFilters}
            className="mt-4 text-brand-orange hover:underline text-sm font-medium"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}