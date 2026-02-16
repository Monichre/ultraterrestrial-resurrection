'use client'

interface PaperDocumentProps {
  title?: string
  paragraphs?: string[]
  emphasizedPhrases?: {text: string; position: number}[]
  signatureName?: string
  signatureTitle?: string
  signatureImageUrl?: string
}

export default function PaperDocument({
  title = 'Introducing Interfere',
  paragraphs = [
    "Software teams spend nearly half of their time fixing what they've built instead of building what's next.",
    'We spend time battling with observability tools that fundamentally miss the mark — instead of understanding experiences, they overwhelm you with logs. Rather than preventing problems, they simply report exceptions after the fact. And most importantly, when you need clarity, they deliver an avalanche of data.',
    "We've professionalized suffering - building entire industries around the assumption that software must break. We've all felt exhausted and burned out context switching to debug mode, but we've convinced ourselves that fundamental to the process – that this is what it takes to build great products.",
    'But why?!',
    'Interfere is building the self-healing layer of the internet - software that sees users struggle, diagnoses the root cause, and ships its own fix before a human can open logs.',
    'Our long-term vision is for Interfere to become the foundational operating system for user experience, replacing existing legacy observability tools entirely, and enabling software that truly understands itself. Each problem we prevent is a step toward our real goal: the freedom to build without the burden of maintaining.',
    "In an age where execution is abundant, we're building the tools to enable the next generation of software to be durable, delightful with craft & taste built-in from day one.",
  ],
  emphasizedPhrases = [
    {text: "We've professionalized suffering", position: 2},
    {text: 'But why?!', position: 3},
  ],
  signatureName = 'Luke S.',
  signatureTitle = 'Founder & CEO, Interfere',
  signatureImageUrl = '/cursive-signature.jpg',
}: PaperDocumentProps) {
  const renderParagraph = (text: string, index: number) => {
    const emphasized = emphasizedPhrases.find((phrase) => phrase.position === index)

    if (emphasized && text.includes(emphasized.text)) {
      const parts = text.split(emphasized.text)
      return (
        <p key={index} className='text-[16px] leading-[28px] text-[#3F444A]'>
          {parts[0]}
          <span className='font-bold text-[#111315]'>{emphasized.text}</span>
          {parts[1]}
        </p>
      )
    }

    return (
      <p key={index} className='text-[16px] leading-[28px] text-[#3F444A]'>
        {text}
      </p>
    )
  }

  return (
    <div className='flex min-h-screen items-start justify-center bg-[#F5F7F9] px-4 py-12 sm:px-0'>
      <section className='relative mb-12 mt-12'>
        {/* Stacked paper effect - Layer 3 (furthest back) */}
        <div
          className='pointer-events-none absolute inset-0 rounded-[12px] bg-white opacity-90'
          style={{
            transform: 'translate(18px, 22px)',
            boxShadow: '18px 22px 0px rgba(0,0,0,0.02)',
          }}
        />

        {/* Stacked paper effect - Layer 2 (middle) */}
        <div
          className='pointer-events-none absolute inset-0 rounded-[12px] bg-white opacity-95'
          style={{
            transform: 'translate(10px, 12px)',
            boxShadow: '10px 12px 0px rgba(0,0,0,0.03)',
          }}
        />

        {/* Main card - Layer 1 */}
        <article
          className='relative mx-auto w-full max-w-[640px] rounded-[12px] bg-white transition-all duration-200 hover:-translate-y-0.5'
          style={{
            boxShadow: '0px 2px 8px rgba(16,24,40,0.06)',
          }}>
          <div className='px-6 pb-11 pt-9 sm:px-10'>
            {/* Title */}
            <h2 className='text-[18px] font-semibold leading-[28px] text-[#111315]'>{title}</h2>

            {/* Divider */}
            <hr className='mb-5 mt-3 border-t border-[#E6E8EB]' />

            {/* Content */}
            <div className='space-y-[18px]'>
              {paragraphs.map((paragraph, index) => renderParagraph(paragraph, index))}
            </div>

            {/* Signature block */}
            <div className='mt-7'>
              <div className='text-[16px] font-semibold leading-[28px] text-[#111315]'>
                {signatureName}
              </div>
              <div className='mt-2 text-[14px] leading-[20px] text-[#6B7280]'>{signatureTitle}</div>
              <img
                className='mt-[18px] h-[28px] w-auto select-none'
                src={signatureImageUrl || '/placeholder.svg'}
                alt={`${signatureName} signature`}
              />
            </div>
          </div>
        </article>
      </section>
    </div>
  )
}

export {PaperDocument}
export type {PaperDocumentProps}
