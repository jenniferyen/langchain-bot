import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import fs from 'fs/promises';
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

try {
  const text = await fs.readFile('data-source.txt', 'utf8');

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    separators: ['\n\n', '\n', ' ', ''],
    chunkOverlap: 50
  })

  const output = await splitter.createDocuments([text])

  const sbApiKey = process.env.VITE_SUPABASE_API_KEY
  const sbUrl = process.env.VITE_SUPABASE_URL_LC_CHATBOT
  const openAIApiKey = process.env.VITE_OPENAI_API_KEY

  const client = createClient(sbUrl, sbApiKey)

  await SupabaseVectorStore.fromDocuments(
    output,
    new OpenAIEmbeddings({ openAIApiKey }),
    {
      client,
      tableName: 'documents',
    }
  )

} catch (err) {
  console.log(err)
}