import { variadicApply, checkRules } from "../_utils";
import { composeWith, chain,composeK } from "ramda";
import { contramap } from "@totalsoft/zion";
import { setInnerProp, getInnerProp } from "../objectUtils";

function _concat(rule1, rule2) {
    //return composeK(rule2, rule1)
    return (composeWith(chain))([model => rule2(model) |> contramap( ctx => _getContext(model, ctx)), rule1])        
}

function _getContext(model, ctx) {
    const { fieldPath, document } = ctx;
    const oldModel = getInnerProp(document, fieldPath);
    return model === oldModel ? ctx : { ...ctx, document: setInnerProp(document, fieldPath, model) }
}

const chainRules = variadicApply(function chainRules(...rules) {
    checkRules(...rules);

    return rules.reduce(_concat);
});

export default chainRules;
