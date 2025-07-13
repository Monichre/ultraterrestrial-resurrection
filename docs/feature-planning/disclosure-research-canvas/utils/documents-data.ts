// This file handles loading and parsing the documents.csv data

export interface DocumentFile {
  id: string
  title: string
  type: string // document, image, video, attachment
  classification: "top-secret" | "secret" | "confidential" | "restricted" | "unclassified"
  dateCreated: string
  author: string
  description: string
  content?: string
  url?: string
  thumbnail?: string
  duration?: string
  fileSize?: string
  fileType?: string
  tags?: string[]
  relatedDocuments?: string[]
  caseFiles?: string[]
  locations?: string[]
  entities?: string[]
}

// Mock CSV data structure (would normally be loaded from a CSV file)
const csvData = `id,title,type,classification,dateCreated,author,description,content,url,thumbnail,duration,fileSize,fileType,tags,relatedDocuments,caseFiles,locations,entities
DOC-2023-0472,Analysis of Recovered Non-Terrestrial Materials,document,top-secret,2023-03-15T14:22:18Z,Dr. Eleanor Richards,Detailed analysis of recovered materials from the Nevada incident,CLASSIFIED - TOP SECRET...,,,,,,"non-terrestrial,materials,recovery,analysis,quantum properties","DOC-2023-0468,DOC-2022-1794,DOC-1997-0053","CF-2023-NV-17,CF-1997-AZ-08","Area [REDACTED] Nevada,White Sands New Mexico","Advanced Materials Division,Quantum Physics Research Group,Special Access Program BLUESHIFT"
DOC-2023-0468,Quantum Signature Analysis Protocol,document,classified,2023-02-28T09:45:32Z,Dr. Samantha Wong,Protocol for analyzing quantum signatures in recovered materials,CLASSIFIED...,,,,,,"quantum,protocol,analysis,methodology","DOC-2023-0472,DOC-2022-1794","CF-2023-NV-17","Quantum Research Facility,Area [REDACTED]","Quantum Physics Research Group,Advanced Materials Division"
DOC-2022-1794,Historical Recovery Operations (1947-2022),document,secret,2022-11-12T16:30:45Z,Dr. James Martinez,Comprehensive timeline of material recovery operations,SECRET...,,,,,,"historical,recovery,timeline,operations","DOC-2023-0472,DOC-2023-0468,DOC-1997-0053","CF-1997-AZ-08,CF-1947-NM-01","Roswell NM,White Sands NM,Area [REDACTED] NV","Historical Archives Division,Special Access Program BLUESHIFT"
IMG-001,Sample A-7: Metallic alloy fragment,image,secret,2023-03-10T11:22:18Z,Dr. Eleanor Richards,Metallic alloy fragment under electron microscope (10000x),,/placeholder.svg?height=400&width=600,,,,,,"materials,metallurgy,microscopy","DOC-2023-0472","CF-2023-NV-17","Area [REDACTED] Nevada","Advanced Materials Division"
IMG-002,Sample B-3: Crystalline structure,image,top-secret,2023-03-11T14:35:22Z,Dr. Eleanor Richards,Crystalline structure with variable opacity demonstration,,/placeholder.svg?height=400&width=600,,,,,,"materials,crystalline,opacity","DOC-2023-0472","CF-2023-NV-17","Area [REDACTED] Nevada","Advanced Materials Division"
IMG-003,Sample C-9: Fibrous material,image,top-secret,2023-03-12T09:17:45Z,Dr. Eleanor Richards,Fibrous material electromagnetic response patterns,,/placeholder.svg?height=400&width=600,,,,,,"materials,fibrous,electromagnetic","DOC-2023-0472","CF-2023-NV-17","Area [REDACTED] Nevada","Advanced Materials Division"
VID-001,Material Response to Electromagnetic Stimulation,video,top-secret,2023-03-14T16:42:33Z,Dr. Eleanor Richards,Video evidence of material properties,,https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ufo-1jJUvwOYkfeEGPWOUBlifMvVjvyxBs.mp4,/placeholder.svg?height=300&width=500,02:47,,,"materials,response,electromagnetic,video","DOC-2023-0472","CF-2023-NV-17","Area [REDACTED] Nevada","Advanced Materials Division,Quantum Physics Research Group"
VID-002,ufo.mp4,video,top-secret,2023-03-15T10:18:27Z,Dr. James Martinez,Unidentified aerial phenomenon captured during field operation,,https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ufo-1jJUvwOYkfeEGPWOUBlifMvVjvyxBs.mp4,/placeholder.svg?height=300&width=500,01:23,,,"ufo,aerial,phenomenon,field operation","DOC-2022-1794","CF-2023-NV-17","White Sands New Mexico","Field Operations Division"
ATT-001,spectroscopic-analysis.pdf,attachment,secret,2023-03-13T14:22:18Z,Dr. Eleanor Richards,Detailed spectroscopic analysis of recovered materials,,,,,,4.2 MB,application/pdf,"spectroscopy,analysis,materials","DOC-2023-0472","CF-2023-NV-17","Area [REDACTED] Nevada","Advanced Materials Division"
ATT-002,quantum-behavior-data.xlsx,attachment,top-secret,2023-03-14T11:45:32Z,Dr. Samantha Wong,Quantum behavior observations and measurements,,,,,,1.8 MB,application/xlsx,"quantum,behavior,data,measurements","DOC-2023-0472,DOC-2023-0468","CF-2023-NV-17","Quantum Research Facility","Quantum Physics Research Group"`

