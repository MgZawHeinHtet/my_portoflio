import { FaGraduationCap } from 'react-icons/fa'
import { IoCodeWorkingOutline } from 'react-icons/io5'
import Reveal from './Reveal'

const experiences = [
  {
    title: 'Computer Science Student',
    organization: 'University of Computer Studies (Maubin)',
    period: '2020 – Present',
    description: 'Studying computer science and building a foundation in software development.',
    icon: FaGraduationCap,
  },
  {
    title: 'E-learning Platform Team Project',
    organization: 'Collaborative project',
    period: 'April – May 2024',
    description: 'Collaborated on the interface for an e-learning platform using React and Tailwind CSS.',
    icon: IoCodeWorkingOutline,
    link: 'https://github.com/MgZawHeinHtet/e-learning-project',
  },
]

export default function Experience() {
  return (
    <section className="container-page section-pad" id="experience">
      <Reveal>
        <div className="mb-12"><p className="eyebrow">03 / My journey</p><h2 className="section-title">Experience<span className="text-[#c9f17c]">.</span></h2></div>
        <div className="relative space-y-5 before:absolute before:bottom-8 before:left-6 before:top-8 before:w-px before:bg-[#405344] sm:before:left-8">
          {experiences.map(({ title, organization, period, description, icon: Icon, link }) => (
            <div key={title} className="relative flex gap-5 sm:gap-8">
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#5a7851] bg-[#1e3122] text-[#c9f17c] sm:h-16 sm:w-16"><Icon size={23} aria-hidden="true" /></div>
              <div className="surface flex-1 p-6 sm:p-8">
                <p className="eyebrow">{period}</p>
                <h3 className="mt-3 text-xl font-semibold text-white sm:text-2xl">{title}</h3>
                <p className="mt-1 text-sm text-[#c9f17c]">{organization}</p>
                <p className="muted mt-4 leading-relaxed">{description}</p>
                {link && <a href={link} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-sm font-semibold text-[#c9f17c] hover:underline">View project ↗</a>}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
