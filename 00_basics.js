//This is how we do things without langchain

import { config } from "dotenv";
config();

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration); //instanciate OpenAIApi class (made an instance)

async function chat(input) {
  const messages = [{ role: "user", content: input }];

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0,
  });

  return response.data.choices[0].message.content;
}

const question = "What is the capital of India";

chat(question)
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

//This is the messages that we sentd to the openAi and the whole conversation will be stored
//model is the model we want to use
//temperature varies from 0 to 1 with one for the bot which is very dynamic or creative in its output and 0 means it's very robust and deterministic.
//The response we get from OPenAi is a complex object and we have to retrieve information and return it which is a text we get from openai.
//using prompts we can tell as how the responses should be. Although we will get the response without prompts too.

const promptTemplate = `Be very funny when answering questions
Question: {question}`;

const prompt = promptTemplate.replace("{question}", question);

chat(prompt)
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
