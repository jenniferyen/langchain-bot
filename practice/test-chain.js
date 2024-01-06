import { ChatOpenAI } from 'langchain/chat_models/openai'
import { PromptTemplate } from 'langchain/prompts'
import { StringOutputParser } from 'langchain/schema/output_parser'
import { RunnablePassthrough, RunnableSequence } from "langchain/schema/runnable"

const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY
const llm = new ChatOpenAI({ openAIApiKey })

const punctuationTemplate = `Given a sentence, add punctuation where needed.
    sentence: {sentence}
    sentence with punctuation:
`
const punctuationPrompt = PromptTemplate.fromTemplate(punctuationTemplate)

const grammarTemplate = `Given a sentence, correct the grammar.
    sentence: {punctuated_sentence}
    sentence with correct grammar:
`
const grammarPrompt = PromptTemplate.fromTemplate(grammarTemplate)

const translationTemplate = `Given a sentence, translate the sentence into {language}
    sentence: {grammatically_correct_sentence}
    translated sentence:
`
const translationPrompt = PromptTemplate.fromTemplate(translationTemplate)

const punctuationChain = RunnableSequence.from([punctuationPrompt, llm, new StringOutputParser()])
const grammarChain = RunnableSequence.from([grammarPrompt, llm, new StringOutputParser()])
const translationChain = RunnableSequence.from([translationPrompt, llm, new StringOutputParser()])

const chain = RunnableSequence.from([
    { 
        punctuated_sentence: punctuationChain, 
        original_input: new RunnablePassthrough()
    }, 
    {
        grammatically_correct_sentence: grammarChain,
        language: ({ original_input }) => original_input.language
    },
    translationChain
])

const response = await chain.invoke({
    sentence: 'i dont liked mondays',
    language: 'french'
})

console.log(response)
