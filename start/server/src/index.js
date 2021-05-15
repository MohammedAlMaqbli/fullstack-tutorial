import dotenv from "dotenv";
import { ApolloServer } from "apollo-server";
import typeDefs from "./schema";
import Post from "./datasources/post";
import Launch from "./datasources/launch";
import User from "./datasources/user";
import { createStore } from "./utils";

dotenv.config();

const store = createStore();

const server = new ApolloServer({
  typeDefs,
  dataSources: () => ({
    Post: new Post({ store }),
    User: new User({ store }),
    Launch: new Launch(),
  }),
});

server.listen().then(() => {
  console.log(`
      Server is running!
      Listening on port 4000
    `);
});
