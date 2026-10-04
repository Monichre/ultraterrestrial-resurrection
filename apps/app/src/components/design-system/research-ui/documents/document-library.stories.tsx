import type {Meta, StoryObj} from '@storybook/react'
import {DocumentLibrary} from './document-library'
import {userEvent, within, expect, waitFor} from '@storybook/test'
import React from 'react'

const meta: Meta<typeof DocumentLibrary> = {
  title: 'Documents/DocumentLibrary',
  component: DocumentLibrary,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'vintage',
      values: [
        {name: 'vintage', value: '#2c1810'},
        {name: 'slate', value: '#1e293b'},
        {name: 'dark', value: '#0f172a'},
      ],
    },
    docs: {
      description: {
        component:
          'Document library search interface with real-time search capabilities. Features document browsing, search functionality, and document selection callbacks. Integrates with backend search APIs and handles loading states.',
      },
    },
  },
  argTypes: {
    onDocumentSelect: {
      action: 'document-selected',
      description: 'Callback function called when a document is selected from the library',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Mock document data
const mockDocuments = [
  {
    id: 'doc-001',
    data: 'Classified UFO sighting report from Roswell, New Mexico. Witness testimonies and photographic evidence included.',
    metadata: {
      title: 'Roswell Incident Report',
      source: 'U.S. Air Force',
      doc_type: 'incident_report',
      created_at: '1947-07-08T10:00:00Z',
      updated_at: '1947-07-15T14:30:00Z',
      tags: ['ufo', 'classified', 'roswell', 'investigation'],
    },
    score: 0.95,
  },
  {
    id: 'doc-002',
    data: 'Project Blue Book investigation files documenting unidentified aerial phenomena over Washington D.C.',
    metadata: {
      title: 'Washington D.C. UFO Wave Analysis',
      source: 'Project Blue Book',
      doc_type: 'analysis_report',
      created_at: '1952-07-19T16:45:00Z',
      updated_at: '1952-08-01T09:15:00Z',
      tags: ['ufo', 'washington_dc', 'radar', 'multiple_witnesses'],
    },
    score: 0.89,
  },
  {
    id: 'doc-003',
    data: 'Pilot testimony regarding unusual aircraft behavior during routine training exercises.',
    metadata: {
      title: 'Pilot Encounter Report',
      source: 'U.S. Navy',
      doc_type: 'witness_statement',
      created_at: '1950-03-15T11:20:00Z',
      updated_at: '1950-03-16T08:45:00Z',
      tags: ['pilot', 'testimony', 'navy', 'training'],
    },
    score: 0.76,
  },
  {
    id: 'doc-004',
    data: 'Technical analysis of recovered materials from unidentified aircraft crash site.',
    metadata: {
      title: 'Material Analysis Report',
      source: 'Wright-Patterson AFB',
      doc_type: 'technical_report',
      created_at: '1947-07-20T13:30:00Z',
      updated_at: '1947-08-02T16:00:00Z',
      tags: ['materials', 'analysis', 'crash', 'technical'],
    },
    score: 0.82,
  },
]

const searchDocuments = [
  {
    id: 'search-001',
    data: 'UFO sighting over Edwards Air Force Base with multiple radar confirmations.',
    metadata: {
      title: 'Edwards AFB UFO Incident',
      source: 'U.S. Air Force',
      doc_type: 'incident_report',
      created_at: '1952-08-30T22:15:00Z',
      updated_at: '1952-09-01T10:30:00Z',
      tags: ['ufo', 'edwards_afb', 'radar', 'confirmed'],
    },
    score: 0.91,
  },
  {
    id: 'search-002',
    data: 'Detailed UFO encounter report from commercial airline pilot over Pacific Ocean.',
    metadata: {
      title: 'Pacific Ocean UFO Encounter',
      source: 'Commercial Aviation',
      doc_type: 'pilot_report',
      created_at: '1950-11-14T19:45:00Z',
      updated_at: '1950-11-15T07:20:00Z',
      tags: ['ufo', 'commercial_pilot', 'pacific', 'encounter'],
    },
    score: 0.87,
  },
]

// Mock component for demonstration - in real implementation would use MSW or similar
const MockDocumentLibrary = ({onDocumentSelect}: {onDocumentSelect?: (doc: any) => void}) => {
  const [documents, setDocuments] = React.useState(mockDocuments)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const handleSearch = async () => {
    setIsLoading(true)
    setError('')

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (searchQuery.includes('error')) {
      setError('Search service error')
      setIsLoading(false)
      return
    }

    if (searchQuery.toLowerCase().includes('ufo')) {
      setDocuments(searchDocuments)
    } else {
      setDocuments([])
    }

    setIsLoading(false)
  }

  const handleBrowse = async () => {
    setIsLoading(true)
    setError('')

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300))

    setDocuments(mockDocuments)
    setIsLoading(false)
  }

  React.useEffect(() => {
    handleBrowse()
  }, [])

  return (
    <div className='w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg'>
      <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-6'>Document Library</h2>

      {/* Search Interface */}
      <div className='flex gap-4 mb-6'>
        <input
          type='text'
          placeholder='Search documents...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className='px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md font-medium'>
          Search
        </button>
        <button
          onClick={handleBrowse}
          disabled={isLoading}
          className='px-6 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-md font-medium'>
          Browse
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className='text-center py-8'>
          <div className='text-gray-600 dark:text-gray-400'>Loading documents...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className='text-center py-8'>
          <div className='text-red-600 dark:text-red-400'>Error: {error}</div>
        </div>
      )}

      {/* Documents List */}
      {!isLoading && !error && (
        <div className='space-y-4'>
          {documents.length === 0 ? (
            <div className='text-center py-8 text-gray-600 dark:text-gray-400'>
              No documents found
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onDocumentSelect?.(doc)}
                className='p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors'>
                <h3 className='font-bold text-gray-900 dark:text-white mb-2'>
                  {doc.metadata.title}
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>{doc.data}</p>
                <div className='flex flex-wrap gap-2 text-xs'>
                  <span className='px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded'>
                    {doc.metadata.source}
                  </span>
                  <span className='px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded'>
                    {doc.metadata.doc_type}
                  </span>
                  {doc.score && (
                    <span className='px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded'>
                      Score: {(doc.score * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export const Default: Story = {
  render: (args) => <MockDocumentLibrary {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Default document library showing browsed documents with search functionality.',
      },
    },
  },
}

export const WithSearch: Story = {
  render: (args) => <MockDocumentLibrary {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          'Document library with active search functionality. Type "ufo" to see search results.',
      },
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)

    // Wait for component to load
    await waitFor(() => {
      expect(canvas.getByPlaceholderText(/search documents/i)).toBeInTheDocument()
    })

    // Perform a search
    const searchInput = canvas.getByPlaceholderText(/search documents/i)
    await userEvent.type(searchInput, 'ufo')

    const searchButton = canvas.getByRole('button', {name: /search/i})
    await userEvent.click(searchButton)

    // Wait for search results
    await waitFor(
      () => {
        expect(canvas.getByText(/Edwards AFB UFO Incident/i)).toBeInTheDocument()
      },
      {timeout: 3000}
    )
  },
}

const LoadingMockLibrary = () => {
  const [isLoading] = React.useState(true)

  return (
    <div className='w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg'>
      <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-6'>Document Library</h2>
      <div className='flex gap-4 mb-6'>
        <input
          type='text'
          placeholder='Search documents...'
          disabled
          className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-500'
        />
        <button disabled className='px-6 py-2 bg-gray-400 text-white rounded-md font-medium'>
          Search
        </button>
      </div>
      {isLoading && (
        <div className='text-center py-8'>
          <div className='text-gray-600 dark:text-gray-400'>Loading documents...</div>
        </div>
      )}
    </div>
  )
}

export const LoadingState: Story = {
  render: () => <LoadingMockLibrary />,
  parameters: {
    docs: {
      description: {
        story:
          'Document library in loading state, showing loading indicators while fetching documents.',
      },
    },
  },
}

const ErrorMockLibrary = () => {
  return (
    <div className='w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg'>
      <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-6'>Document Library</h2>
      <div className='flex gap-4 mb-6'>
        <input
          type='text'
          placeholder='Search documents...'
          className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
        />
        <button className='px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium'>
          Search
        </button>
      </div>
      <div className='text-center py-8'>
        <div className='text-red-600 dark:text-red-400'>
          Error: Failed to load documents from server
        </div>
      </div>
    </div>
  )
}

export const ErrorState: Story = {
  render: () => <ErrorMockLibrary />,
  parameters: {
    docs: {
      description: {
        story: 'Document library showing error state when API requests fail.',
      },
    },
  },
}

const EmptyMockLibrary = () => {
  return (
    <div className='w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg'>
      <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-6'>Document Library</h2>
      <div className='flex gap-4 mb-6'>
        <input
          type='text'
          placeholder='Search documents...'
          className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
        />
        <button className='px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium'>
          Search
        </button>
      </div>
      <div className='text-center py-8 text-gray-600 dark:text-gray-400'>No documents found</div>
    </div>
  )
}

export const EmptyResults: Story = {
  render: () => <EmptyMockLibrary />,
  parameters: {
    docs: {
      description: {
        story: 'Document library showing empty state when no documents are available.',
      },
    },
  },
}

export const DocumentSelection: Story = {
  render: (args) => <MockDocumentLibrary {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates document selection interaction. Click on any document to trigger the selection callback.',
      },
    },
  },
  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement)

    // Wait for documents to load
    await waitFor(
      () => {
        expect(canvas.getByText(/Roswell Incident Report/i)).toBeInTheDocument()
      },
      {timeout: 3000}
    )

    // Click on a document
    const firstDocument = canvas.getByText(/Roswell Incident Report/i)
    await userEvent.click(firstDocument)

    // Verify the callback was called
    await waitFor(() => {
      expect(args.onDocumentSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'doc-001',
          metadata: expect.objectContaining({
            title: 'Roswell Incident Report',
          }),
        })
      )
    })
  },
}

export const SearchError: Story = {
  render: (args) => <MockDocumentLibrary {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Document library showing error state specifically for search operations.',
      },
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)

    // Wait for component to load
    await waitFor(() => {
      expect(canvas.getByPlaceholderText(/search documents/i)).toBeInTheDocument()
    })

    // Perform a search that will error
    const searchInput = canvas.getByPlaceholderText(/search documents/i)
    await userEvent.type(searchInput, 'error')

    const searchButton = canvas.getByRole('button', {name: /search/i})
    await userEvent.click(searchButton)

    // Wait for error message
    await waitFor(
      () => {
        expect(canvas.getByText(/error/i)).toBeInTheDocument()
      },
      {timeout: 3000}
    )
  },
}

export const InteractivePlayground: Story = {
  render: (args) => <MockDocumentLibrary {...args} />,
  args: {
    onDocumentSelect: undefined, // Will use action from argTypes
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive playground for testing the document library. Try searching for "ufo" or click on documents to test selection.',
      },
    },
  },
}
