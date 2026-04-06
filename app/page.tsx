import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LandingNav } from '@/components/landing/landing-nav'
import { HeroSection } from '@/components/landing/hero-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { WhySection } from '@/components/landing/why-section'
import { SocialProofSection } from '@/components/landing/social-proof-section'
import { FinalCTA } from '@/components/landing/final-cta'

export const metadata: Metadata = {
  title: 'BudgetMeUp — Know exactly where your money goes',
  description:
    'Track spending, catch forgotten subscriptions, and stay in control of your finances. Free, installs on iPhone, takes 60 seconds to set up.',
}

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen" style={{ background: '#0B0F14' }}>
      <LandingNav />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <WhySection />
      <SocialProofSection />
      <FinalCTA />
    </div>
  )
}
