import type { NoteParagraph, NoteSignature } from './types'

export const DEFAULT_LETTER_PARAGRAPHS: NoteParagraph[] = [
  {
    text: "Software teams spend nearly half of their time fixing what they've built instead of building what's next.",
  },
  {
    text: 'We spend time battling with observability tools that fundamentally miss the mark \u2014 instead of understanding experiences, they overwhelm you with logs. Rather than preventing problems, they simply report exceptions after the fact. And most importantly, when you need clarity, they deliver an avalanche of data.',
  },
  {
    boldPrefix: "We've professionalized suffering",
    text: '\u2014 building entire industries around the assumption that software must break. We\'ve all felt exhausted and burned out context switching to debug mode, but we\'ve convinced ourselves that fundamental to the process \u2014 that this is what it takes to build great products.',
  },
  {
    boldPrefix: 'But why?!',
    text: '',
  },
  {
    text: 'Interfere is building the self-healing layer of the internet \u2014 software that sees users struggle, diagnoses the root cause, and ships its own fix before a human can open logs.',
  },
  {
    text: 'Our long-term vision is for Interfere to become the foundational operating system for user experience, replacing existing legacy observability tools entirely, and enabling software that truly understands itself. Each problem we prevent is a step toward our real goal: the freedom to build without the burden of maintaining.',
  },
  {
    text: "In an age where execution is abundant, we're building the tools to enable the next generation of software to be durable, delightful with craft & taste built-in from day one.",
  },
]

export const DEFAULT_WIDGET_PARAGRAPHS: NoteParagraph[] = [
  {
    text: "Software teams spend nearly half of their time fixing what they've built instead of building what's next.",
  },
  {
    text: 'We spend time battling with observability tools that fundamentally miss the mark — instead of understanding experiences, they overwhelm you with logs. Rather than preventing problems, they simply report exceptions after the fact.',
  },
  {
    boldPrefix: "We've professionalized suffering",
    text: '— building entire industries around the assumption that software must break.',
  },
  { boldPrefix: 'But why?!', text: '' },
  {
    text: 'Interfere is building the self-healing layer of the internet — software that sees users struggle, diagnoses the root cause, and ships its own fix before a human can open logs.',
  },
]

export const DEFAULT_LETTER_SIGNATURE: NoteSignature = {
  name: 'Luke S.',
  title: 'Founder & CEO, Interfere',
}

export const DEFAULT_LETTER_TITLE = 'Introducing Interfere'
