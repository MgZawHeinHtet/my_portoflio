import { AiOutlineArrowDown, AiOutlineGithub, AiOutlineLinkedin } from 'react-icons/ai'
import zawProfile from '../assets/zawProfile.png'
import myCv from '../assets/myCv.pdf'

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden border-b border-[#29342d]">
      <div className="pointer-events-none absolute right-[-15%] top-[-30%] h-[700px] w-[700px] rounded-full bg-[#a2d76f]/[0.07] blur-[110px]" />
      <div className="container-page relative grid min-h-[680px] items-center gap-12 pb-12 pt-16 md:grid-cols-[1.15fr_0.85fr] md:pb-0 md:pt-10">
        <div className="relative z-10">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#45583c] bg-[#c9f17c]/[0.07] px-4 py-2 text-xs font-semibold text-[#c9f17c] sm:text-sm"><span className="h-2 w-2 rounded-full bg-[#c9f17c]" /> Fullstack Developer</div>
          <h1 className="font-display max-w-[730px] text-[clamp(3.5rem,7vw,6.5rem)] font-semibold leading-[0.99] tracking-[-0.075em] text-[#f3f5f0]">Hi, I’m Zaw Hein Htet<span className="text-[#c9f17c]">.</span></h1>
          <p className="muted mt-8 max-w-[530px] text-lg leading-relaxed sm:text-xl">I build thoughtful web experiences, from intuitive interfaces to reliable fullstack applications.</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a href="#portfolio" className="button-primary">Explore my work <span aria-hidden="true">↗</span></a>
            <a href={myCv} download="Zaw-Hein-Htet-CV.pdf" className="button-outline">Download CV <AiOutlineArrowDown aria-hidden="true" /></a>
          </div>
          <div className="mt-12 flex items-center gap-5 border-t border-[#29342d] pt-6">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#8f9c92]">Find me on</span>
            <a href="https://github.com/MgZawHeinHtet" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-2xl text-[#e7ede6] transition hover:text-[#c9f17c]"><AiOutlineGithub /></a>
            <a href="https://www.linkedin.com/in/zaw-hein-htet/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-2xl text-[#e7ede6] transition hover:text-[#c9f17c]"><AiOutlineLinkedin /></a>
          </div>
        </div>
        <div className="relative mx-auto flex w-full max-w-[470px] items-end justify-center self-end">
          <div className="absolute bottom-[8%] left-[8%] right-[8%] aspect-square rounded-full border border-[#c9f17c]/25 bg-[#213429]" />
          <div className="absolute bottom-[15%] left-[15%] right-[15%] aspect-square rounded-full border border-[#c9f17c]/20" />
          <img src={zawProfile} alt="Portrait of Zaw Hein Htet" className="relative z-10 w-full object-contain" />
        </div>
      </div>
    </section>
  )
}
