import React from 'react'
import { motion } from 'framer-motion'
import { FaGraduationCap } from "react-icons/fa";
import { IoCodeWorkingOutline } from "react-icons/io5";


import Reveal from './Reveal'

const experiences = [
  {
    company: 'Under Gradulated',
    period: '2020 - Present',
    description: `University of Computer Studies, (Maubin) I'm going to graduate after 5 years of studying. Currently, I'm a 4th year computer science student.`,
    icon: <FaGraduationCap className='z-50 text-white text-3xl' />
  },
  {
    company: 'Joined Team via Facebook group',
    period: '2024 Aprl - 2024 May',
    description: 'We\'ve build UI for E-learning Platform using Tailwind and React.',
    icon: <IoCodeWorkingOutline className='z-50 text-white text-3xl' />,
    link : <a target='_blank' className='underline text-gray-400' href="https://github.com/MgZawHeinHtet/e-learning-project">Here,Project Link</a>
  },

]



const Experience = () => {
  return (
    <div className='p-8 max-w-[800px] mx-auto'>
      <h1 className='text-4xl text-gray-200 font-bold text-center mb-12'>Experience</h1>
      <motion.div
        className='grid grid-cols-1 '
        initial="hidden"
        animate="visible"
      >
        {experiences.map((experience, index) => (
          <Reveal key={index}>
            <div className='grid md:grid-cols-3 grid-cols-1 '>
              <div className='hidden before:content-[""] before:z-0 before:absolute before:h-full before:w-1 before:opacity-50 before:bg-purple-100 relative col-span-1 md:flex items-center justify-center'>
                <div className='w-20 h-20   bg-white bg-opacity-10 rounded-full border-white border-4 flex items-center justify-center'>
                  {experience.icon}
                </div>
              </div>
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 1 }}
                className='col-span-2 mb-10 w-full border border-purple-600 p-6 rounded-lg shadow-md
                    hover:shadow-xl transition-shadow duration-300 bg-purple-700/10'
              >
                <h2 className='text-gray-100 text-2xl font-semibold'>{experience.company}</h2>
                <p className='text-gray-300'>{experience.period}</p>
                <p className='text-gray-400 my-4'>{experience.description}</p>
                {experience.link && experience.link}

              </motion.div>
            </div>
          </Reveal>
        ))}

      </motion.div>


    </div>
  )
}

export default Experience