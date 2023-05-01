import {useContext, useReducer} from 'react';
import stateContext from "@/contexts/state-context";


const useAppReducer = (reducerKey, reducer, initialState = {}) => {

    const appContext = useContext(stateContext);

    const state = appContext?.state[reducerKey] || initialState;
    const dispatch = action => appContext?.dispatch({...action, reducerKey});

    // const _reducer_ = useReducer(reducer, state, dispatch);

    //return useReducer(reducer, state, dispatch);

    return [state, dispatch];
}


export default useAppReducer;
