import { contramap } from "@totalsoft/zion";
import { checkRules } from "../_utils";
import { curry } from "ramda";

const logTo = curry(function logTo(logger, rule) {
  checkRules(rule);
  return function(model) {
    return rule(model) |> contramap(context => ({ ...context, log: true, logger }));
  }
});

export default logTo;
