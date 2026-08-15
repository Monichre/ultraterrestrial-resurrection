/**
 * AnimatedMenu Component
 *
 * Full-screen animated menu with clip-path reveals, featured images,
 * and staggered navigation links. Fully configurable and reusable.
 */

'use client'

import {useRef, useState, useCallback, type ReactNode} from 'react'
import gsap from 'gsap'
import {clipPaths, createStaggeredSlide, ANIMATION_CONSTANTS} from '@/lib/animations/gsap-utils'
import {useSplitTextHover} from '@/lib/animations/hooks/use-split-text-hover'

// ============================================================================
// Types
// ============================================================================

export interface MenuItem {
  id: string
  label: string
  href?: string
  onClick?: () => void
}

export interface AnimatedMenuConfig {
  /**
   * Navigation menu items
   */
  items?: MenuItem[]
  /**
   * Featured image URL
   */
  featuredImage?: string
  /**
   * Brand logo (text or component)
   */
  brandLogo?: ReactNode
  /**
   * Footer content
   */
  footer?: ReactNode
  /**
   * Menu button label
   */
  menuButtonLabel?: string
  /**
   * Close button label
   */
  closeButtonLabel?: string
  /**
   * Animation duration
   */
  duration?: number
  /**
   * Stagger delay between items
   */
  stagger?: number
  /**
   * Callback when menu opens
   */
  onOpen?: () => void
  /**
   * Callback when menu closes
   */
  onClose?: () => void
  /**
   * Callback when menu item is clicked
   */
  onItemClick?: (item: MenuItem) => void
  /**
   * Custom className for overlay
   */
  className?: string
}

export interface AnimatedMenuProps extends AnimatedMenuConfig {
  children?: ReactNode
}

// ============================================================================
// Component
// ============================================================================

