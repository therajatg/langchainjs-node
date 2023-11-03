import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { RunnableSequence } from "langchain/schema/runnable";
import { config } from "dotenv";
config();

const parser = StructuredOutputParser.fromNamesAndDescriptions({
  columns: "table column names as items in an array",
  //   query: "query to get user the required answer, should be a sql query.",
});

const chain = RunnableSequence.from([
  PromptTemplate.fromTemplate(
    "Answer the users question as best as possible.\n{format_instructions}\n{question}"
  ),
  new OpenAI({ temperature: 0 }),
  parser,
]);

// console.log(parser.getFormatInstructions());

const response = await chain.invoke({
  question:
    "year of graduation should be 2004, given that the column names present in the sql table are first_name, last_name, year_of_graduation and current_employment",
  format_instructions: parser.getFormatInstructions(),
});

// console.log("response", response.source);
// { answer: 'Paris', source: 'https://en.wikipedia.org/wiki/Paris' }
