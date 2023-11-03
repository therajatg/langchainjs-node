import { DataSource } from "typeorm";
import { OpenAI } from "langchain/llms/openai";
import { SqlDatabase } from "langchain/sql_db";
import { SqlDatabaseChain } from "langchain/chains/sql_db";
import { config } from "dotenv";
import sqlite3 from "sqlite3";
config();

/**
 * This example uses Chinook database, which is a sample database available for SQL Server, Oracle, MySQL, etc.
 * To set it up follow the instructions on https://database.guide/2-sample-databases-sqlite/, placing the .db file
 * in the examples folder.
 */

// import { Entity, Column } from "typeorm";

// @Entity()
// export class Photo {
//   @PrimaryGeneratedColumn("integer")
//   id;

//   @Column("text")
//   name;

//   @Column("text")
//   description;

//   @Column("text")
//   filename;

//   @Column("integer")
//   views;

//   @Column("text")
//   isPublished;
// }

const db1 = sqlite3.verbose();
const db2 = new db1.Database("./test.db", db1.OPEN_READWRITE, (err) =>
  console.log(err)
);
db2.run(
  "CREATE TABLE ma(id INTEGER PRIMARY KEY, first_name, last_name, username)"
);

const datasource = new DataSource({
  type: "sqlite",
  database: "test.db",
});

const db = await SqlDatabase.fromDataSourceParams({
  appDataSource: datasource,
});

const chain = new SqlDatabaseChain({
  llm: new OpenAI({ temperature: 0 }),
  database: db,
  sqlOutputKey: "sql",
});

// const res = await chain.run("How many tracks are there?");
const res = await chain.call({ query: "How many users are there?" });
console.log(res);
// There are 3503 tracks.
