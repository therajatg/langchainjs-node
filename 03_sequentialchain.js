import { config } from "dotenv";
config();

import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain, SequentialChain } from "langchain/chains";

const llm = new OpenAI({ temperature: 0 });

let template =
  "You ordered {dishname} and your experience was {experience}. Write a review.";
let promptTemplate = new PromptTemplate({
  template,
  inputVariables: ["dishname", "experience"],
});
const reviewChain = new LLMChain({
  llm,
  prompt: promptTemplate,
  outputKey: "review",
});

//above we have review as outputKey and it is important for the llm to know as to which chain the output key should be passed.
//below is the 2nd follow up template. and see in the 2nd the inputVariable matches the outKey from the first chain.

template = "Given the restaurant review: {review}, write a follow-up comment: ";
promptTemplate = new PromptTemplate({
  template,
  inputVariables: ["review"],
});
const commentChain = new LLMChain({
  llm,
  prompt: promptTemplate,
  outputKey: "comment",
});

template = "Summarize the review in one short sentence: {review}";
promptTemplate = new PromptTemplate({
  template,
  inputVariables: ["review"],
});
const summaryChain = new LLMChain({
  llm,
  prompt: promptTemplate,
  outputKey: "summary",
});

template = "Translate the summary to german: {summary}";
promptTemplate = new PromptTemplate({
  template,
  inputVariables: ["summary"],
});
const translationChain = new LLMChain({
  llm,
  prompt: promptTemplate,
  outputKey: "german_translation",
});

// We have got 4 chains now
//below inputVariable are those which are inputted in the very first template

const overallChain = new SequentialChain({
  chains: [reviewChain, commentChain, summaryChain, translationChain],
  inputVariables: ["dishname", "experience"],
  outputVariables: ["review", "comment", "summary", "german_translation"],
});

const result = await overallChain.call({
  dishname: "Pizza",
  experience: "It was aweful",
});

console.log(result);

//1. There are two types of sequential chains: SimpleSequentialChain : The simplest form of sequential chains, where each step has a singular input/output, and the output of one step is the input to the next. SequentialChain : A more general form of sequential chains, allowing for multiple inputs/outputs and I think in swquential chain, the order can be anything like the output from the first chain can be used as input in 3rd chain. It's cool.

//LLM's only work with text but sometimes this is not what we want. for example we may want to see whether the review is positive, negative or neutral in some form of object which you can just copy and pass in to let's say postgres database. let's do this in parsers.js
