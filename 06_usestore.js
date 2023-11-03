import { config } from "dotenv";
config();

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain, loadQAStuffChain } from "langchain/chains";

//RetrievalQAChain => To retrieve data from vector store
//loadQAStuffChain => helper function for retrieval

const embeddings = new OpenAIEmbeddings();
const vectorStore = await FaissStore.load("./", embeddings); // we need the embeddings instance here to create embedding for out question

const model = new OpenAI({
  temperature: 0,
  // azureOpenAIApiKey: "2bc42fc853bd46f8b81dfc51b99b23e3",
  // azureOpenAIApiInstanceName: "lucidmvpopenai",
  // azureOpenAIApiDeploymentName: "lucidchatbot",
  // azureOpenAIApiVersion: "2023-03-15-preview",
  // azureOpenAIBasePath: "https://lucidmvpopenai.openai.azure.com/",
});

const chain = new RetrievalQAChain({
  combineDocumentsChain: loadQAStuffChain(model),
  retriever: vectorStore.asRetriever(),
  returnSourceDocuments: true,
});

const response = await chain.call({
  query: "When does the restaurant open on friday?", //Now we want data to be retieved from the vector store rather than from llm
});
console.log(response.text);

//Hence the process
//Take a question => Run a similarity search against a very large database => retrieve the correct embeddings and document from store => take

//Now let's see as how to provide memory so that when you ask how was paris to your friend as first question and in the next question when you ask Suggest a good restaurant there, the friend should know that there means paris.
//So that LLM should have the context of the whole conversations.
//Chatbot should remember the history.
//see the _chat.js for this.
