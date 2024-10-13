import React from 'react';
import omini from "../assets/omini.png"
import mapty from "../assets/mapty.png"
import worldWise from "../assets/worldWise.png"
import natureRecipe from "../assets/natureRecipe.png"
import realEstate from "../assets/realEstate.png"
import fastPizza from "../assets/fastPizza.png"
import { AiOutlineGithub } from 'react-icons/ai'
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
    <div className='max-w-[1000px] mx-auto p-6 md:my-20' id="portfolio">
      <h2 className='text-3xl font-bold text-gray-200 mb-8'>Portfolio</h2>
      {projects.map((project, index) => (

        <Reveal key={index}>
          <div key={index}
            className={`flex flex-col md:flex-row ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''} mb-12`}>
            <div className='w-full md:w-1/2 p-4'>
              <img
                src={project.img}
                alt={project.title}
                className='w-full h-full object-cover rounded-lg shadow-lg'
              />
            </div>
            <div className='w-full md:w-1/2 p-4 flex flex-col justify-center'>
              <h3 className='text-2xl font-semibold text-gray-200 mb-4'>{project.title}</h3>
              <p className='text-gray-300 mb-4'>{project.description}</p>
              <div className='flex space-x-4'>
                {project.links.site && <a target='_blank' href={project.links.site}
                  className='px-4 py-2 bg-slate-600 text-gray-200 rounded-lg hover:bg-slate-700
                                        transition duration-300'>
                  View Site
                </a>}

                <a target="_blank" href={project.links.github}
                  className='px-4 py-2 bg-slate-600 text-gray-200 rounded-lg hover:bg-slate-700
                                        transition duration-300'>
                  <AiOutlineGithub />
                </a>

              </div>

            </div>

          </div>
        </Reveal>
      ))}

    </div>
  )
}

export default Portfolio