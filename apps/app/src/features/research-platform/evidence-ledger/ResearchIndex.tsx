'use client'

import { Smallcaps, Pill } from '@/features/research-platform/shared'
import type { IndexCategory } from './types'

export interface ResearchIndexProps {
  categories: IndexCategory[]
  filters: string[]
}

export function ResearchIndex({ categories, filters }: ResearchIndexProps) {
  return (
    <aside className="el-side">
      <Smallcaps>Evidence ledger</Smallcaps>
      <h3>Research index</h3>
      <div className="el-tree">
        {categories.map((cat) => (
          <div key={cat.id} className={`el-tree-item ${cat.active ? 'active' : ''}`}>
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
            <b className="el-tree-count">{cat.count}</b>
          </div>
        ))}
      </div>
      <div className="el-tree-divider" />
      <Smallcaps>Active filters</Smallcaps>
      <div className="el-filters">
        {filters.map((filter) => (
          <Pill key={filter}>{filter}</Pill>
        ))}
      </div>
    </aside>
  )
}
