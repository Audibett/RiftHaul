import { Link } from 'react-router-dom'
import { Truck, Package, Star, Shield, Clock, MapPin } from 'lucide-react'

const features = [
  {
    icon: <Truck className="w-7 h-7 text-brand-orange" />,
    title: "Verified Transporters",
    desc: "Every transporter is vetted, licensed, and rated by real customers.",
  },
  {
    icon: <Package className="w-7 h-7 text-brand-orange" />,
    title: "All Cargo Types",
    desc: "From electronics to heavy machinery — we have the right truck for your load.",
  },
  {
    icon: <Clock className="w-7 h-7 text-brand-orange" />,
    title: "Book in Minutes",
    desc: "Search, compare, and confirm a transporter without phone calls or hassle.",
  },
  {
    icon: <Shield className="w-7 h-7 text-brand-orange" />,
    title: "Secure & Tracked",
    desc: "Your booking is recorded and you get updates every step of the way.",
  },
]

const steps = [
  { step: "01", title: "Post Your Cargo", desc: "Tell us where you're going, what you're carrying, and when." },
  { step: "02", title: "Browse Transporters", desc: "See available trucks, read ratings, and compare prices." },
  { step: "03", title: "Confirm & Go", desc: "Book instantly. The transporter contacts you to confirm pickup." },
]

const stats = [
  { value: "500+", label: "Transporters" },
  { value: "12,000+", label: "Trips Completed" },
  { value: "4.8★", label: "Average Rating" },
  { value: "Eldoret", label: "& Beyond" },
]

export default function Home() {
  return (
    <div className="font-sans">

      {/* Hero */}
      <section className="bg-black text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-brand-orange text-white text-sm font-semibold px-4 py-1 rounded-full mb-5">
            Eldoret's #1 Cargo Network
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Move Cargo Across Kenya — <span className="text-brand-orange">Fast & Reliably</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            RiftHaul connects businesses with trusted local truck operators in Eldoret
            and across the Rift Valley. Book verified transporters in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/transporters"
              className="bg-brand-orange hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-lg text-lg transition"
            >
              Find a Transporter
            </Link>
            <Link
              to="/register"
              className="border border-white text-white hover:bg-white hover:text-brand-dark font-bold px-8 py-4 rounded-lg text-lg transition"
            >
              Register Your Truck
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-brand-orange text-white py-8 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold">{s.value}</p>
              <p className="text-sm font-medium opacity-90">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-brand-dark mb-2">How It Works</h2>
          <p className="text-center text-gray-500 mb-12">Three simple steps to move your cargo</p>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-orange-100 text-brand-orange font-extrabold text-xl flex items-center justify-center mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-bold text-lg text-brand-dark mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-brand-dark mb-2">Why RiftHaul</h2>
          <p className="text-center text-gray-500 mb-12">Built for businesses in the Rift Valley</p>
          <div className="grid sm:grid-cols-2 gap-8">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4 bg-white p-6 rounded-xl shadow-sm">
                <div className="shrink-0 mt-1">{f.icon}</div>
                <div>
                  <h3 className="font-bold text-brand-dark mb-1">{f.title}</h3>
                  <p className="text-gray-500 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-dark text-white py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <MapPin className="w-10 h-10 text-brand-orange mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ready to Ship Your Cargo?</h2>
          <p className="text-gray-300 mb-8">
            Join hundreds of businesses already using RiftHaul to move goods across Kenya.
          </p>
          <Link
            to="/register"
            className="bg-brand-orange hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-lg text-lg transition"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-6 text-center text-sm">
        <p className="font-bold text-white text-lg mb-1">RiftHaul</p>
        <p>© 2026 RiftHaul. Connecting Eldoret's cargo network.</p>
      </footer>

    </div>
  )
}