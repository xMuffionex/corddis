import { Client } from "../src/index.ts";
import token from "./token.ts"

new Client(token)
    .user("344048874656366592").then(value => console.log(value))  // ZiomaleQ