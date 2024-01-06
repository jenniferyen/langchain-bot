import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { createClient } from '@supabase/supabase-js'

const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY

const embeddings = new OpenAIEmbeddings({ openAIApiKey })
const sbApiKey = import.meta.env.VITE_SUPABASE_API_KEY
const sbUrl = import.meta.env.VITE_SUPABASE_URL_LC_CHATBOT
const client = createClient(sbUrl, sbApiKey)

const vectorStore = new SupabaseVectorStore(embeddings, {
    client,
    tableName: 'documents',
    queryName: 'match_documents'
})

const retriever = vectorStore.asRetriever()

export { retriever }