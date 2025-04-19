import { MultiOnClient } from 'multion'

const multion = new MultiOnClient( { apiKey: 'YOUR_API_KEY' } )




// UFO Database Specific
const scrapeAndDownloadDocuments = async ( { url }: any ) => {
  const coreFields = ['Date', 'Status', 'Credit']
  const anchorTag = '.key-data .item-source a' // download this

  const retrieveResponse = await multion.retrieve( {
    cmd: `Scrape the title, date, status, and source content in the sidebar and download the pdf or image file using the link located in the source content HTML markup, should look like this: ${ anchorTag }`,
    url: url,
    fields: ['title', 'author', 'date', 'file', 'status', 'source/credit'],
    includeScreenshot: true

  } )
  const data = retrieveResponse.data
  return data
}