# LittleBook — Pseudocode

Port of jh3y ExPVzBY (GSAP ScrollTrigger book).

```
root.height = (pageCount + 2) * 25vh
book = fixed, center, scale 0.5 → 1 over first scroll segment

for each sheet index i (except last/back cover):
  scrub rotateY -= (180 - i/2) over scroll segment i+1 → i+2
  scrub z from stacked → flipped over segment i+1 → i+1.5

logo opacity 0 → 1 near end (13.5–14 × pageScroll)
click = open linked CodePen on each sketch face
```
