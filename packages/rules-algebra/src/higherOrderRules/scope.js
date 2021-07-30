import { contramap } from "@totalsoft/zion";

export default function scope(rule) {
  return function(model) {
    return (
      rule(model)
      |> contramap((ctx) => ({
        ...ctx,
        document: model,
        prevDocument: ctx.prevModel,
        scopePath: [...ctx.scopePath, ...ctx.fieldPath],
        fieldPath: [],
      }))
    );
  };
}
