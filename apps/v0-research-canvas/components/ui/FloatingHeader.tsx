"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Search, User, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"

export function FloatingHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: "Timeline Explorer" },
    { href: "/ufo-sightings", label: "Sightings Database" },
    { href: "/search-and-discovery-interface", label: "Search" },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-gray-900/95 backdrop-blur-md shadow-lg shadow-black/20" : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 p-[2px]">
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                <Globe className="w-5 h-5 text-cyan-400 group-hover:animate-pulse" />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent hidden sm:block">
              UFO Network
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <Link
              href="/search-and-discovery-interface"
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-300 hidden sm:block">{user?.name}</span>
                <button onClick={logout} className="text-sm text-gray-400 hover:text-white transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition-colors text-sm"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:block">Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-gray-800">
          <nav className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

export default FloatingHeader