export function AnimatedMenu({
  items = [],
  featuredImage,
  brandLogo = 'Brand',
  footer,
  menuButtonLabel = 'Menu',
  closeButtonLabel = 'Close',
  duration = ANIMATION_CONSTANTS.DEFAULT_DURATION,
  stagger = ANIMATION_CONSTANTS.STAGGER_DELAY,
  onOpen,
  onClose,
  onItemClick,
  className = '',
  children,
}: AnimatedMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Refs
  const overlayRef = useRef<HTMLDivElement>(null)
  const featuredImageRef = useRef<HTMLDivElement>(null)
  const menuBtnRef = useRef<HTMLButtonElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const primaryNavRef = useRef<HTMLDivElement>(null)

  // Open menu animation
  const openMenu = useCallback(() => {
    if (isAnimating || !overlayRef.current) return
    setIsAnimating(true)
    onOpen?.()

    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false)
        setIsOpen(true)
      },
    })

    // Hide primary nav elements
    if (menuBtnRef.current) {
      tl.to(menuBtnRef.current, {
        y: '-100%',
        duration,
        ease: ANIMATION_CONSTANTS.SLIDE_EASE,
        onComplete: () => {
          if (primaryNavRef.current) {
            primaryNavRef.current.style.pointerEvents = 'none'
          }
          gsap.set(menuBtnRef.current, {y: '100%'})
        },
      })
    }

    // Reveal overlay
    tl.to(
      overlayRef.current,
      {
        clipPath: clipPaths.presets.visible,
        duration,
        ease: ANIMATION_CONSTANTS.SLIDE_EASE,
        onStart: () => {
          if (overlayRef.current) {
            overlayRef.current.style.pointerEvents = 'all'
          }
        },
      },
      '-=0.4'
    )

    // Reveal featured image
    if (featuredImageRef.current && featuredImage) {
      tl.fromTo(
        featuredImageRef.current,
        {
          clipPath: clipPaths.presets.hidden,
        },
        {
          clipPath: clipPaths.presets.visible,
          duration,
          ease: ANIMATION_CONSTANTS.SLIDE_EASE,
        },
        '-=0.2'
      )
    }

    // Animate overlay content
    const overlayBrand = overlayRef.current.querySelector('.overlay-brand')
    const overlayClose = overlayRef.current.querySelector('.overlay-close')
    const navLinks = overlayRef.current.querySelectorAll('.nav-link')
    const footerItems = overlayRef.current.querySelectorAll('.footer-item')

    if (overlayBrand && overlayClose) {
      tl.to(
        [overlayBrand, overlayClose],
        {
          y: '0%',
          duration,
          stagger: 0.1,
          ease: ANIMATION_CONSTANTS.SLIDE_EASE,
        },
        '-=0.3'
      )
    }

    if (navLinks.length > 0) {
      tl.to(
        navLinks,
        {
          y: '0%',
          duration,
          stagger,
          ease: ANIMATION_CONSTANTS.SLIDE_EASE,
        },
        '<'
      )
    }

    if (footerItems.length > 0) {
      tl.to(
        footerItems,
        {
          y: '0%',
          duration,
          stagger: 0.1,
          ease: ANIMATION_CONSTANTS.SLIDE_EASE,
        },
        '<'
      )
    }
  }, [isAnimating, duration, stagger, featuredImage, onOpen])

  // Close menu animation
  const closeMenu = useCallback(() => {
    if (isAnimating || !overlayRef.current) return
    setIsAnimating(true)
    onClose?.()

    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false)
        setIsOpen(false)
        // Reset states
        if (overlayRef.current) {
          gsap.set(overlayRef.current, {
            clipPath: clipPaths.presets.hidden,
          })
        }
        if (featuredImageRef.current) {
          gsap.set(featuredImageRef.current, {
            clipPath: clipPaths.presets.hidden,
          })
        }
      },
    })

    // Hide overlay content
    const overlayBrand = overlayRef.current.querySelector('.overlay-brand')
    const overlayClose = overlayRef.current.querySelector('.overlay-close')
    const navLinks = overlayRef.current.querySelectorAll('.nav-link')
    const footerItems = overlayRef.current.querySelectorAll('.footer-item')

    if (overlayBrand && overlayClose) {
      tl.to([overlayBrand, overlayClose], {
        y: '-100%',
        duration,
        stagger: 0.1,
        ease: ANIMATION_CONSTANTS.SLIDE_EASE,
      })
    }

    if (navLinks.length > 0) {
      tl.to(
        navLinks,
        {
          y: '-100%',
          duration,
          stagger: 0.05,
          ease: ANIMATION_CONSTANTS.SLIDE_EASE,
        },
        '<'
      )
    }

    if (footerItems.length > 0) {
      tl.to(
        footerItems,
        {
          y: '-100%',
          duration,
          stagger: 0.05,
          ease: ANIMATION_CONSTANTS.SLIDE_EASE,
        },
        '<'
      )
    }

    // Hide featured image
    if (featuredImageRef.current && featuredImage) {
      tl.to(
        featuredImageRef.current,
        {
          clipPath: clipPaths.presets.hidden,
          duration,
          ease: ANIMATION_CONSTANTS.SLIDE_EASE,
        },
        '-=0.64'
      )
    }

    // Hide overlay
    tl.to(
      overlayRef.current,
      {
        clipPath: clipPaths.presets.hiddenTop,
        duration,
        ease: ANIMATION_CONSTANTS.SLIDE_EASE,
        onComplete: () => {
          if (overlayRef.current) {
            overlayRef.current.style.pointerEvents = 'none'
          }
        },
      },
      '+=0.2'
    )

    // Show primary nav
    if (menuBtnRef.current) {
      tl.to(
        menuBtnRef.current,
        {
          y: '0%',
          duration,
          stagger: 0.1,
          ease: ANIMATION_CONSTANTS.SLIDE_EASE,
          onStart: () => {
            if (primaryNavRef.current) {
              primaryNavRef.current.style.pointerEvents = 'all'
            }
          },
        },
        '-=0.3'
      )
    }
  }, [isAnimating, duration, featuredImage, onClose])

  // Handle menu item click
  const handleItemClick = useCallback(
    (item: MenuItem) => {
      item.onClick?.()
      onItemClick?.(item)
      closeMenu()
    },
    [onItemClick, closeMenu]
  )

  return (
    <>
      {/* Primary Navigation */}
      <div ref={primaryNavRef} className='primary-nav'>
        {children}
        <button
          ref={menuBtnRef}
          onClick={openMenu}
          className='menu-btn'
          style={{
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            zIndex: 100,
          }}>
          {menuButtonLabel}
        </button>
      </div>

      {/* Overlay Menu */}
      <div
        ref={overlayRef}
        className={`animated-menu-overlay ${className}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 200,
          backgroundColor: '#000',
          clipPath: clipPaths.presets.hidden,
          pointerEvents: 'none',
        }}>
        {/* Featured Image */}
        {featuredImage && (
          <div
            ref={featuredImageRef}
            className='featured-image'
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${featuredImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              clipPath: clipPaths.presets.hidden,
              opacity: 0.3,
            }}
          />
        )}

        {/* Overlay Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '2rem',
          }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <div className='overlay-brand' style={{transform: 'translateY(100%)'}}>
              {brandLogo}
            </div>
            <button
              ref={closeBtnRef}
              onClick={closeMenu}
              className='overlay-close'
              style={{transform: 'translateY(100%)'}}>
              {closeButtonLabel}
            </button>
          </div>

          {/* Navigation Links */}
          <nav
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '2rem',
            }}>
            {items.map((item) => (
              <NavLink key={item.id} item={item} onClick={() => handleItemClick(item)} />
            ))}
          </nav>

          {/* Footer */}
          {footer && (
            <div className='overlay-footer'>
              <div className='footer-item' style={{transform: 'translateY(100%)'}}>
                {footer}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ============================================================================
// NavLink Sub-component
// ============================================================================

function NavLink({item, onClick}: {item: MenuItem; onClick: () => void}) {
  const {textRef} = useSplitTextHover({
    xOffset: 0.5,
    stagger: 0.015,
  })

  return (
    <a
      ref={textRef as React.RefObject<HTMLAnchorElement>}
      href={item.href || '#'}
      onClick={(e) => {
        e.preventDefault()
        onClick()
      }}
      className='nav-link'
      style={{
        fontSize: '3rem',
        color: '#fff',
        textDecoration: 'none',
        transform: 'translateY(100%)',
        overflow: 'hidden',
      }}>
      {item.label}
    </a>
  )
}
