"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface AnimatedBackgroundProps {
  brightness?: number
}

const AnimatedBackground = ({ brightness = 1 }: AnimatedBackgroundProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: "linear",
      },
    },
  }

  const rectGrowVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 0.1 * brightness,
      transition: {
        duration: 2,
        ease: "linear",
      },
    },
  }

  const circleVariants = {
    hidden: {
      opacity: 0,
      pathLength: 0,
    },
    visible: {
      opacity: brightness,
      pathLength: 1,
      transition: {
        opacity: { duration: 1, ease: "easeOut" },
        pathLength: { duration: 1, ease: "linear" },
      },
    },
  }

  const dashVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 0.3 * brightness,
      transition: {
        duration: 5,
        ease: "linear",
      },
    },
  }

  return (
    <div
      className="fixed top-[520px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-0"
      style={{ opacity: 1 }}
    >
      <svg
        width="1304"
        height="1441"
        viewBox="0 0 1304 1441"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative -left-8 top-[104px]"
      >
        <defs>
          {/* Filters */}
          <filter
            id="filter0_b"
            x="985"
            y="1346.08"
            width="49"
            height="49"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
          </filter>
          <filter
            id="filter1_b"
            x="270"
            y="1345.08"
            width="49"
            height="49"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
          </filter>
          <filter
            id="filter2_b"
            x="985"
            y="989.083"
            width="49"
            height="49"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
          </filter>
          <filter
            id="filter3_b"
            x="270"
            y="988.083"
            width="49"
            height="49"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
          </filter>
          <filter
            id="filter4_b"
            x="985"
            y="361.083"
            width="49"
            height="49"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
          </filter>
          <filter
            id="filter5_b"
            x="270"
            y="361.083"
            width="49"
            height="49"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
          </filter>
          <filter
            id="filter6_b"
            x="985"
            y="228.083"
            width="49"
            height="49"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
          </filter>
          <filter
            id="filter7_b"
            x="270"
            y="228.083"
            width="49"
            height="49"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
          </filter>

          {/* Linear Gradients */}
          <linearGradient id="paint0_linear" x1="0" y1="0" x2="1440" y2="-3.09853e-05" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" stopOpacity="0" />
            <stop offset="0.494792" stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint1_linear"
            x1="295"
            y1="0.938477"
            x2="1735"
            y2="0.938446"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" stopOpacity="0" />
            <stop offset="0.494792" stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="paint2_linear" x1="0" y1="0" x2="1716" y2="4.02253e-07" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D9D9D9" stopOpacity="0" />
            <stop offset="0.214834" stopColor="#D9D9D9" stopOpacity="0" />
            <stop offset="0.37596" stopColor="#D9D9D9" stopOpacity="0.81202" />
            <stop offset="0.79021" stopColor="#D9D9D9" stopOpacity="0.604895" />
            <stop offset="1" stopColor="#D9D9D9" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="paint3_linear" x1="0" y1="0" x2="1716" y2="4.02253e-07" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D9D9D9" stopOpacity="0" />
            <stop offset="0.214834" stopColor="#D9D9D9" stopOpacity="0" />
            <stop offset="0.37596" stopColor="#D9D9D9" stopOpacity="0.81202" />
            <stop offset="0.79021" stopColor="#D9D9D9" stopOpacity="0.604895" />
            <stop offset="1" stopColor="#D9D9D9" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint4_linear"
            x1="-347"
            y1="1012.79"
            x2="1369"
            y2="1012.79"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#D9D9D9" stopOpacity="0" />
            <stop offset="0.214834" stopColor="#D9D9D9" stopOpacity="0" />
            <stop offset="0.37596" stopColor="#D9D9D9" stopOpacity="0.81202" />
            <stop offset="0.79021" stopColor="#D9D9D9" stopOpacity="0.604895" />
            <stop offset="1" stopColor="#D9D9D9" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint5_linear"
            x1="-347"
            y1="1369.79"
            x2="1369"
            y2="1369.79"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#D9D9D9" stopOpacity="0" />
            <stop offset="0.214834" stopColor="#D9D9D9" stopOpacity="0" />
            <stop offset="0.37596" stopColor="#D9D9D9" stopOpacity="0.81202" />
            <stop offset="0.79021" stopColor="#D9D9D9" stopOpacity="0.604895" />
            <stop offset="1" stopColor="#D9D9D9" stopOpacity="0" />
          </linearGradient>

          {/* Radial Gradients */}
          <radialGradient
            id="paint14_angular"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(967.702 1112.64) rotate(135) scale(141)"
          >
            <stop stopColor="white" stopOpacity="0.5" />
            <stop offset="1" stopColor="white" stopOpacity="0.05" />
          </radialGradient>
          <radialGradient
            id="paint15_angular"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(967.702 1112.64) rotate(135) scale(141)"
          >
            <stop stopColor="white" stopOpacity="0.5" />
            <stop offset="1" stopColor="white" stopOpacity="0.05" />
          </radialGradient>
          <radialGradient
            id="paint16_angular"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(286.092 405.03) rotate(135) scale(27)"
          >
            <stop stopColor="white" stopOpacity="0.5" />
            <stop offset="1" stopColor="white" stopOpacity="0.05" />
          </radialGradient>
          <linearGradient
            id="paint17_linear"
            x1="1022"
            y1="415.938"
            x2="1388"
            y2="489.938"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <clipPath id="clip0">
            <rect width="1440" height="1440" fill="white" transform="translate(-68 0.938477)" />
          </clipPath>
        </defs>

        <g clipPath="url(#clip0)">
          {/* Animated Rectangles (Lines) */}
          <motion.rect
            variants={rectGrowVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            width="1440"
            height="0.999972"
            transform="matrix(2.16865e-08 1 1 -8.81047e-08 1009 0.938477)"
            fill="url(#paint0_linear)"
            style={{ transformOrigin: "left center" }}
          />
          <motion.rect
            variants={rectGrowVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            x="295"
            y="0.938477"
            width="1440"
            height="0.999972"
            transform="rotate(90 295 0.938477)"
            fill="url(#paint1_linear)"
            style={{ transformOrigin: "left center" }}
          />
          <motion.rect
            variants={rectGrowVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            width="1998"
            height="1"
            transform="matrix(-1 0 0 1 1651 384.794)"
            fill="url(#paint2_linear)"
            style={{ transformOrigin: "left center" }}
          />
          <motion.rect
            variants={rectGrowVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            opacity="0.05"
            width="1998"
            height="1"
            transform="matrix(-1 0 0 1 1651 252.794)"
            fill="url(#paint3_linear)"
            style={{ transformOrigin: "left center" }}
          />
          <motion.rect
            variants={rectGrowVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            x="-347"
            y="1012.79"
            width="1998"
            height="1"
            fill="url(#paint4_linear)"
            style={{ transformOrigin: "left center" }}
          />
          <motion.rect
            variants={rectGrowVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            opacity="0.05"
            x="-347"
            y="1369.79"
            width="1998"
            height="1"
            fill="url(#paint5_linear)"
            style={{ transformOrigin: "left center" }}
          />

          {/* Animated Circles */}
          <g filter="url(#filter0_b)">
            <motion.circle
              variants={circleVariants}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              cx="1009.5"
              cy="1370.58"
              r="4"
              stroke="white"
              strokeOpacity={0.07 * brightness}
              fill="none"
            />
          </g>
          <g filter="url(#filter1_b)">
            <motion.circle
              variants={circleVariants}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              cx="294.5"
              cy="1369.58"
              r="4"
              stroke="white"
              strokeOpacity={0.07 * brightness}
              fill="none"
            />
          </g>
          <g filter="url(#filter2_b)">
            <motion.circle
              variants={circleVariants}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              cx="1009.5"
              cy="1013.58"
              r="4"
              stroke="white"
              strokeOpacity={0.07 * brightness}
              fill="none"
            />
          </g>
          <g filter="url(#filter3_b)">
            <motion.circle
              variants={circleVariants}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              cx="294.5"
              cy="1012.58"
              r="4"
              stroke="white"
              strokeOpacity={0.07 * brightness}
              fill="none"
            />
          </g>
          <g filter="url(#filter4_b)">
            <motion.circle
              variants={circleVariants}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              cx="1009.5"
              cy="385.583"
              r="4"
              stroke="white"
              strokeOpacity={0.07 * brightness}
              fill="none"
            />
          </g>
          <g filter="url(#filter5_b)">
            <motion.circle
              variants={circleVariants}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              cx="294.5"
              cy="385.583"
              r="4"
              stroke="white"
              strokeOpacity={0.07 * brightness}
              fill="none"
            />
          </g>
          <g filter="url(#filter6_b)">
            <motion.circle
              variants={circleVariants}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              cx="1009.5"
              cy="252.583"
              r="4"
              stroke="white"
              strokeOpacity={0.07 * brightness}
              fill="none"
            />
          </g>
          <g filter="url(#filter7_b)">
            <motion.circle
              variants={circleVariants}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              cx="294.5"
              cy="252.583"
              r="4"
              stroke="white"
              strokeOpacity={0.07 * brightness}
              fill="none"
            />
          </g>

          {/* Animated Geometric Shapes */}
          <motion.rect
            variants={dashVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            x="868.707"
            y="1012.94"
            width="198.404"
            height="198.404"
            transform="rotate(-45 868.707 1012.94)"
            stroke="url(#paint14_angular)"
            fill="none"
            strokeWidth="1"
          />
          <motion.rect
            variants={dashVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            x="868.707"
            y="1012.94"
            width="198.404"
            height="198.404"
            transform="rotate(-45 868.707 1012.94)"
            stroke="url(#paint15_angular)"
            fill="none"
            strokeWidth="1"
          />
          <motion.rect
            variants={dashVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            x="267.707"
            y="385.938"
            width="37.1837"
            height="37.1837"
            transform="rotate(-45 267.707 385.938)"
            stroke="url(#paint16_angular)"
            fill="none"
            strokeWidth="1"
          />
          <motion.path
            variants={dashVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            opacity="0.05"
            d="M1353 462.688L1244.25 462.688L1217.75 436.188H1060.5L1011 386.688"
            stroke="url(#paint17_linear)"
            fill="none"
            strokeWidth="1"
          />
        </g>
      </svg>
    </div>
  )
}

export default AnimatedBackground
