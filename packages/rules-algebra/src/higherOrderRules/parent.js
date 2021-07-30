import Reader from "@totalsoft/zion/data/reader";
import { contramap } from "@totalsoft/zion";
import { $do } from "@totalsoft/zion";
import { checkRules } from "../_utils";

export default function parent(rule) {
  checkRules(rule);

  return function(_model) {
    return $do(function*() {
      const { parentModel } = yield Reader.ask();
      return yield rule(parentModel) |> contramap((ctx) => ctx.parentContext);
    });
  };
}
