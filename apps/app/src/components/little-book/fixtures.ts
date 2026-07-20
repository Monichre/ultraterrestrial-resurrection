export interface BookLeaf {
  front: { href: string; src: string; number: number }
  back: { href: string; src: string; number: number }
}

/** Interior leaves — each sheet has a front + back face (20 numbered sides). */
export const BOOK_LEAVES: BookLeaf[] = [
  {
    front: {
      href: 'https://codepen.io/jh3y/full/RwPrOoz',
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/Care-sketch.svg',
      number: 1,
    },
    back: {
      href: 'https://codepen.io/jh3y/full/QWbRxXb',
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/Cubes-sketch.svg',
      number: 2,
    },
  },
  {
    front: {
      href: 'https://codepen.io/jh3y/full/RwraKYZ',
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/Record-sketch.svg',
      number: 3,
    },
    back: {
      href: 'https://codepen.io/jh3y/full/NWqemYK',
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/Moon-sketch.svg',
      number: 4,
    },
  },
  {
    front: {
      href: 'https://codepen.io/jh3y/full/zYGQYWJ',
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/Fireflies-sketch.svg',
      number: 5,
    },
    back: {
      href: 'https://codepen.io/jh3y/full/eYpGQxr',
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/Pokedex-sketch.svg',
      number: 6,
    },
  },
  {
    front: {
      href: 'https://codepen.io/jh3y/full/MWwRKvd',
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/Cloud-sketch.svg',
      number: 7,
    },
    back: {
      href: 'https://codepen.io/jh3y/full/eYpmBxQ',
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/Tcannon-sketch.svg',
      number: 8,
    },
  },
  {
    front: {
      href: 'https://codepen.io/jh3y/full/GRoKOyg',
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/Gun-sketch.svg',
      number: 9,
    },
    back: {
      href: 'https://codepen.io/jh3y/full/jOOYMLm',
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/Matryoshka-sketch.svg',
      number: 10,
    },
  },
  {
    front: {
      href: 'https://codepen.io/jh3y/full/rNOqzbN',
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/Launch-sketch.svg',
      number: 11,
    },
    back: {
      href: 'https://codepen.io/jh3y/full/MWWowEb',
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/Truck-sketch.svg',
      number: 12,
    },
  },
  {
    front: {
      href: 'https://codepen.io/jh3y/full/eYpdPWa',
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/Train-sketch.svg',
      number: 13,
    },
    back: {
      href: 'https://codepen.io/jh3y/full/ZjLKGY',
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/Impossible-sketch.svg',
      number: 14,
    },
  },
  {
    front: {
      href: 'https://codepen.io/jh3y/full/jJVpWZ',
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/Pancake-sketch.svg',
      number: 15,
    },
    back: {
      href: 'https://codepen.io/jh3y/full/RwWMwvY',
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/Elon-sketch.svg',
      number: 16,
    },
  },
  {
    front: {
      href: 'https://codepen.io/jh3y/full/LYpNyvm',
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/Kitkat-sketch.svg',
      number: 17,
    },
    back: {
      href: 'https://codepen.io/jh3y/full/abzeaWJ',
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/Newton-sketch.svg',
      number: 18,
    },
  },
  {
    front: {
      href: 'https://codepen.io/jh3y/full/BaobKOJ',
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/Birthday-sketch.svg',
      number: 19,
    },
    back: {
      href: 'https://codepen.io/jh3y/full/aPzVme',
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/Earth-sketch.svg',
      number: 20,
    },
  },
]

export const LOGO_SRC = 'https://assets.codepen.io/605876/bear-with-cap.svg'
export const LOGO_HREF = 'https://jhey.dev'

/** Cover decoration — snippet from another jhey pen (as in the original CodePen). */
export const COVER_CODE_SNIPPET = `set(FOLD,{transformOrigin:"50% 100%",scaleY:0}),set(CLIPS,{transformOrigin:"50% 0"}),set(".cannon__shirt",{opacity:0}),set(".cannon",{y:28}),set(".text--ordered .char",{y:"100%"});const SPEED=.15,FOLD_TL=()=>new timeline().to(LEFT_ARM,{duration:SPEED,rotateY:-180,transformOrigin:\`\${100*(22/65.3)}% 50%\`},0).to(RIGHT_ARM,{duration:SPEED,rotateY:-180,transformOrigin:\`\${100*((65.3-22)/65.3)}% 50%\`},SPEED).to(FOLD,{duration:SPEED/4,scaleY:1},2*SPEED).to(FOLD,{duration:SPEED,y:-47},2*SPEED+.01).to(CLIPS,{duration:SPEED,scaleY:.2},2*SPEED).to(".cannon",{duration:SPEED,y:0},2*SPEED),LOAD_TL=()=>new timeline().to(".button__shirt",{transformOrigin:"50% 13%",rotate:90,duration:.15}).to(".button__shirt",{duration:.15,y:60}).to(".t-shirt__cannon",{y:5,repeat:1,yoyo:!0,duration:.1}).to(".t-shirt__cannon",{y:50,duration:.5,delay:.1}),FIRE_TL=()=>new timeline().set(".t-shirt__cannon",{rotate:48,x:-85,scale:2.5}).set(".cannon__shirt",{opacity:1}).to(".t-shirt__cannon-content",{duration:1,y:-35}).to(".t-shirt__cannon-content",{duration:.25,y:-37.5}).to(".t-shirt__cannon-content",{duration:.015,y:-30.5}).to(".cannon__shirt",{onStart:()=>CLIP.play(),duration:.5,y:"-25vmax"},"<").to(".text--ordered .char",{duration:.15,stagger:.1,y:"0%"}).to("button",{duration:.15*7,"--hue":116,"--lightness":55},"<"),ORDER_TL=new timeline({paused:!0});ORDER_TL.set(".cannon__shirt",{opacity:0}),ORDER_TL.set("button",{"--hue":260,"--lightness":20}),ORDER_TL.to("button",{scale:300/BUTTON.offsetWidth,duration:SPEED}),ORDER_TL.to(".text--order .char",{stagger:.1,y:"100%",duration:.1}),ORDER_TL.to(SHIRT,{x:BUTTON.offsetWidth/2-33,duration:.2}),ORDER_TL.add(FOLD_TL()),ORDER_TL.add(LOAD_TL()),ORDER_TL.add(FIRE_TL()),BUTTON.addEventListener("click",()=>{1===ORDER_TL.progress()?(document.documentElement.style.setProperty("--hue",360*Math.random()),ORDER_TL.time(0),ORDER_TL.pause()):0===ORDER_TL.progress()&&ORDER_TL.play()});`

export const PAGE_COUNT = 20
export const PAGE_SCROLL_VH = 25
