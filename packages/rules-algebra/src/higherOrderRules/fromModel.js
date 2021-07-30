import { $do } from "@totalsoft/zion";
import { checkRules } from "../_utils";

export default function fromModel(ruleFactory) {
  return function(model) {
    return $do(function*() {
      if (model === null || model === undefined) {
        return model;
      }
      const v = ruleFactory(model);
      checkRules(v);
      return yield v(model);
    });
  };
}
