import { openai } from '@/lib/openai/client'

// download file by file ID
export async function GET(_request, props: any) {
  const params = await props.params;

  const {
    fileId
  } = params;

  const [file, fileContent] = await Promise.all( [
    openai.files.retrieve( fileId ),
    openai.files.content( fileId ),
  ] )
  return new Response( fileContent.body, {
    headers: {
      'Content-Disposition': `attachment; filename="${file.filename}"`,
    },
  } )
}
