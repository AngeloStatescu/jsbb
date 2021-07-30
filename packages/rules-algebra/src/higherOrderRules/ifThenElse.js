import { curry } from "ramda";
import { $do } from "@totalsoft/zion";
import { checkRules } from "../_utils";
import { ensureReader } from "../predicates";

export const ifThenElse = curry(function ifThenElse(predicate, ruleWhenTrue, ruleWhenFalse) {
  const predicateReader = ensureReader(predicate);
  checkRules(ruleWhenTrue, ruleWhenFalse);

  return function(model) {
    return $do(function*() {
      const isTrue = yield predicateReader(model);
      return isTrue ? yield ruleWhenTrue(model) : yield ruleWhenFalse(model);
    });
  };
});

export default ifThenElse;
