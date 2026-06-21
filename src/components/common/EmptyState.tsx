import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  title: string
  subtitle: string
  icon?: LucideIcon
  buttonText?: string
  onClick?: () => void
  gradient?: string
  animation?: boolean
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  icon: Icon,
  buttonText,
  onClick,
  gradient = 'from-violet-600 via-indigo-600 to-cyan-500',
  animation = true
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }

  const iconAnimation = animation
    ? {
        animate: {
          y: [0, -6, 0],
          scale: [1, 1.02, 1],
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        }
      }
    : {}

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[400px] w-full p-8 text-center"
      initial={animation ? 'hidden' : 'visible'}
      animate="visible"
      variants={containerVariants}
    >
      <div className="relative max-w-lg w-full bg-slate-950/40 backdrop-blur-md border border-slate-800/60 rounded-3xl p-10 shadow-[0_0_50px_-12px_rgba(99,102,241,0.15)] overflow-hidden">
        {/* Decorative Background Glows */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Icon container */}
        {Icon && (
          <motion.div
            className="inline-flex items-center justify-center p-5 rounded-2xl bg-slate-900/80 border border-slate-800 mb-6 shadow-inner relative group"
            {...iconAnimation}
            variants={itemVariants}
          >
            {/* Ambient behind-icon glow */}
            <div className={`absolute inset-0 bg-gradient-to-tr ${gradient} opacity-20 blur-xl rounded-2xl group-hover:opacity-40 transition-opacity duration-500`} />
            <Icon className="w-10 h-10 text-slate-100 relative z-10" />
          </motion.div>
        )}

        {/* Title */}
        <motion.h3
          className="text-2xl font-bold bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent mb-3 tracking-wide"
          variants={itemVariants}
        >
          {title}
        </motion.h3>

        {/* Subtitle */}
        <motion.p
          className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto"
          variants={itemVariants}
        >
          {subtitle}
        </motion.p>

        {/* Button */}
        {buttonText && onClick && (
          <motion.button
            onClick={onClick}
            className={`relative group px-6 py-3 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 transform active:scale-95 shadow-[0_4px_20px_-2px_rgba(99,102,241,0.3)] hover:shadow-[0_4px_25px_0_rgba(99,102,241,0.5)] cursor-pointer`}
            variants={itemVariants}
          >
            <span className={`absolute inset-0 bg-gradient-to-r ${gradient} transition-transform duration-300 group-hover:scale-105`} />
            <span className="relative z-10 flex items-center justify-center gap-2">
              {buttonText}
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
