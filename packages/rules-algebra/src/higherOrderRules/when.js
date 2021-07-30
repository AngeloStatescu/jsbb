import { curry } from "ramda";
import { $do } from "@totalsoft/zion";
import { checkRules } from "../_utils";
import { unchanged } from "../primitiveRules";
import { ensureReader } from "../predicates";

export const when = curry(function when(predicate, rule) {
  const predicateReader = ensureReader(predicate);
  checkRules(rule);

  return function(model) {
    return $do(function*() {
      const isTrue = yield predicateReader(model);
      return isTrue ? yield rule(model) : yield unchanged(model);
    });
  };
});

export default when;
