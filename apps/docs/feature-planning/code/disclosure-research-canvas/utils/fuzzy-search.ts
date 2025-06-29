import Fuse from "fuse.js"

export interface SearchableFile {
  id: string
  name: string
  type: string
  size?: string
  path?: string
  folderId?: string
  classification?: "top-secret" | "classified" | "confidential"
}

// Extract all files from nested folder structure
export const extractFilesFromFolders = (folders: any[]): SearchableFile[] => {
  return folders.flatMap((folder) =>
    folder.files.map((file: any) => ({
      ...file,
      folderId: folder.id,
      path: `${folder.name}/${file.name}`,
    })),
  )
}

// Create a fuzzy search instance
export const createFuzzySearch = (items: SearchableFile[]) => {
  const options = {
    includeScore: true,
    threshold: 0.4,
    keys: [
      { name: "name", weight: 0.7 },
      { name: "path", weight: 0.5 },
      { name: "type", weight: 0.3 },
      { name: "id", weight: 0.2 },
    ],
  }

  return new Fuse(items, options)
}

// Search files with fuzzy matching
export const searchFiles = (fuse: Fuse<SearchableFile>, query: string): SearchableFile[] => {
  if (!query.trim()) return []

  const results = fuse.search(query)
  return results.map((result) => result.item)
}
