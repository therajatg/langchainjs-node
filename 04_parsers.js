import { config } from "dotenv";
config();

import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

//StructuredOutputParser will also us to parse text into some kind of dictionary or object.

const parser = StructuredOutputParser.fromNamesAndDescriptions({
  answer: "answer to the user's question",
});
const formatInstructions = parser.getFormatInstructions();
// console.log(formatInstructions);
//The formatInstructions is a JS object which contains the info about answer that we can use in our code as needed.

//In the below prompt we got 2 variables, one is the inputVariable and other is the partialVariable.
const prompt = new PromptTemplate({
  template:
    "Be very funny when answering questions\n{format_instructions}\n Question: {question}",
  inputVariables: ["question"],
  partialVariables: { format_instructions: formatInstructions },
});

const model = new OpenAI({ temperature: 0 });

//We'll pass the inputVariable in prompt.format
const input = await prompt.format({
  question: "What is the capital of France?",
});
console.log(input);

const response = await model.call(input); //This will give us a string and not yet an object
console.log(await parser.parse(response)); //Here we'll get a JS object which we can pass to our DB

//So far we only used knowledge that the model was already trained on. In many cases we want the chatbot to use our internal database to retrieve data and convert it into human like format. One way to do so it to pass the whole database to the prompt for query but the problem is that this can be quite expensive because we pay per tokens and easily reach maximum tokens. for example the older gpt-3.5-turbo has 4000 tokens max, the newer has 32000 but still it's limited nad hence the input limits is a problem for you.
//Let's see how top overcome this issue. We'll use restaurant.txt as our database.
//We first have to create chunks from datrabase then covert chunks into embedings (See what this is on OPenAI website: https://openai.com/blog/introducing-text-and-code-embeddings). embeddings are similar vectors stored in the similar place in database then we make a query to the DB. The query is also embedded and now we make a similarity search as we know which text is similar to which vector.
