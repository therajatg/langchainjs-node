import { z } from "zod";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import {
  StructuredOutputParser,
  OutputFixingParser,
} from "langchain/output_parsers";
import { config } from "dotenv";
config();

const outputParser = StructuredOutputParser.fromZodSchema(
  z
    .object({
      fields: z.object({
        // columns: z.array(z.string().describe("Name of the column")),
        query: z
          .string()
          .describe("sql query to answer the question asked by the user."),
      }),
    })
    .describe(
      "An Object which contains the sql query to answer the question asked by the user given that the column names present in the student table are first_name, last_name, year_of_graduation and current_employment, strictly give only the query"
    )
  // .describe(
  //   "An Object which gives all the column names present in the sql table and the sql query to answer the question asked by the user"
  // )
);

// const outputParser = StructuredOutputParser.fromZodSchema(
//   z
//     .object({
//       fields: z.object({
//         countries: z.array(z.string().describe("Name of the country")),
//         population: z.array(z.string().describe("population of the country")),
//       }),
//     })
//     .describe(
//       "An Object which gives the name of the countries as per the user's query and poplulation of each of those countries"
//     )
// );

const chatModel = new ChatOpenAI({
  temperature: 0, // For best results with the output fixing parser
  azureOpenAIApiKey: "2bc42fc853bd46f8b81dfc51b99b23e3",
  azureOpenAIApiVersion: "2023-03-15-preview",
  azureOpenAIApiInstanceName: "lucidmvpopenai",
  azureOpenAIApiDeploymentName: "lucidchatbot",
  // modelName: "gpt-35-turbo",
});

const outputFixingParser = OutputFixingParser.fromLLM(chatModel, outputParser);

// Don't forget to include formatting instructions in the prompt!
const prompt = new PromptTemplate({
  template: `Answer the user's question as best you can:\n{format_instructions}\n{query}`,
  inputVariables: ["query"],
  partialVariables: {
    format_instructions: outputFixingParser.getFormatInstructions(),
  },
});

const answerFormattingChain = new LLMChain({
  llm: chatModel,
  prompt,
  outputKey: "records", // For readability - otherwise the chain output will default to a property named "text"
  outputParser: outputFixingParser,
});

const result = await answerFormattingChain.call({
  query: "student where year of graduation should be 2004?",
});

// const result = await answerFormattingChain.call({
//   query: "name 5 countries with highest GDP from around the world?",
// });

console.log(JSON.stringify(result.records, null, 2));
