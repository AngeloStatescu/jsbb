import { map, addIndex } from "ramda";
import { $do } from "@totalsoft/zion";
import { field, chainRules } from "./";
import { checkRules } from "../_utils";
import { Rule } from "../rule";

const mapIndexed = addIndex(map);

export default function items(itemRule) {
  checkRules(itemRule);
  return function(items) {
    if (items === null || items === undefined || items.length === 0) {
      return Rule.of(items)(items);
    }

    return $do(function*() {
      return yield (items |> mapIndexed((_, index) => field(index, itemRule)) |> chainRules)(items);
    });
  };
}
