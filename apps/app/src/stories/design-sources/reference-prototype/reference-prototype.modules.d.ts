declare module '@reference/components/DocumentFrame' {
  interface DocumentFrameProps {
    children: import('react').ReactNode
    className?: string
  }

  export const DocumentFrame: import('react').ComponentType<DocumentFrameProps>
}

declare module '@reference/components/DocumentOne' {
  interface DocumentOneProps {
    header?: {
      title?: string
      subtitle?: string
      reference?: string
      classification?: string
    }
    metadata?: Record<string, string>
    footer?: Record<string, unknown>
  }

  export const DocumentOne: import('react').ComponentType<DocumentOneProps>
}

declare module '@reference/components/DocumentA' {
  interface DocumentAProps {
    header?: {title?: string; subtitle?: string; pageNumber?: string}
    mainImage?: {src?: string; alt?: string}
    sidebar?: Record<string, unknown>
    footer?: {transcription?: string; codeReference?: string}
  }

  export const DocumentA: import('react').ComponentType<DocumentAProps>
}

declare module '@reference/components/DocumentB' {
  interface DocumentBProps {
    header?: {title?: string; subtitle?: string; indexNumber?: string; codeNumber?: string}
    images?: Record<string, {src?: string; alt?: string}>
    footer?: {caseReference?: string; specimen?: string}
  }

  export const DocumentB: import('react').ComponentType<DocumentBProps>
}

declare module '@reference/components/classified-documents/ClassifiedDocument' {
  interface ClassifiedDocumentSection {
    type: 'text' | 'image' | 'header' | 'stamp'
    data: Record<string, unknown>
  }

  interface ClassifiedDocumentItem {
    title?: string
    content?: ClassifiedDocumentSection[]
    rotation?: number
  }

  interface ClassifiedDocumentProps {
    documents?: ClassifiedDocumentItem[]
  }

  export const ClassifiedDocument: import('react').ComponentType<ClassifiedDocumentProps>
}

declare module '@reference/components/classified-documents/UFODocument' {
  interface UfoDocumentProps {
    title?: string
    subtitle?: string
    reference?: string
    idPhoto?: string
    creatureSketch?: string
    metadata?: string[][]
    listItems?: Array<{letter: string; text: string}>
    stampText?: string
    legalText?: string
  }

  export const UFODocument: import('react').ComponentType<UfoDocumentProps>
}

declare module '@reference/components/classified-documents/UFODispatchDocument' {
  interface UfoDispatchDocumentProps {
    incident?: {title?: string; subtitle?: string; date?: string}
    dispatch?: {reference?: string; calls?: Array<{time: string; message: string}>}
    photo?: {src?: string; alt?: string}
    handwrittenNotes?: Array<{
      text: string
      position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
      rotation?: number
      color?: string
    }>
    classification?: {text?: string; rotation?: number}
  }

  const UFODispatchDocument: import('react').ComponentType<UfoDispatchDocumentProps>
  export default UFODispatchDocument
}

declare module '@reference/components/classified-documents/WeatheredClassifiedDocument' {
  interface WeatheredClassifiedDocumentProps {
    showNavigation?: boolean
    incident?: {title?: string; subtitle?: string}
    dispatch?: {reference?: string; calls?: Array<{time: string; message: string}>}
    photo?: {src?: string; alt?: string}
    handwrittenNotes?: Array<{
      text: string
      position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
      rotation?: number
      color?: string
    }>
    classification?: {text?: string; rotation?: number}
    photoCaption?: {labelTop?: string; captionNote?: string}
  }

  export const WeatheredClassifiedDocument: import('react').ComponentType<WeatheredClassifiedDocumentProps>
}

declare module '@reference/components/layouts/DocumentShowcase' {
  export const DocumentShowcase: import('react').ComponentType<Record<string, never>>
}

declare module '@reference/components/layouts/MixedDocumentLayout' {
  type DocumentType =
    | 'document-one'
    | 'document-a'
    | 'document-b'
    | 'poster-a'
    | 'poster-b'
    | 'poster-c'
    | 'poster-d'

  interface MixedDocumentLayoutProps {
    variant?: 'stacked' | 'grid' | 'alternating' | 'archive'
    documents?: Array<{type: DocumentType; props?: Record<string, unknown>; transform?: string}>
  }

  export const MixedDocumentLayout: import('react').ComponentType<MixedDocumentLayoutProps>
}

declare module '@reference/components/layouts/ResponsiveDocumentGrid' {
  export const ResponsiveDocumentGrid: import('react').ComponentType<{className?: string}>
}

declare module '@reference/components/ui/PhotoCaption' {
  interface PhotoCaptionProps {
    labelTop: string
    captionNote: string
    className?: string
  }

  export const PhotoCaption: import('react').ComponentType<PhotoCaptionProps>
}

declare module '@reference/components/vintage-posters/VintagePosterA' {
  interface VintagePosterAProps {
    pageTitleLine1?: string
    pageTitleLine2?: string
    stampCode?: string
    dateCode?: string
    heroImage?: string
    insetImage?: string
    insetCaption?: string
    rightRail1?: string
    rightRail2?: string
    rightRail3?: string
    ledgerParagraphs?: string
  }

  export const VintagePosterA: import('react').ComponentType<VintagePosterAProps>
}

declare module '@reference/components/vintage-posters/VintagePosterB' {
  interface VintagePosterBProps {
    titleISTA?: string
    subtitleISTA?: string
    verticalTitle?: string
    heroImage?: string
    bottomNumber?: string
  }

  export const VintagePosterB: import('react').ComponentType<VintagePosterBProps>
}

declare module '@reference/components/vintage-posters/VintagePosterC' {
  interface VintagePosterCProps {
    headerLeft?: string
    headerRight?: string
    heroImage?: string
    signature?: string
  }

  export const VintagePosterC: import('react').ComponentType<VintagePosterCProps>
}

declare module '@reference/components/vintage-posters/VintagePosterD' {
  interface VintagePosterDProps {
    title?: string
    avatar?: string
    avatarLabel?: string
    heroImage?: string
    colA?: string
    colB?: string
    colC?: string
    stampText?: string
  }

  export const VintagePosterD: import('react').ComponentType<VintagePosterDProps>
}