// Parse CSV data
export function parseCSV(csv: string): DocumentFile[] {
  const lines = csv.split("\n")
  const headers = lines[0].split(",")

  return lines.slice(1).map((line) => {
    const values = line.split(",")
    const document: any = {}

    headers.forEach((header, index) => {
      const value = values[index] || ""

      // Handle arrays
      if (
        header === "tags" ||
        header === "relatedDocuments" ||
        header === "caseFiles" ||
        header === "locations" ||
        header === "entities"
      ) {
        document[header] = value ? value.split(";") : []
      } else {
        document[header] = value
      }
    })

    return document as DocumentFile
  })
}

// Get all documents
export function getAllDocuments(): DocumentFile[] {
  return parseCSV(csvData)
}

// Get document by ID
export function getDocumentById(id: string): DocumentFile | undefined {
  return getAllDocuments().find((doc) => doc.id === id)
}

// Get documents by type
export function getDocumentsByType(type: string): DocumentFile[] {
  return getAllDocuments().filter((doc) => doc.type === type)
}

// Get documents by classification
export function getDocumentsByClassification(classification: string): DocumentFile[] {
  return getAllDocuments().filter((doc) => doc.classification === classification)
}

// Get related documents
export function getRelatedDocuments(documentId: string): DocumentFile[] {
  const document = getDocumentById(documentId)
  if (!document || !document.relatedDocuments) return []

  return document.relatedDocuments.map((id) => getDocumentById(id)).filter(Boolean) as DocumentFile[]
}

// Search documents
export function searchDocuments(query: string): DocumentFile[] {
  query = query.toLowerCase()
  return getAllDocuments().filter(
    (doc) =>
      doc.title.toLowerCase().includes(query) ||
      doc.description.toLowerCase().includes(query) ||
      doc.author.toLowerCase().includes(query) ||
      (doc.tags && doc.tags.some((tag) => tag.toLowerCase().includes(query))),
  )
}

