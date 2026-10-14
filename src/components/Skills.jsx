import { DiBootstrap, DiCss3, DiGithubBadge, DiHtml5, DiJavascript1, DiLaravel, DiMysql, DiReact, DiSass } from 'react-icons/di'
import Reveal from './Reveal'

const skills = [
  { category: 'Frontend', description: 'Interfaces that feel as good as they look.', technologies: [
    { name: 'HTML', icon: DiHtml5 }, { name: 'CSS', icon: DiCss3 }, { name: 'Sass', icon: DiSass },
    { name: 'Bootstrap', icon: DiBootstrap }, { name: 'JavaScript', icon: DiJavascript1 }, { name: 'React', icon: DiReact },
  ] },
  { category: 'Fullstack', description: 'Connecting ideas to working products.', technologies: [
    { name: 'Laravel', icon: DiLaravel }, { name: 'MySQL', icon: DiMysql },
    { name: 'React', icon: DiReact }, { name: 'GitHub', icon: DiGithubBadge },
  ] },
]

export default function Skills() {
  return (
    <section className="section-pad container-page" id="skills">
      <Reveal>
        <div className="mb-10 flex flex-col justify-between gap-5 md:mb-14 md:flex-row md:items-end">
          <div><p className="eyebrow">01 / What I do</p><h2 className="section-title">Skills & tools<span className="text-[#c9f17c]">.</span></h2></div>
          <p className="muted max-w-md leading-relaxed">I work across the frontend and backend to turn ideas into useful, polished experiences.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {skills.map(({ category, description, technologies }) => (
            <div key={category} className="surface p-6 sm:p-9">
              <div className="mb-8 border-b border-[#324037] pb-7">
                <h3 className="text-2xl font-semibold text-white">{category}</h3>
                <p className="muted mt-2 text-sm">{description}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {technologies.map(({ name, icon: Icon }) => <div key={name} className="flex items-center gap-2 rounded-full border border-[#354339] bg-[#1b2720] px-4 py-2 text-sm text-[#e3ebe2]"><Icon className="text-lg text-[#c9f17c]" aria-hidden="true" />{name}</div>)}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
