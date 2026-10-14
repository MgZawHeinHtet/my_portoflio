import { motion, useReducedMotion } from 'framer-motion'
import PropTypes from 'prop-types'

export default function Reveal({ children }) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      className="h-full w-full"
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

Reveal.propTypes = { children: PropTypes.node.isRequired }
