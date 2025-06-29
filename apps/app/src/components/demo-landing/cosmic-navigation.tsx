'use client'

export function CosmicNavigation() {
  const navItems = [
    {label: 'CREATIVE JOURNEY', href: '#creative'},
    {label: 'ABOUT', href: '#about'},
    {label: 'SOUND', href: '#sound'},
  ]

  return (
    <nav className='absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6 md:p-8'>
      {/* Logo/Brand */}
      <div className='flex items-center'>
        <div className='h-8 w-8 rounded-full bg-white opacity-80 flex items-center justify-center'>
          <div className='h-4 w-4 rounded-full bg-slate-900'></div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className='hidden md:flex items-center space-x-8'>
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className='cosmic-nav-item text-white/80 hover:text-white text-sm font-light tracking-wider transition-colors duration-300'>
            {item.label}
          </a>
        ))}
      </div>

      {/* Connect Button */}
      <div className='hidden md:block'>
        <button className='text-white/80 hover:text-white text-sm font-light tracking-wider transition-colors duration-300'>
          CONNECT
        </button>
      </div>
    </nav>
  )
}
