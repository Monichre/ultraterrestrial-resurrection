/*
Adapted from Cojeev Motion Drawer (stack variant):
https://github.com/luv-jeri/cojeev-ui
MIT License

Copyright (c) 2026 Sanjay Kumar
Copyright (c) 2024 UI LAYOUT

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
/** One continuous outline owns both the folder handle and its content surface. */
export function stackOutline(
  width: number,
  height: number,
  index: number,
  count: number,
  tabHeight: number,
) {
  const w = Math.max(1, width),
    h = Math.max(tabHeight + 40, height)
  const start = (index * w) / count,
    end = ((index + 1) * w) / count
  const r = Math.min(12, w / count / 4),
    shoulder = Math.min(8, w / count / 8)
  const body = 20,
    y = tabHeight
  const path = [`M ${start + r} 0`, `H ${end - r}`, `Q ${end} 0 ${end} ${r}`]
  if (index < count - 1)
    path.push(
      `V ${y - shoulder}`,
      `Q ${end} ${y} ${end + shoulder} ${y}`,
      `H ${w - body}`,
      `Q ${w} ${y} ${w} ${y + body}`,
    )
  path.push(
    `V ${h - body}`,
    `Q ${w} ${h} ${w - body} ${h}`,
    `H ${body}`,
    `Q 0 ${h} 0 ${h - body}`,
  )
  if (index > 0)
    path.push(
      `V ${y + body}`,
      `Q 0 ${y} ${body} ${y}`,
      `H ${start - shoulder}`,
      `Q ${start} ${y} ${start} ${y - shoulder}`,
    )
  path.push(`V ${r}`, `Q ${start} 0 ${start + r} 0`, 'Z')
  return path.join(' ')
}
