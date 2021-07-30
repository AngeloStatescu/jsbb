import Reader from "@totalsoft/zion/data/reader";
import { checkRules } from "./_utils"
import { curry } from "ramda";
import * as fl from "fantasy-land";

export const Rule = comp => model => Reader(ctx => comp(model, ctx));
Rule.of = model => _ => Reader[fl.of](model);

const emptyContext = {
    prevDocument: undefined,
    document: undefined,
    fieldPath: [],
    scopePath: [],
    log: false,
    logger: { log: () => { } },
};

export const applyRule = curry(function applyRule(rule, newModel, prevModel = undefined, ctx = undefined) {
    checkRules(rule)
    return rule(newModel).runReader({ ...emptyContext, ...ctx, prevModel, document: newModel, prevDocument: prevModel });
});
