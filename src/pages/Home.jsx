import { Link } from 'react-router-dom'
import { Truck, Package, Star, Shield, Clock, MapPin, ArrowRight, CheckCircle } from 'lucide-react'

const stats = [
  { value: '500+', label: 'Verified Transporters' },
  { value: '12k+', label: 'Trips Completed' },
  { value: '4.8', label: 'Average Rating' },
  { value: '24h', label: 'Avg. Response Time' },
]

const steps = [
  {
    icon: <MapPin className="w-6 h-6 text-brand-orange" />,
    title: 'Enter your route',
    desc: 'Tell us your pickup and drop-off location, cargo type, and preferred date.',
  },
  {
    icon: <Truck className="w-6 h-6 text-brand-orange" />,
    title: 'Pick a transporter',
    desc: 'Browse verified drivers with real ratings, truck specs, and transparent pricing.',
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-brand-orange" />,
    title: 'Confirm & ship',
    desc: 'Book instantly. Your transporter calls to confirm pickup — no back-and-forth.',
  },
]

const features = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Verified drivers only',
    desc: 'Every transporter on RiftHaul is licensed, vetted, and reviewed by real customers before they appear on the platform.',
  },
  {
    icon: <Package className="w-5 h-5" />,
    title: 'Any cargo, any size',
    desc: 'From a tonne of maize to a full container of machinery — filter by truck type, capacity, and cargo specialty.',
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: 'Book in under 3 minutes',
    desc: 'No phone calls, no waiting. Search, compare, and confirm a transporter from your phone or laptop.',
  },
  {
    icon: <Star className="w-5 h-5" />,
    title: 'Honest, transparent pricing',
    desc: 'See the per-km rate upfront. No hidden fees. The final price is agreed before the truck moves.',
  },
]

const testimonials = [
  {
    name: 'Mary Cherotich',
    role: 'Maize Trader, Eldoret',
    text: 'I used to spend half a day calling transporters. Now I book in minutes and the driver calls me within the hour.',
    rating: 5,
  },
  {
    name: 'Brian Otieno',
    role: 'Hardware Supplier, Kisumu',
    text: 'The pricing is clear and the drivers are professional. My building materials arrived on time and in perfect condition.',
    rating: 5,
  },
  {
    name: 'Esther Langat',
    role: 'Electronics Retailer, Nakuru',
    text: 'Finally a platform built for Kenyan businesses. RiftHaul understands our routes and our needs.',
    rating: 5,
  },
]

export default function Home() {
  return (
    <div className="font-sans text-gray-800">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative bg-brand-dark overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
        />
        <div className="relative max-w-5xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-brand-orange text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
              Eldoret's cargo network — now online
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
              Ship cargo across Kenya —{' '}
              <span className="text-brand-orange">without the phone calls.</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
              RiftHaul connects Eldoret businesses with trusted local truck operators.
              Search, compare, and book verified transporters in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/transporters"
                className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-orange-500 text-white font-bold px-7 py-4 rounded-xl text-sm transition-all hover:gap-3"
              >
                Find a transporter <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-7 py-4 rounded-xl text-sm transition"
              >
                Register your truck
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <section className="bg-brand-orange">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-extrabold text-white">{s.value}</p>
              <p className="text-orange-100 text-sm mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand-orange text-sm font-semibold uppercase tracking-widest mb-2">How it works</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark">From order to delivery in 3 steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line — desktop only */}
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-px bg-gray-100" />
            {steps.map((s, i) => (
              <div key={s.title} className="relative text-center">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto mb-5">
                  {s.icon}
                </div>
                <div className="absolute top-0 right-6 w-6 h-6 rounded-full bg-gray-100 text-gray-400 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <h3 className="font-bold text-brand-dark text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/transporters"
              className="inline-flex items-center gap-2 bg-brand-dark hover:bg-gray-800 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition"
            >
              Get started now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand-orange text-sm font-semibold uppercase tracking-widest mb-2">Why RiftHaul</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark">Built for Rift Valley businesses</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-brand-orange shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-brand-dark mb-1">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand-orange text-sm font-semibold uppercase tracking-widest mb-2">Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark">What our customers say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-orange flex items-center justify-center text-white font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-brand-dark text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="bg-brand-dark py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Ready to move your cargo?
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Join hundreds of Eldoret businesses already using RiftHaul.
            Sign up free — no subscription, no commitment.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-orange-500 text-white font-bold px-8 py-4 rounded-xl text-sm transition"
            >
              Create a free account <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/transporters"
              className="inline-flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-xl text-sm transition"
            >
              Browse transporters
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="bg-gray-900 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Truck className="text-brand-orange w-5 h-5" />
            <span className="font-extrabold text-white">Rift<span className="text-brand-orange">Haul</span></span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 RiftHaul. Connecting Eldoret's cargo network.</p>
          <div className="flex gap-5 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  )
}