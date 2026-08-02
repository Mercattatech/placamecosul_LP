import { useEffect, useRef } from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { PlatingGallery } from "../components/PlatingGallery";
import { HowItWorks } from "../components/HowItWorks";
import { Services } from "../components/Services";
import { TrustSection } from "../components/TrustSection";
import { MainForm } from "../components/MainForm";
import { FAQ } from "../components/FAQ";
import { PartnerSection } from "../components/PartnerSection";
import { Footer } from "../components/Footer";
import { analytics } from "../utils/analytics";

export function Home() {
  const startTimeRef = useRef<number>(Date.now());
  const scrollMilestonesRef = useRef<Set<number>>(new Set());
  const exitIntentFiredRef = useRef(false);

  useEffect(() => {
    // 1. Evento: page_view
    analytics.pageView();

    // 8. Evento: scroll_depth — rastrear milestones de rolagem
    const handleScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      const pct = Math.round((scrolled / total) * 100);
      const milestones = [25, 50, 75, 100];
      milestones.forEach(m => {
        if (pct >= m && !scrollMilestonesRef.current.has(m)) {
          scrollMilestonesRef.current.add(m);
          analytics.scrollDepth(m);
        }
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 10. Evento: exit_intent — mouse saindo pelo topo
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !exitIntentFiredRef.current) {
        exitIntentFiredRef.current = true;
        analytics.exitIntent();
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);

    // 11. Evento: time_on_page — disparado ao sair da página
    const handleBeforeUnload = () => {
      const seconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      analytics.timeOnPage(seconds);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // 9. Evento: section_view — IntersectionObserver para cada seção
    const sections = [
      { id: 'inicio', name: 'hero' },
      { id: 'galeria', name: 'galeria' },
      { id: 'como-funciona', name: 'como-funciona' },
      { id: 'servicos', name: 'servicos' },
      { id: 'confianca', name: 'confianca' },
      { id: 'formulario', name: 'formulario' },
      { id: 'duvidas', name: 'faq' },
      { id: 'parceiros', name: 'parceiros' },
      { id: 'contato', name: 'rodape' },
    ];
    const viewedSections = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            const sectionName = entry.target.getAttribute('data-section');
            if (sectionName && !viewedSections.has(sectionName)) {
              viewedSections.add(sectionName);
              analytics.sectionView(sectionName);
            }
          }
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach(({ id, name }) => {
      const el = document.getElementById(id);
      if (el) {
        el.setAttribute('data-section', name);
        observer.observe(el);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <PlatingGallery />
      <HowItWorks />
      <Services />
      <TrustSection />
      <MainForm />
      <FAQ />
      <PartnerSection />
      <Footer />
    </div>
  );
}