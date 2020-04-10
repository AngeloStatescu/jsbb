import { useState, useCallback } from 'react';
import { create, ensureArrayUIDsDeep, detectChanges, setInnerProp } from '@totalsoft/change-tracking';

export function useChangeTrackingState(initialModel) {
    const [dirtyInfo, setDirtyInfo] = useState(create)
    const [model, setModel] = useState(ensureArrayUIDsDeep(initialModel))

    return [
        model,
        
        dirtyInfo,

        // Update model or property
        useCallback((value, propertyPath = undefined) => {
            const changedModel = propertyPath ? setInnerProp(model, propertyPath, value) : value
            if (changedModel === model) {
                return model;
            }

            const newModel = ensureArrayUIDsDeep(changedModel)
            const newDirtyInfo = detectChanges(newModel, model, dirtyInfo)
            setModel(newModel)
            setDirtyInfo(newDirtyInfo)
        }, [model, dirtyInfo]),

        // Reset tracking
        useCallback((newModel = undefined)  => {
            setDirtyInfo(create())
            if (newModel !== undefined) {
                setModel(ensureArrayUIDsDeep(newModel));
            }
        }, [])
    ]
}

