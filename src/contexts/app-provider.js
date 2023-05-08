import React, {createContext, useContext, useEffect, useReducer} from 'react';
import mediator from "@/helpers/mediator";

const AppStateContext = createContext();
const AppDispatchContext = createContext();
const AppMediatorContext = createContext();

export const AppProvider = ({children, initialState}) => {
    const [state, dispatch] = useReducer((state, action) => {
        const reducer = state[action.reducerName];
        if (!reducer) return state;

        const newState = {...state};
        newState[action.reducerName] = reducer(state[action.reducerName], action);
        return newState;
    }, initialState);

    //const mediator = new Mediator();

    useEffect(() => {
        const unsubscribe = mediator.subscribe('action', (action) => {
            dispatch(action);
        });
        mediator.run('action');
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <AppStateContext.Provider value={state}>
            <AppDispatchContext.Provider value={dispatch}>
                {/*<AppMediatorContext.Provider value={mediator}>*/}
                {children}
                {/*</AppMediatorContext.Provider>*/}
            </AppDispatchContext.Provider>
        </AppStateContext.Provider>
    );
};

export const useAppState = () => useContext(AppStateContext);
export const useAppDispatch = () => useContext(AppDispatchContext);

export const useStore = (reducerName, reducer) => {
    const state = useAppState();
    const dispatch = useAppDispatch();

    if (!state[reducerName] && reducer) {
        dispatch({type: '@@INIT', reducerName, reducer});
    }

    const subState = state[reducerName];

    return [subState, (action) => dispatch({...action, reducerName})];
};