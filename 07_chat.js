import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
} from "langchain/prompts";

const chat = new ChatOpenAI({
  temperature: 0,
  azureOpenAIApiKey: "2bc42fc853bd46f8b81dfc51b99b23e3",
  azureOpenAIApiVersion: "2023-03-15-preview",
  azureOpenAIApiInstanceName: "lucidmvpopenai",
  azureOpenAIApiDeploymentName: "lucidchatbot",
});

const chatPrompt = ChatPromptTemplate.fromPromptMessages([
  SystemMessagePromptTemplate.fromTemplate(
    "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know."
  ),
  new MessagesPlaceholder("history"),
  HumanMessagePromptTemplate.fromTemplate("{input}"),
]);

const chain = new ConversationChain({
  memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
  prompt: chatPrompt,
  llm: chat,
});

const response1 = await chain.call({
  input: "What is latest car from skoda?",
});

const response2 = await chain.call({
  input: "What is a great place to see there?", //It should know what there is (there is france).
});

console.log(response1);
console.log(response2);

// import { config } from "dotenv";
// config();

// import { ConversationChain } from "langchain/chains";
// import { ChatOpenAI } from "langchain/chat_models/openai";
// import { BufferMemory } from "langchain/memory";
// import {
//   ChatPromptTemplate,
//   HumanMessagePromptTemplate,
//   SystemMessagePromptTemplate,
//   MessagesPlaceholder,
// } from "langchain/prompts";

// //ConversationChain => For holding the whole conversation into memory
// //ChatOpenAI => useful for making chatbots
// //BufferMemory => This class is able to hold the memory of the conversation in combination with chain.
// //others are just helper functions

// const chat = new ChatOpenAI({ temperature: 0 });

// const chatPrompt = ChatPromptTemplate.fromPromptMessages([
//   SystemMessagePromptTemplate.fromTemplate(
//     "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know."
//   ),
//   new MessagesPlaceholder("history"),
//   HumanMessagePromptTemplate.fromTemplate("{input}"),
// ]);

// const chain = new ConversationChain({
//   memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
//   prompt: chatPrompt,
//   llm: chat,
// });

// const response1 = await chain.call({
//   input: "What is the capital of France?",
// });

// const response2 = await chain.call({
//   input: "What is a great place to see there?", //It should know what there is (there is france).
// });

// console.log(response1);
// console.log(response2);

// /**
// this is the identity of the bot => "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know."
// **/

// azureOpenAIApiKey: "2bc42fc853bd46f8b81dfc51b99b23e3",
// azureOpenAIApiInstanceName: "lucidmvpopenai",
// azureOpenAIApiDeploymentName: "lucidchatbot",
// azureOpenAIApiVersion: "2023-03-15-preview",
// azureOpenAIBasePath: "https://lucidmvpopenai.openai.azure.com/",
