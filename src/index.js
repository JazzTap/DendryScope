import {default as define} from "./8d0508ea75589ad1@4544.js";
import {Runtime, Library, Inspector} from "./runtime.js";

const runtime = new Runtime();
const main = runtime.module(define, (name) => !name ? Inspector.into(document.body)(name) : ({}));