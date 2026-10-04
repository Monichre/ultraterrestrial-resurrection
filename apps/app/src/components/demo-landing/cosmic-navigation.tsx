'use client'

import Link from 'next/link'
import {useState} from 'react'
import {Menu, X} from 'lucide-react'

export function CosmicNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    {label: 'COSMIC PORTAL', href: '/demo/cosmic-portal'},
    {label: 'METEOR SHOWCASE', href: '/demo/meteor-showcase'},
    {label: 'MORPHING METEOR', href: '/demo/morphing-meteor'},
    {label: 'TRIGGERED 3D', href: '/demo/triggered-3d-meteor'},
    {label: 'TRIGGERED METEOR', href: '/demo/triggered-meteor'},
  ]

  return (
    <nav className='absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6 md:p-8'>
      {/* Logo/Brand - Links back to main demo page */}
      <div className='flex items-center'>
        <Link
          href='/demo'
          className='h-8 w-8 rounded-full bg-white opacity-80 flex items-center justify-center hover:opacity-100 transition-opacity duration-300'>
          <div className='h-4 w-4 rounded-full bg-slate-900'></div>
        </Link>
      </div>

      {/* Desktop Navigation Links */}
      <div className='hidden md:flex items-center space-x-8'>
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className='cosmic-nav-item text-white/80 hover:text-white text-sm font-light tracking-wider transition-colors duration-300'>
            {item.label}
          </Link>
        ))}
      </div>

      {/* Desktop Back to Main Site Button */}
      <div className='hidden md:block'>
        <Link
          href='/'
          className='text-white/80 hover:text-white text-sm font-light tracking-wider transition-colors duration-300'>
          BACK TO SITE
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <div className='md:hidden'>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className='text-white/80 hover:text-white transition-colors duration-300'>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='absolute top-full left-0 right-0 bg-black/90 backdrop-blur-md md:hidden'>
          <div className='flex flex-col space-y-4 p-6'>
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className='text-white/80 hover:text-white text-sm font-light tracking-wider transition-colors duration-300'>
                {item.label}
              </Link>
            ))}
            <div className='border-t border-white/20 pt-4'>
              <Link
                href='/'
                onClick={() => setIsMobileMenuOpen(false)}
                className='text-white/80 hover:text-white text-sm font-light tracking-wider transition-colors duration-300'>
                BACK TO SITE
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
