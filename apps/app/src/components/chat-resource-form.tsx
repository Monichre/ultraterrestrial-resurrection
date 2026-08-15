'use client'

import {useState} from 'react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {FileUpload} from '@/components/file-upload'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {Checkbox, CheckboxIndicator, CheckboxItem, CheckboxLabel} from '@/components/ui/checkbox'
import {ResearchDepth, ResearchCategory} from '@/lib/firecrawl/firecrawl'
import {Globe, Link2, FileDigit, Settings2} from 'lucide-react'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'

const formSchema = z.object({
  resourceType: z.enum(['url', 'file']),
  url: z.string().url().optional(),
  researchDepth: z.nativeEnum(ResearchDepth),
  categories: z.array(z.nativeEnum(ResearchCategory)).min(1, 'Select at least one category'),
  recursiveLinks: z.boolean().default(false),
  linkDepth: z.number().min(1).max(3).default(1),
  maxResults: z.number().min(5).max(100).default(10),
})

type FormValues = z.infer<typeof formSchema>

export interface ChatResourceFormProps {
  onSubmit: (values: FormValues, file?: File) => void
  isProcessing?: boolean
}

export function ChatResourceForm({onSubmit, isProcessing = false}: ChatResourceFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [resourceType, setResourceType] = useState<'url' | 'file'>('url')

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resourceType: 'url',
      researchDepth: ResearchDepth.MODERATE,
      categories: [ResearchCategory.SIGHTINGS, ResearchCategory.EVENTS],
      recursiveLinks: false,
      linkDepth: 1,
      maxResults: 10,
    },
  })

  const handleSubmit = (values: FormValues) => {
    if (values.resourceType === 'file' && !selectedFile) {
      form.setError('resourceType', {
        type: 'manual',
        message: 'Please select a file to upload',
      })
      return
    }

    if (values.resourceType === 'url' && !values.url) {
      form.setError('url', {
        type: 'manual',
        message: 'Please enter a valid URL',
      })
      return
    }

    onSubmit(values, selectedFile || undefined)
  }

  const handleResourceTypeChange = (value: 'url' | 'file') => {
    setResourceType(value)
    form.setValue('resourceType', value)
  }

  return (
    <div className='w-full space-y-4'>
      <div className='flex space-x-2 mb-4'>
        <Button
          type='button'
          variant={resourceType === 'url' ? 'default' : 'outline'}
          onClick={() => handleResourceTypeChange('url')}
          className='flex-1'>
          <Globe className='mr-2 h-4 w-4' />
          Website URL
        </Button>
        <Button
          type='button'
          variant={resourceType === 'file' ? 'default' : 'outline'}
          onClick={() => handleResourceTypeChange('file')}
          className='flex-1'>
          <FileDigit className='mr-2 h-4 w-4' />
          File Upload
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
          {resourceType === 'url' && (
            <FormField
              control={form.control}
              name='url'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <div className='flex space-x-2'>
                      <Input
                        placeholder='https://example.com'
                        {...field}
                        value={field.value || ''}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter the URL of the website you want to analyze
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {resourceType === 'file' && (
            <div className='space-y-2'>
              <FormLabel>Upload Document</FormLabel>
              <FileUpload
                onFileSelect={(file) => setSelectedFile(file)}
                acceptedTypes='.pdf,.doc,.docx,.txt,.md'
                description='Upload documents (PDF, DOC, TXT, etc.) up to 10MB'
                showButtons={false}
              />
            </div>
          )}

          <Accordion type='single' collapsible className='w-full'>
            <AccordionItem value='advanced-options'>
              <AccordionTrigger className='py-2'>
                <div className='flex items-center'>
                  <Settings2 className='mr-2 h-4 w-4' />
                  Advanced Research Options
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className='space-y-4 pt-2'>
                  <FormField
                    control={form.control}
                    name='researchDepth'
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Research Depth</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select depth' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={ResearchDepth.SURFACE}>
                              Surface (Quick Scan)
                            </SelectItem>
                            <SelectItem value={ResearchDepth.MODERATE}>
                              Moderate (Standard Analysis)
                            </SelectItem>
                            <SelectItem value={ResearchDepth.DEEP}>
                              Deep (Thorough Analysis)
                            </SelectItem>
                            <SelectItem value={ResearchDepth.COMPREHENSIVE}>
                              Comprehensive (Exhaustive Analysis)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Determines how thoroughly the content will be analyzed
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='categories'
                    render={() => (
                      <FormItem>
                        <div className='mb-4'>
                          <FormLabel className='text-base'>Research Categories</FormLabel>
                          <FormDescription>
                            Select which types of information to extract
                          </FormDescription>
                        </div>
                        <div className='grid grid-cols-2 gap-2'>
                          {Object.values(ResearchCategory).map((category) => (
                            <FormField
                              key={category}
                              control={form.control}
                              name='categories'
                              render={({field}) => {
                                return (
                                  <FormItem
                                    key={category}
                                    className='flex flex-row items-start space-x-2 space-y-0'>
                                    <Checkbox
                                      checked={field.value?.includes(category)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, category])
                                          : field.onChange(
                                              field.value?.filter((value) => value !== category)
                                            )
                                      }}
                                    />
                                    <FormLabel className='font-normal cursor-pointer'>
                                      {category.charAt(0) + category.slice(1).toLowerCase()}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {resourceType === 'url' && (
                    <>
                      <FormField
                        control={form.control}
                        name='recursiveLinks'
                        render={({field}) => (
                          <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            <div className='space-y-1 leading-none'>
                              <FormLabel>Recursive Link Crawling</FormLabel>
                              <FormDescription>
                                Follow and analyze links found on the page
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      {form.watch('recursiveLinks') && (
                        <FormField
                          control={form.control}
                          name='linkDepth'
                          render={({field}) => (
                            <FormItem>
                              <FormLabel>Link Crawl Depth</FormLabel>
                              <Select
                                onValueChange={(val) => field.onChange(Number(val))}
                                defaultValue={field.value.toString()}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select depth' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value='1'>1 level deep</SelectItem>
                                  <SelectItem value='2'>2 levels deep</SelectItem>
                                  <SelectItem value='3'>3 levels deep</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>How many levels of links to follow</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button type='submit' className='w-full' disabled={isProcessing}>
            {isProcessing
              ? 'Processing...'
              : resourceType === 'url'
                ? 'Analyze Website'
                : 'Process Document'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
