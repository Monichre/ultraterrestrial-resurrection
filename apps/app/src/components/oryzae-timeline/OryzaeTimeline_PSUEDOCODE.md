# OryzaeTimeline — Pseudocode

Port of CodePen memory timeline (floating cards on a vertical spine).

## Layout

```
[ aside 48px ] [ main ]
                 header (title + range nav)
                 scroll (grid bg + center spine + MemoryRows)
                 footer (scroll-top + progress + count)
```

## MemoryRow

```
[ left 50% ] [ dot ] [ right 50% ]

side=left  → FloatCard left, date/label right
side=right → dayLabel left (optional), FloatCard right
hover      → lift+rotate card; undim if dimmed
```

## State

- activeNav: 今日 | 今週 | 今月 | 半年 | 今年
- hovered per row (local)
- scrollRef for scroll-to-top

## Tokens

- void `#1a1a1a`, paper `#e8e8e8`, accent `#4a9e8e`
- fonts: Inter (UI) + Noto Serif JP (body)
