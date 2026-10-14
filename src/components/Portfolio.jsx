import omini from "../assets/omini.webp"
import mapty from "../assets/mapty.webp"
import worldWise from "../assets/worldWise.webp"
import natureRecipe from "../assets/natureRecipe.webp"
import realEstate from "../assets/realEstate.webp"
import fastPizza from "../assets/fastPizza.webp"
import { AiOutlineGithub, AiOutlineArrowUp } from 'react-icons/ai'
import Reveal from './Reveal';

const projects = [
  {
    img: omini,
    title: "Omnifood",
    description: "UI for frontend development using Html,Css.",
    links: {
      site: "https://burmese-omnifood.vercel.app/",
      github: "https://github.com/MgZawHeinHtet/burmese-omnifood",
    },
  },
  {
    img: mapty,
    title: "Mapty",
    description: "An app for running and cycling workouts using JavaScript",
    links: {
      site: "https://burmese-forkify-guum.vercel.app/",
      github: "https://github.com/MgZawHeinHtet/burmese-mapty",
    },
  },
  {
    img: fastPizza,
    title: "React Pizza Company",
    description: "Fast-React-Pizza is a Redux project where people can order pizza without authentication.",
    links: {
      site: "https://react-pizza-omega-six.vercel.app/",
      github: "https://github.com/MgZawHeinHtet/react-pizza",
    },
  },
  {
    img: worldWise,
    title: "World Wise",
    description: "Simple web app that allows users to keep track of the places they've visited using React",
    links: {
      site: "https://world-wise-app-zeta.vercel.app/",
      github: "https://github.com/MgZawHeinHtet/World-wise-app",
    },
  },
  {
    img: natureRecipe,
    title: "Food Ordering System",
    description: "Food Ordering application with all features(Tailwind,Laravel)",
    links: {
      site: null,
      github: "https://github.com/MgZawHeinHtet/recipe-order-system",
    },
  },
  {
    img: realEstate,
    title: "Real Estate Mangement System",
    description: "Include all feauters that work in real world(Tailwind,Laravel)",
    links: {
      site: null,
      github: "https://github.com/MgZawHeinHtet/home_renting_sale",
    },
  },
]

const Portfolio = () => {
  return (
    <section className="border-y border-[#29342d] bg-[#101815]" id="portfolio">
      <div className="container-page section-pad">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><p className="eyebrow">02 / Selected work</p><h2 className="section-title">Things I’ve built<span className="text-[#c9f17c]">.</span></h2></div>
          <p className="muted max-w-sm leading-relaxed">A selection of projects exploring design, development, and problem-solving.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <Reveal key={project.title}>
              <article className="surface group h-full overflow-hidden">
                <div className="aspect-[16/10] overflow-hidden bg-[#27342d]">
                  <img src={project.img} alt={`Screenshot of ${project.title}`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                </div>
                <div className="p-6 sm:p-8">
                  <p className="eyebrow">Project / {String(index + 1).padStart(2, '0')}</p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">{project.title}</h3>
                  <p className="muted mt-3 min-h-[48px] text-sm leading-relaxed sm:text-base">{project.description}</p>
                  <div className="mt-7 flex flex-wrap gap-5 border-t border-[#324037] pt-5 text-sm font-semibold">
                    {project.links.site && <a target="_blank" rel="noopener noreferrer" href={project.links.site} className="inline-flex items-center gap-2 text-[#c9f17c] hover:underline">Live site <AiOutlineArrowUp className="rotate-45" aria-hidden="true" /></a>}
                    <a target="_blank" rel="noopener noreferrer" href={project.links.github} className="inline-flex items-center gap-2 text-[#e7ede6] hover:text-[#c9f17c]"><AiOutlineGithub className="text-lg" aria-hidden="true" /> Source code</a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Portfolio
