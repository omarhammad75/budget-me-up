'use client'

import { motion } from 'framer-motion'
import { Star, ShieldCheck, Smartphone, Zap } from 'lucide-react'

const testimonials = [
  {
    quote: 'I had no idea Netflix, Hulu, and that old gym membership were all still charging me. BudgetMeUp caught them all.',
    name: 'Sarah K.',
    role: 'Designer',
    initials: 'SK',
    color: '#6366F1',
  },
  {
    quote: 'Just seeing my safe-to-spend number every morning changed how I feel about money. I stopped guessing.',
    name: 'Marcus T.',
    role: 'Software Engineer',
    initials: 'MT',
    color: '#22C55E',
  },
  {
    quote: 'Finally an app that just tells me what I can spend — without making me feel bad about it.',
    name: 'Priya M.',
    role: 'Marketing Manager',
    initials: 'PM',
    color: '#F59E0B',
  },
]

const trustStats = [
  { value: '$219', label: 'Avg. saved in forgotten subs', color: '#22C55E' },
  { value: '60s', label: 'To set up and start tracking', color: '#6366F1' },
  { value: '100%', label: 'Private — no bank logins needed', color: '#F59E0B' },
]

export function SocialProofSection() {
  return (
    <section className="py-24 px-5 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(17,24,39,0.5) 40%, transparent 100%)' }}
      />

      <div className="max-w-6xl mx-auto relative">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-3">
            Real people, real results
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Built for the way people
            <br />
            actually manage money.
          </h2>
        </motion.div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border p-6 flex flex-col gap-4 relative overflow-hidden"
              style={{ background: '#111827', borderColor: 'rgba(255,255,255,0.06)' }}
            >
              {/* Top gradient accent */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${t.color}55, transparent)` }}
              />

              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-current" style={{ color: t.color }} />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-muted-foreground/85 leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: `${t.color}18`, color: t.color, border: `1px solid ${t.color}28` }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-none">{t.name}</p>
                  <p className="text-xs text-muted-foreground/50 mt-0.5">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-3 gap-4 max-w-2xl mx-auto"
        >
          {trustStats.map((s) => (
            <div
              key={s.label}
              className="text-center rounded-2xl border p-5"
              style={{ background: '#111827', borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <p
                className="text-3xl font-extrabold tracking-tight mb-1.5"
                style={{ color: s.color }}
              >
                {s.value}
              </p>
              <p className="text-xs text-muted-foreground/60 leading-snug">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* About / trust section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-16 rounded-2xl border p-8 md:p-10 relative overflow-hidden"
          style={{ background: '#111827', borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <div
            className="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-8"
            style={{ background: 'radial-gradient(ellipse at 100% 0%, rgba(99,102,241,0.25) 0%, transparent 65%)' }}
          />

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-3">
                About BudgetMeUp
              </p>
              <h3 className="text-2xl font-bold text-foreground mb-4 leading-tight">
                Built out of real frustration
                <br />
                with money confusion.
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                BudgetMeUp was built because existing finance apps were either too complex,
                too ugly, or required giving up access to your bank accounts.
                We wanted something that installs on your phone in 60 seconds and just tells
                you what you can spend — clearly, calmly, and privately.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  icon: ShieldCheck,
                  title: 'Private by design',
                  body: 'No bank connections, no sharing, no selling your data. Ever.',
                  color: '#22C55E',
                },
                {
                  icon: Smartphone,
                  title: 'Installs on iPhone',
                  body: 'Works as a PWA — add it to your home screen from Safari. No App Store needed.',
                  color: '#6366F1',
                },
                {
                  icon: Zap,
                  title: 'Free to use',
                  body: 'No trial, no credit card. Just sign up and start.',
                  color: '#F59E0B',
                },
              ].map(({ icon: Icon, title, body, color }) => (
                <div key={title} className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${color}14`, border: `1px solid ${color}25` }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color }} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground/65 mt-0.5 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
