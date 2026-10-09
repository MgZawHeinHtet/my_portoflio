import { useState } from 'react'
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai'

const links = [
  { label: 'About', href: '#skills' },
  { label: 'Work', href: '#portfolio' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[#29342d] bg-[#0b1110]/95 backdrop-blur-xl">
      <nav className="container-page flex h-[76px] items-center justify-between" aria-label="Main navigation">
        <a href="#home" className="font-display text-xl font-bold tracking-tight text-white" onClick={() => setOpen(false)}>
          Zaw<span className="text-[#c9f17c]">.</span>
        </a>
        <div className="hidden items-center gap-9 md:flex">
          {links.map(({ label, href }) => (
            <a key={href} href={href} className="text-sm font-medium text-[#b7c1b9] transition hover:text-[#c9f17c]">{label}</a>
          ))}
        </div>
        <a href="mailto:zawheinhtet1223@gmail.com" className="button-outline hidden md:inline-flex">Let’s talk <span aria-hidden="true">↗</span></a>
        <button type="button" className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#39443b] text-white md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
          {open ? <AiOutlineClose size={22} /> : <AiOutlineMenu size={22} />}
        </button>
      </nav>
      {open && (
        <div id="mobile-menu" className="border-t border-[#29342d] bg-[#0b1110] px-5 pb-7 pt-4 md:hidden">
          {links.map(({ label, href }) => <a key={href} href={href} onClick={() => setOpen(false)} className="block border-b border-[#29342d] py-4 text-lg font-medium text-white">{label}</a>)}
          <a href="mailto:zawheinhtet1223@gmail.com" onClick={() => setOpen(false)} className="button-primary mt-6">Let’s talk ↗</a>
        </div>
      )}
    </header>
  )
}
