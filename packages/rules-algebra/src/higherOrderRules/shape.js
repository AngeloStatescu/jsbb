import { map, composeK } from "ramda";
import { $do } from "@totalsoft/zion";
import { field, chainRules } from "./";
import scope from "./scope";
import { Rule } from "../rule";

function _shape(ruleObj) {
  return function(model) {
    if (model === null || model === undefined) {
      return Rule.of(model);
    }

    return $do(function*() {
      return yield Object.entries(ruleObj) |> map(([k, v]) => field(k, v)) |> chainRules;
    });
  };
}

export default composeK(scope, _shape);
