import Reader from "@totalsoft/zion/data/reader";
import { contramap } from "@totalsoft/zion";
import { checkRules } from "../_utils";
import { $do } from "@totalsoft/zion";

export default function root(rule) {
  checkRules(rule);

  return function(_model) {
    return $do(function*() {
      let ctx = yield Reader.ask();
      let model;
      while (ctx?.parentModel) {
        model = ctx.parentModel;
        ctx = ctx.parentContext;
      }
      return yield rule(model) |> contramap(_ctx => ctx);
    });
  };
}