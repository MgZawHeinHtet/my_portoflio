import { AiOutlineGithub, AiOutlineLinkedin } from 'react-icons/ai'

export default function Footer() {
  return (
    <footer className="border-t border-[#29342d]">
      <div className="container-page flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div><a href="#home" className="font-display text-xl font-bold text-white">Zaw<span className="text-[#c9f17c]">.</span></a><p className="muted mt-1 text-sm">Designed & built by Zaw Hein Htet.</p></div>
        <div className="flex items-center gap-5">
          <a href="https://github.com/MgZawHeinHtet" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-2xl text-[#b7c1b9] hover:text-[#c9f17c]"><AiOutlineGithub /></a>
          <a href="https://www.linkedin.com/in/zaw-hein-htet/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-2xl text-[#b7c1b9] hover:text-[#c9f17c]"><AiOutlineLinkedin /></a>
          <a href="#home" className="ml-4 text-sm font-semibold text-[#c9f17c] hover:underline">Back to top ↑</a>
        </div>
      </div>
    </footer>
  )
}
