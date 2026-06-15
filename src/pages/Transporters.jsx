import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Star, MapPin, Package, Truck, SlidersHorizontal, X } from 'lucide-react'
import { transporters } from '../data/mockData'

const cargoTypes = ['General', 'Agricultural', 'Electronics', 'Furniture', 'Building Materials', 'Perishables', 'Heavy Machinery']
const capacities = ['All', '1-2 tonnes', '3-5 tonnes', '10+ tonnes']

function matchesCapacity(t, filter) {
  const cap = parseInt(t.capacity)
  if (filter === 'All') return true
  if (filter === '1-2 tonnes') return cap <= 2
  if (filter === '3-5 tonnes') return cap >= 3 && cap <= 5
  if (filter === '10+ tonnes') return cap >= 10
  return true
}

function TransporterCard({ t }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-br from-brand-dark to-gray-800 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-brand-orange flex items-center justify-center text-white font-extrabold text-lg shrink-0">
            {t.name.charAt(0)}
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">{t.name}</p>
            <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />{t.location}
            </p>
          </div>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
          t.available ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
        }`}>
          {t.available ? '● Available' : '○ Busy'}
        </span>
      </div>

      {/* Body */}
      <div className="px-5 py-4 flex-1 space-y-4">

        {/* Truck */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Truck className="w-4 h-4 text-brand-orange" />
            <span className="font-semibold">{t.truck}</span>
          </div>
          <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">{t.capacity}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${star <= Math.round(t.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
              />
            ))}
            <span className="text-sm font-bold text-gray-700 ml-1">{t.rating}</span>
          </div>
          <span className="text-gray-300">·</span>
          <span className="text-xs text-gray-400">{t.trips} trips</span>
        </div>

        {/* Rate */}
        <div className="flex items-center justify-between bg-orange-50 rounded-xl px-4 py-2.5 border border-orange-100">
          <span className="text-xs text-gray-500">Rate per km</span>
          <span className="text-brand-orange font-extrabold">KES {t.pricePerKm}/km</span>
        </div>

        {/* Cargo tags */}
        <div>
          <p className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
            <Package className="w-3 h-3" /> Handles
          </p>
          <div className="flex flex-wrap gap-1.5">
            {t.cargoTypes.map((type) => (
              <span key={type} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5">
        {t.available ? (
          <Link
            to={`/book/${t.id}`}
            className="block w-full text-center bg-brand-orange hover:bg-orange-500 text-white font-bold py-3 rounded-xl text-sm transition"
          >
            Book Now
          </Link>
        ) : (
          <div className="w-full text-center bg-gray-100 text-gray-400 font-semibold py-3 rounded-xl text-sm cursor-not-allowed">
            Currently Unavailable
          </div>
        )}
      </div>
    </div>
  )
}

export default function Transporters() {
  const [search, setSearch] = useState('')
  const [selectedCargo, setSelectedCargo] = useState([])
  const [capacityFilter, setCapacityFilter] = useState('All')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const filtered = transporters.filter((t) => {
    const s = search.toLowerCase()
    const matchesSearch = !s ||
      t.name.toLowerCase().includes(s) ||
      t.truck.toLowerCase().includes(s) ||
      t.location.toLowerCase().includes(s)
    const matchesCargo = selectedCargo.length === 0 || selectedCargo.every((c) => t.cargoTypes.includes(c))
    const matchesCap = matchesCapacity(t, capacityFilter)
    const matchesAvail = !availableOnly || t.available
    return matchesSearch && matchesCargo && matchesCap && matchesAvail
  })

  const activeFilters = selectedCargo.length + (capacityFilter !== 'All' ? 1 : 0) + (availableOnly ? 1 : 0)

  function clearAll() {
    setSelectedCargo([])
    setCapacityFilter('All')
    setAvailableOnly(false)
  }

  function toggleCargo(type) {
    setSelectedCargo((prev) =>
      prev.includes(type) ? prev.filter((c) => c !== type) : [...prev, type]
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-brand-dark">Find a Transporter</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {filtered.length} transporter{filtered.length !== 1 ? 's' : ''} available near Eldoret
        </p>
      </div>

      {/* Search + filter bar */}
      <div className="flex gap-2.5 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, truck type, or location..."
            className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition placeholder:text-gray-400"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition shrink-0 ${
            showFilters || activeFilters > 0
              ? 'bg-brand-dark text-white border-brand-dark'
              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilters > 0 && (
            <span className="w-5 h-5 bg-brand-orange text-white text-xs rounded-full flex items-center justify-center font-bold">
              {activeFilters}
            </span>
          )}
        </button>
      </div>

      {/* Active filter chips */}
      {activeFilters > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedCargo.map((c) => (
            <span key={c} className="flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-medium px-3 py-1.5 rounded-full">
              {c}
              <button onClick={() => toggleCargo(c)}><X className="w-3 h-3" /></button>
            </span>
          ))}
          {capacityFilter !== 'All' && (
            <span className="flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-medium px-3 py-1.5 rounded-full">
              {capacityFilter}
              <button onClick={() => setCapacityFilter('All')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {availableOnly && (
            <span className="flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
              Available only
              <button onClick={() => setAvailableOnly(false)}><X className="w-3 h-3" /></button>
            </span>
          )}
          <button onClick={clearAll} className="text-xs text-gray-500 hover:text-red-500 transition underline underline-offset-2 px-1">
            Clear all
          </button>
        </div>
      )}

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mb-6 space-y-5">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2.5">Cargo type</p>
            <div className="flex flex-wrap gap-2">
              {cargoTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleCargo(type)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    selectedCargo.includes(type)
                      ? 'bg-brand-orange text-white border-brand-orange'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-brand-orange'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2.5">Capacity</p>
            <div className="flex flex-wrap gap-2">
              {capacities.map((cap) => (
                <button
                  key={cap}
                  onClick={() => setCapacityFilter(cap)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    capacityFilter === cap
                      ? 'bg-brand-dark text-white border-brand-dark'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-brand-dark'
                  }`}
                >
                  {cap}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-sm font-semibold text-gray-700">Available now only</p>
              <p className="text-xs text-gray-400 mt-0.5">Hide transporters who are currently busy</p>
            </div>
            <button
              onClick={() => setAvailableOnly(!availableOnly)}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${availableOnly ? 'bg-brand-orange' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${availableOnly ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t) => <TransporterCard key={t.id} t={t} />)}
        </div>
      ) : (
        <div className="text-center py-24">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Truck className="w-8 h-8 text-gray-300" />
          </div>
          <p className="font-bold text-gray-600 text-lg">No transporters found</p>
          <p className="text-gray-400 text-sm mt-1 mb-5">Try adjusting your search or filters</p>
          <button
            onClick={() => { clearAll(); setSearch('') }}
            className="bg-brand-orange hover:bg-orange-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}