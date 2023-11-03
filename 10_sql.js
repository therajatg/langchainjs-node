import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { RunnableSequence } from "langchain/schema/runnable";
import { config } from "dotenv";
config();

const parser = StructuredOutputParser.fromNamesAndDescriptions({
  answer: "answer to the user's question",
  source: "source used th answer the user's question, should be a website.",
});

const formatInstructions = parser.getFormatInstructions();

const prompt = new PromptTemplate({
  template: `Answer the user's question as best you can:\n{format_instructions}\n{question}`,
  inputVariables: ["question"],
  partialVariables: {
    format_instructions: formatInstructions,
  },
});

const model = new OpenAI({
  temperature: 0, // For best results with the output fixing parser
  // azureOpenAIApiKey: "2bc42fc853bd46f8b81dfc51b99b23e3",
  // azureOpenAIApiVersion: "2023-03-15-preview",
  // azureOpenAIApiInstanceName: "lucidmvpopenai",
  // azureOpenAIApiDeploymentName: "lucidchatbot",
  // modelName: "gpt-35-turbo",
});

const input = prompt.format({
  question: "Which country has the largest population?",
});

const response = await model.call(input);
console.log(parser.parse(response));

// console.log(response);