// Mock document content (would normally be loaded from separate files)
export function getDocumentContent(documentId: string): string {
  if (documentId === "DOC-2023-0472") {
    return `CLASSIFIED - TOP SECRET

SUBJECT: Analysis of Recovered Non-Terrestrial Materials

LOCATION: [REDACTED], Nevada
DATE: March 12, 2023

1. EXECUTIVE SUMMARY

This report details the preliminary analysis of material samples recovered from the [REDACTED] incident on January 17, 2023. The materials exhibit properties inconsistent with known terrestrial manufacturing capabilities and demonstrate anomalous behaviors under specific testing conditions.

2. SAMPLE DESCRIPTION

Sample A-7: Metallic alloy fragment, approximately 15cm x 8cm x 0.3cm
Sample B-3: Crystalline structure, translucent with variable opacity
Sample C-9: Fibrous material with unusual electromagnetic properties

3. ANALYSIS RESULTS

3.1 Metallurgical Analysis (Sample A-7)

The alloy contains elements consistent with the lanthanide series but structured in a crystalline lattice formation previously undocumented in terrestrial metallurgy. Electron microscopy reveals no evidence of conventional manufacturing processes (casting, forging, machining, etc.).

The material demonstrates the following anomalous properties:
- Self-healing capabilities when subjected to minor structural damage
- Variable thermal conductivity dependent on ambient electromagnetic fields
- Unusual isotopic ratios inconsistent with terrestrial or known meteoritic sources

3.2 Crystalline Analysis (Sample B-3)

[CONTENT REDACTED BY ORDER OF SPECIAL ACCESS PROGRAM OVERSIGHT]

3.3 Fibrous Material Analysis (Sample C-9)

The fibrous material demonstrates properties consistent with a quantum-entangled communication medium. When stimulated with specific electromagnetic frequencies, the material produces modulated responses that appear to contain encoded information.

Attempts to decode this information are ongoing, but preliminary analysis suggests:
- Non-binary encoding system
- Possible temporal components to the information structure
- Evidence of artificial origin rather than natural formation

4. CONCLUSIONS

The materials recovered from the [REDACTED] incident demonstrate technologies significantly beyond current human manufacturing capabilities. The isotopic composition strongly suggests non-terrestrial origin, while the functional properties indicate deliberate engineering rather than natural formation.

5. RECOMMENDATIONS

- Continue analysis under Secure Compartmented Information protocols
- Expand research team to include quantum computing specialists
- Initiate comparative analysis with samples recovered from [REDACTED] incident (1997)
- Maintain COSMIC TOP SECRET classification until further notice

APPENDICES:
A: Detailed spectroscopic analysis
B: Quantum behavior observations
C: Comparison with known terrestrial materials
D: Personnel access list`
  }

  if (documentId === "DOC-2023-0468") {
    return `CLASSIFIED

QUANTUM SIGNATURE ANALYSIS PROTOCOL
Version 2.3
Last Updated: February 28, 2023

PREPARED BY: Dr. Samantha Wong
Quantum Physics Research Group

1. INTRODUCTION

This protocol outlines the standardized procedures for analyzing quantum signatures in recovered materials of potential non-terrestrial origin. The methodology described herein has been developed based on findings from previous recovery operations and represents the current best practices for identifying and characterizing quantum-level anomalies.

2. EQUIPMENT REQUIREMENTS

- Quantum Coherence Scanner (QCS-7)
- Entanglement Measurement Array (EMA-3)
- Superconducting Quantum Interference Device (SQUID)
- Custom-modified Scanning Tunneling Microscope
- Quantum Computing Cluster (minimum 512 qubits)
- Faraday-shielded laboratory environment

3. SAMPLE PREPARATION

[CONTENT CONTINUES...]`
  }

  if (documentId === "DOC-2022-1794") {
    return `SECRET

HISTORICAL RECOVERY OPERATIONS (1947-2022)
COMPREHENSIVE TIMELINE AND ANALYSIS

PREPARED BY: Dr. James Martinez
Historical Archives Division

1. INTRODUCTION

This document presents a comprehensive timeline of material recovery operations conducted between 1947 and 2022. It consolidates information from multiple classified programs and provides context for current research initiatives. All information contained herein is classified SECRET or above.

2. EARLY RECOVERY OPERATIONS (1947-1960)

2.1 Roswell Incident (1947)
- Date: July 7, 1947
- Location: Roswell, New Mexico
- Materials Recovered: Metallic debris with unusual properties
- Initial Analysis: Materials exhibited extreme lightweight properties and "memory" characteristics
- Disposition: Materials transferred to Wright Field (later Wright-Patterson AFB)

2.2 Operation BLUE BOOK (1952-1969)
- Established as public-facing investigation while actual recovery operations continued under separate classification
- Served as cover for multiple recovery operations during this period

[CONTENT CONTINUES...]`
  }

  return "Document content not available."
}
