"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, FileText, Calendar, User, Filter, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Document {
  id: string
  title: string
  date: string
  author: string
  classification: "top-secret" | "classified" | "confidential"
  tags: string[]
  summary: string
}

const documents: Document[] = [
  {
    id: "DOC-7A-X119",
    title: "Analysis of Quantum Signature Anomalies in Sector 7",
    date: "2077-03-15",
    author: "Dr. Eleanor Richards",
    classification: "top-secret",
    tags: ["quantum", "anomaly", "sector-7"],
    summary:
      "Detailed analysis of quantum signature patterns detected during the Operation Stardust mission. Evidence suggests non-terrestrial technology origin.",
  },
  {
    id: "DOC-7B-X120",
    title: "Temporal Distortion Field Reports - Operation Stardust",
    date: "2077-03-14",
    author: "Agent Thomas Smith",
    classification: "classified",
    tags: ["temporal", "distortion", "operation-stardust"],
    summary:
      "Field reports documenting temporal anomalies experienced by agents during Operation Stardust. Multiple witnesses reported time dilation effects.",
  },
  {
    id: "DOC-7C-X121",
    title: "Non-Euclidean Geometry in Recovered Materials",
    date: "2077-03-13",
    author: "Dr. Samantha Wong",
    classification: "top-secret",
    tags: ["materials", "geometry", "recovery"],
    summary:
      "Analysis of recovered materials exhibiting properties inconsistent with known physics. Materials demonstrate non-Euclidean geometric properties when subjected to specific electromagnetic frequencies.",
  },
  {
    id: "DOC-7D-X122",
    title: "Witness Testimony Compilation - Phoenix Lights Incident",
    date: "2077-03-12",
    author: "Research Division",
    classification: "confidential",
    tags: ["phoenix", "witness", "testimony"],
    summary:
      "Compilation of witness testimonies from the Phoenix Lights incident. Includes previously unreleased statements from military personnel and radar operators.",
  },
]

export default function ResearchDocuments() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Get classification badge color
  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "top-secret":
        return "bg-red-900/30 text-red-400 border-red-900/50"
      case "classified":
        return "bg-amber-900/30 text-amber-400 border-amber-900/50"
      case "confidential":
        return "bg-blue-900/30 text-blue-400 border-blue-900/50"
      default:
        return "bg-neutral-800 text-neutral-400 border-neutral-800"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
      {/* Document List */}
      <div className="md:col-span-1 border border-neutral-800 rounded-lg bg-black/40 flex flex-col">
        <div className="p-4 border-b border-neutral-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <Input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 bg-black/20 border-neutral-800"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border-b border-neutral-800 bg-neutral-900/20">
          <span className="text-xs text-neutral-400 font-mono">
            {filteredDocuments.length} {filteredDocuments.length === 1 ? "document" : "documents"} found
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Filter className="h-4 w-4 text-neutral-500" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          {filteredDocuments.map((doc) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-4 border-b border-neutral-800 cursor-pointer hover:bg-neutral-800/20 ${
                selectedDocument?.id === doc.id ? "bg-neutral-800/30" : ""
              }`}
              onClick={() => setSelectedDocument(doc)}
            >
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-medium text-neutral-300">{doc.title}</h3>
                <Badge className={`ml-2 shrink-0 ${getClassificationColor(doc.classification)}`}>
                  {doc.classification}
                </Badge>
              </div>

              <div className="mt-2 flex items-center text-xs text-neutral-500 gap-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{doc.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{doc.author}</span>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                {doc.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[10px] bg-neutral-900/50 text-neutral-400">
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Document Viewer */}
      <div className="md:col-span-2 border border-neutral-800 rounded-lg bg-black/40 flex flex-col">
        {selectedDocument ? (
          <>
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-neutral-400" />
                <h2 className="font-mono text-sm font-medium text-neutral-200">{selectedDocument.id}</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="h-4 w-4 text-neutral-500" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4 text-neutral-500" />
                </Button>
              </div>
            </div>

            <div className="p-6 flex-1 overflow-auto">
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl font-bold text-neutral-200">{selectedDocument.title}</h1>
                  <div className="mt-2 flex items-center gap-4 text-sm text-neutral-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{selectedDocument.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{selectedDocument.author}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-800 pt-4">
                  <h3 className="text-sm font-medium text-neutral-300 mb-2">Executive Summary</h3>
                  <p className="text-sm text-neutral-400">{selectedDocument.summary}</p>
                </div>

                <div className="border-t border-neutral-800 pt-4">
                  <h3 className="text-sm font-medium text-neutral-300 mb-2">Document Content</h3>
                  <div className="h-64 rounded-lg border border-neutral-800 bg-neutral-900/50 flex items-center justify-center">
                    <motion.div
                      animate={{
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      className="font-mono text-xs text-neutral-500"
                    >
                      Document content loading...
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <FileText className="h-16 w-16 text-neutral-700 mb-4" />
            <h3 className="text-lg font-medium text-neutral-400">No Document Selected</h3>
            <p className="text-sm text-neutral-500 max-w-md mt-2">
              Select a document from the list to view its contents and metadata.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
