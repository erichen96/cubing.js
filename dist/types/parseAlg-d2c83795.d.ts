import { a as Alg, A as AlgNode } from './Alg-c6770822.js';

interface ParserIndexed {
    startCharIndex: number;
    endCharIndex: number;
}
type Parsed<T extends Alg | AlgNode> = T & ParserIndexed;

export { Parsed as P };
