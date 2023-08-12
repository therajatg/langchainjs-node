import { config } from "dotenv";
config();

import { TextLoader } from "langchain/document_loaders/fs/text";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { FaissStore } from "langchain/vectorstores/faiss";

//OpenAIEmbeddings => class to create embeddings
//FaissStore => To store embeddings. This is a vector store from facebook

//Create a new text loader instance
const loader = new TextLoader("./restaurant.txt");
const docs = await loader.load(); //Loaded data from file system to memory and stored in the variable docs.

//creating a text splitter. chunksize is the amount of tokens. Normally 75 words are 100 tokens. so 200 chunk size means 100 words. see about chunkOverlap
const splitter = new CharacterTextSplitter({
  chunkSize: 200,
  chunkOverlap: 50,
});

//splitting docs using the splitDocuments Method from splitter
const documents = await splitter.splitDocuments(docs);
console.log(documents);

//Now documents have to be converted into embeddings.
//instantiated OpenAi's embeddings class.

const embeddings = new OpenAIEmbeddings();

//now pass the docs and embeddings to the FaissStore.
const vectorStore = await FaissStore.fromDocuments(documents, embeddings);
await vectorStore.save("./"); //To save the vector store at this path ('./').

//After running this file faiss.index and docstore.json will form. docstore.json is our vector store. We use this vector store to run similarity search. Hence, we'll convert a question to a vector and run the similarity search in the database and get the most similar ones from the vector store. Let's learn this in useStore.js file.
