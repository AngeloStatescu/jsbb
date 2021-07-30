import Reader from "@totalsoft/zion/data/reader";
import { curry } from "ramda";
import { contramap, $do } from "@totalsoft/zion";
import { checkRules } from "../_utils";
import { findMatchingItem } from "@totalsoft/change-tracking";

export const field = curry(function field(key, rule) {
    checkRules(rule);
    return function (model) {
        return rule(model[key])
            |> _logFieldPath
            |> _filterCurrentProp(model) 
            |> contramap(ctx => _getFieldContext(model, ctx, key))
            |> mergeParent(model, key)
    }      
});

const mergeParent = curry(function mergeParent(model, field, fieldRule) {
    return $do(function* () {
        const fieldValue = yield fieldRule;

        if (model[field] === fieldValue) {
            return model;
        }

        return Array.isArray(model)
            ? Object.assign([], model, { [field]: fieldValue })
            : { ...model, [field]: fieldValue }
    });
});

function _logFieldPath(reader) {
    return $do(function* () {
        const fieldContext = yield Reader.ask();
        const result = yield reader;
        if (result !== Object(result))
            _log(fieldContext, `Rule result is ${result} for path ${[...fieldContext.scopePath, ...fieldContext.fieldPath].join(".")}`);
        return result;
    });
}

const _filterCurrentProp = curry( function(model, reader) {
    return $do(function* () {
        const { prevModel } = yield Reader.ask();

        if (_isPrimitiveValue(model) && model !== prevModel) {
            return model;
        }

        return yield reader;
    });
});

function _isPrimitiveValue(model) {
    return (typeof (model) !== "object" && !Array.isArray(model)) || model === null || model === undefined
}

function _getFieldContext(parentModel, parentContext, key) {
    const prevModel = Array.isArray(parentModel)
        ? findMatchingItem(parentModel[key], key, parentContext.prevModel)
        : parentContext.prevModel && parentContext.prevModel[key]

    return { ...parentContext, fieldPath: [...parentContext.fieldPath, key], prevModel, parentModel, parentContext };
}

function _log(context, message) {
    if (context.log) {
        context.logger.log(message);
    }
}

export default field