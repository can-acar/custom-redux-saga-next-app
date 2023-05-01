import React, {useReducer, useMemo} from 'react';

const useStore = (pageState, initialState) => {
    const [state, dispatch] = useReducer(
        (state, newState) => ({...state, ...newState}),
        initialState
    );

    const store = useMemo(() => ({state, dispatch}), [state]);

    return {
        store,
        pageState,
    };
};

export default useStore;
