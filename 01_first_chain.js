//This is how we do things using langchain.
//This time we'll import OpenAI and PromptTemplate (also LLMChain) from langchain

import { config } from "dotenv";
config();

import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

const model = new OpenAI({ temperature: 0 });
const template = "Be very funny when answering questions\n Question:{question}";
const prompt = new PromptTemplate({ template, inputVariables: ["question"] });

//creating new chain
const chain = new LLMChain({ llm: model, prompt });

//now we will run call on the chain object
const result = await chain.call({ question: "What is the capital of france" });
console.log(result);
