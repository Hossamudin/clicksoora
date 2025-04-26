import Header from '@/components/layout/header';
import Hero from '@/components/sections/hero';
import Features from '@/components/sections/features';
import HowItWorks from '@/components/sections/how-it-works';
import HowToUse from '@/components/sections/how-to-use';
import Videos from '@/components/sections/videos';
import About from '@/components/sections/about';
import Footer from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <HowToUse />
        <Videos />
        <About />
      </main>
      <Footer />
    </div>
  );
}
