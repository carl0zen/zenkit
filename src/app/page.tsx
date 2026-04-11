import { Hero } from '@/components/Hero'
import { Problem } from '@/components/Problem'
import { Solution } from '@/components/Solution'
import { Primitives } from '@/components/Primitives'
import { WhyLightweight } from '@/components/WhyLightweight'
import { BenchmarkSection } from '@/components/BenchmarkSection'
import { HandoffExample } from '@/components/HandoffExample'
import { OpenSource } from '@/components/OpenSource'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Nav />
      <Hero />
      <Problem />
      <Solution />
      <Primitives />
      <WhyLightweight />
      <BenchmarkSection />
      <HandoffExample />
      <OpenSource />
      <Footer />
    </main>
  )
}
