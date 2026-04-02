import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LandingNav } from '@/components/landing/landing-nav'
import { HeroSection } from '@/components/landing/hero-section'
import { WhySection } from '@/components/landing/why-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { ProductPreview } from '@/components/landing/product-preview'
import { FinalCTA } from '@/components/landing/final-cta'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen" style={{ background: '#0B0F14' }}>
      <LandingNav />
      <HeroSection />
      <WhySection />
      <FeaturesSection />
      <ProductPreview />
      <FinalCTA />
    </div>
  )
}
