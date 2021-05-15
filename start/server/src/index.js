import dotenv from "dotenv";
import { ApolloServer } from "apollo-server";
import typeDefs from "./schema";

dotenv.config();

const server = new ApolloServer({ typeDefs });
