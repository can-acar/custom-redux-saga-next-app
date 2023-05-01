// store.js
import {useContext, useReducer} from "react";
import {createSagaMiddleware} from "@/helpers/create-saga-middleware";
import StateContext from "@/contexts/state-context";

const sagaMiddleware = createSagaMiddleware();

const createAppStore = (rootReducer) => {
    const AppProvider = ({children, rootSaga}) => {
        const initialState = Object.keys(rootReducer).reduce((acc, key) => {
            acc[key] = rootReducer[key](undefined, {type: "@@INIT"});
            return acc;
        }, {});

        const [state, dispatch] = useReducer((state, action) => {
            const nextState = {};
            for (const key in rootReducer) {
                nextState[key] = rootReducer[key](state[key], action);
            }
            return nextState;
        }, initialState);

        const saga = sagaMiddleware({getState: () => state, dispatch})(dispatch);

        saga.runSaga(rootSaga);

        return (
            <StateContext.Provider value={{state, dispatch: dispatch, saga}}>
                {children}
            </StateContext.Provider>
        );
    };

    const useStore = (pagePropsState) => {
        const store = useContext(StateContext);
        const pageProps = {...store, state: pagePropsState};
        return {store, pageProps};
    };

    return {AppProvider, useStore};
};

export default createAppStore;
