'use client'

import {useEffect, useRef} from 'react'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass'
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import ScrollToPlugin from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

export default function Experience({years}: {years: number[]}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x000000, -800, 800)

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = false
    controls.minPolarAngle = Math.PI / 4
    controls.maxPolarAngle = Math.PI / 2
    controls.enablePan = false
    controls.enableZoom = false
    controls.minAzimuthAngle = -Math.PI / 4
    controls.maxAzimuthAngle = Math.PI / 4
    controls.minDistance = 1
    controls.maxDistance = 70

    // Path setup
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(5, -5, 100),
      new THREE.Vector3(20, 0, 200),
      new THREE.Vector3(30, -10, 300),
      new THREE.Vector3(0, 0, 400),
      new THREE.Vector3(5, 5, 500),
      new THREE.Vector3(-5, 5, 600),
      new THREE.Vector3(5, -5, 700),
    ]
    const path = new THREE.CatmullRomCurve3(points)

    // Initial camera position
    const initialPoint = path.getPointAt(0)
    const initialLookAtPoint = path.getPointAt(0.01)
    camera.position.copy(initialPoint)
    camera.lookAt(initialLookAtPoint)

    // Post-processing setup
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    // Bloom pass
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    )
    bloomPass.threshold = 0
    bloomPass.strength = 0.7
    bloomPass.radius = 0
    composer.addPass(bloomPass)

    // Noise pass
    const noisePass = new ShaderPass({
      uniforms: {
        tDiffuse: {value: null},
        amount: {value: 0.05},
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float amount;
        varying vec2 vUv;
        float rand(vec2 co) {
          return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
        }
        void main() {
          vec4 color = texture2D(tDiffuse, vUv);
          float noise = rand(gl_FragCoord.xy) * amount;
          gl_FragColor = vec4(color.rgb + noise, color.a);
        }
      `,
    })
    composer.addPass(noisePass)

    // Tube geometry
    const tubeGeometry = new THREE.TubeGeometry(path, 200, 10, 20, false)
    const tubeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      roughness: 0.5,
      metalness: 0.1,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    })
    const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial)
    scene.add(tubeMesh)

    // Particles
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 500000
    const positions = new Float32Array(particlesCount * 3)
    for (let i = 0; i < particlesCount * 3; i += 3) {
      positions[i] = Math.random() * 500 - 250
      positions[i + 1] = Math.random() * 500 - 250
      positions[i + 2] = Math.random() * 2000 - 1000
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      blending: THREE.AdditiveBlending,
    })
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    // Text creation function
    function createTextOnPath(
      text: string,
      pathPosition: number,
      scale = 1,
      color = 0xffffff,
      size = 2,
      posX = 0,
      posY = 0,
      posZ = 0
    ) {
      const loader = new FontLoader()
      loader.load(
        'https://raw.githubusercontent.com/vainsan/assets/main/FFF_Galaxy_Regular.json',
        (font) => {
          const textGeometry = new TextGeometry(text, {
            font: font,
            size: size,
            height: 0.3,
            curveSegments: 2,
            bevelEnabled: true,
            bevelThickness: 0.0,
            bevelSize: 0.0,
            bevelOffset: 0,
            bevelSegments: 0,
          })
          const textMaterial = new THREE.MeshBasicMaterial({
            color: color,
            wireframe: false,
          })
          const textMesh = new THREE.Mesh(textGeometry, textMaterial)

          textGeometry.computeBoundingBox()
          const boundingBox = textGeometry.boundingBox!
          const centerX = (boundingBox.max.x - boundingBox.min.x) / 2
          const centerY = (boundingBox.max.y - boundingBox.min.y) / 2
          const centerZ = (boundingBox.max.z - boundingBox.min.z) / 2
          textMesh.position.set(-centerX, -centerY, -centerZ)

          const textPosition = path.getPointAt(pathPosition)
          textPosition.x += posX
          textPosition.y += posY
          textPosition.z += posZ

          const groupText = new THREE.Group()
          groupText.scale.set(scale, scale, scale)
          groupText.position.copy(textPosition)
          groupText.lookAt(camera.position)
          groupText.add(textMesh)
          scene.add(groupText)
        }
      )
    }

    // Create section texts
    createTextOnPath('Section 1', 0.01, 0.5, 0xffffff, 1)
    createTextOnPath('Section 2', 0.26, 0.5, 0xffffff, 1)
    createTextOnPath('Section 3', 0.51, 0.5, 0xffffff, 1)
    createTextOnPath('Section 4', 0.76, 0.5, 0xffffff, 1)
    createTextOnPath('Section 5', 0.98, 0.5, 0xffffff, 1)

    // Create year texts

    years.forEach((year, index) => {
      createTextOnPath(year.toString(), index * (1 / years.length), 0.1, 0xffffff, 2, -4, 0)
    })

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)
    const pointLight = new THREE.PointLight(0xffffff, 1, 100)
    pointLight.position.set(50, 50, 50)
    scene.add(pointLight)

    // Menu underline animation
    const menuLinks = document.querySelectorAll('menu ul li a')
    const underline = document.getElementById('underline')

    function updateUnderline(target: Element) {
      const linkRect = target.getBoundingClientRect()
      const menuRect = target.closest('menu')?.getBoundingClientRect()

      if (underline && menuRect) {
        gsap.to(underline, {
          duration: 1,
          width: linkRect.width,
          left: linkRect.left - menuRect.left,
        })
      }
    }

    menuLinks.forEach((link) => {
      link.addEventListener('click', function (e) {
        e.preventDefault()
        const targetId = this.getAttribute('href')
        if (targetId) {
          gsap.to(window, {
            duration: 1,
            scrollTo: targetId,
            onStart: () => {
              updateUnderline(this)
            },
          })
        }
      })
    })

    // Initialize underline position
    if (menuLinks.length > 0) {
      updateUnderline(menuLinks[0])
    }

    // Animation
    const colors = ['#000', '#000', '#000', '#000', '#000']
    gsap.timeline({
      scrollTrigger: {
        trigger: '.scrollTarget',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        markers: false,
        snap: {
          snapTo: 'section',
          duration: {min: 0.4, max: 0.8},
          ease: 'circ.inOut',
        },
        onUpdate: (self) => {
          const progress = self.progress
          const newPath = path.getPointAt(progress)
          camera.position.set(newPath.x, newPath.y, newPath.z)
          const lookAtPoint = path.getPointAt((progress + 0.01) % 1)
          camera.lookAt(lookAtPoint)

          const colorIndex = Math.floor(progress * (colors.length - 1))
          const colorProgress = (progress * (colors.length - 1)) % 1
          const startColor = new THREE.Color(colors[colorIndex])
          const endColor = new THREE.Color(colors[colorIndex + 1])
          const interpolatedColor = startColor.clone().lerp(endColor, colorProgress)
          renderer.setClearColor(interpolatedColor)
        },
      },
    })

    // Animation loop
    function animate() {
      requestAnimationFrame(animate)
      composer.render()
      particles.rotation.z += 0.0008
    }
    animate()

    // Resize handler
    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      composer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className='experience' />
}
