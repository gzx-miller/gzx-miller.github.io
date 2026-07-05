import type { Component } from 'vue'

export interface KnowledgeCategory {
  id: string
  name: string
  path: string
  status: 'ready' | 'planned'
  intro?: string
  officialUrl?: string
}

export interface Lesson {
  id: string
  title: string
  navTitle: string
  category: string
  path: string
  summary: string
  demo?: Component
  code?: () => Promise<string>
  language?: string
  principle: string
  flow: string[]
  notes: string[]
  problem: string
}
