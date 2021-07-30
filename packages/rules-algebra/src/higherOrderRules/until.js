import { curry } from "ramda";
import { $do } from "@totalsoft/zion";
import { checkRules } from "../_utils";
import { unchanged } from "../primitiveRules";
import { ensureReader } from "../predicates";
import { chainRules } from "./";

export const until = curry(function until(predicate, rule) {
  const predicateReader = ensureReader(predicate);
  checkRules(rule);

  return function(model) {
    return $do(function*() {
      const isTrue = yield predicateReader(model);
      return isTrue ? yield unchanged(model) : yield chainRules(rule, until(predicate, rule))(model);
    });
  };
});

export default until;
