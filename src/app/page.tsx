import { Hero } from '@/components/Hero'
import { Problem } from '@/components/Problem'
import { Solution } from '@/components/Solution'
import { Primitives } from '@/components/Primitives'
import { WhyLightweight } from '@/components/WhyLightweight'
import { BenchmarkSection } from '@/components/BenchmarkSection'
import { BenchmarkSummary } from '@/components/BenchmarkSummary'
import { ComparisonSection } from '@/components/ComparisonSection'
import { HandoffExample } from '@/components/HandoffExample'
import { SelfAudit } from '@/components/SelfAudit'
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
      <BenchmarkSummary />
      <ComparisonSection />
      <HandoffExample />
      <SelfAudit />
      <OpenSource />
      <Footer />
    </main>
  )
}
