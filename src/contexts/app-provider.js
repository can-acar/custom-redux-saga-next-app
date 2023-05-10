import React, {createContext, useContext, useEffect, useReducer} from 'react';
import produce, {produceWithPatches} from 'immer';
import mediator from "@/helpers/mediator";


const AppStateContext = createContext();
const AppDispatchContext = createContext();
const AppMediatorContext = createContext();

export const AppProvider = ({children, initialState, debug = true}) => {

        const [state, dispatch] = useReducer((state, action) => {

            const reducer = state[action.reducerName];

            if (!reducer) return state;

            const newState = {...state};

            newState[action.reducerName] = reducer(state[action.reducerName], action);


            if (debug) {
                console.log("Action:", action);

            }

            return newState;

        }, initialState.state);
        // const [state, dispatch] = useReducer((state, action) => {
        //     const [nextState, patches, inversePatches] = produceWithPatches(state, draft => {
        //         // Mediator Pattern ile action handling ve generator function özellikleri kullanılacak
        //     });
        //
        //     if (debug) {
        //         console.log("Action:", action);
        //         console.log("Patches:", patches);
        //     }
        //
        //     return nextState;
        // }, initialState);

        //const mediator = new Mediator();

        useEffect(() => {

            const unsubscribe = mediator.subscribe('action', (action) => dispatch(action));
            
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
    }
;

export const useAppState = () => useContext(AppStateContext);
export const useAppDispatch = () => useContext(AppDispatchContext);

export const useStore = (reducerName, reducer) => {
    const state = useAppState();
    const dispatch = useAppDispatch();
    
    if (!Object.hasOwnProperty.call(state, reducerName) && reducer) {
        dispatch({type: '@@INIT', payload: {reducerName, reducer}});

        Object.assign(state, {[reducerName]: reducer(undefined, {type: '@@INIT'})});
    }

    const subState = state//[reducerName];
    const dispatchWithImmer = (action) => {
        const nextState = produce(subState, (draft) => {
            const newState = reducer(draft, action);
            return newState === undefined ? draft : newState;
        });

        dispatch({type: action.type, reducerName, payload: nextState});
    };

    return [subState, dispatchWithImmer];
};