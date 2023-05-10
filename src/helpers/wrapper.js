import {useReducer} from "react";
import StateContext from "@/contexts/state-context";

const makeStore = (context) => {


    context.__storeState__ = context?.__storeState__ || {};


    context.useAppStore = (props) => {

        const {pageProps, __storeState__} = props;


        const AppProvider = ({children}) => {

            const initialState = Object.keys(__storeState__).reduce((acc, key) => {
                acc[key] = __storeState__[key](undefined, {type: "@@INIT"});
                return acc;
            }, {});

            const [state, dispatch] = useReducer((state, action) => {

                const nextState = {};

                for (const key in __storeState__) {
                    nextState[key] = __storeState__[key](state[key], action);
                }

                return nextState;

            }, initialState);


            return (
                <StateContext.Provider value={{state, dispatch: dispatch}}>
                    {children}
                </StateContext.Provider>
            );
        };

        return ({

            pageProps: pageProps,
            state: __storeState__,
            AppProvider

        })

    }

    context.useServerSideProps = (handler) => {
        return async (context) => {
            try {

                return {
                    props: {

                        __storeState__: {}
                    },
                };
            } catch (error) {
                console.error('Error in useServerSideProps:', error);
                throw error;
            }
        }
    }

    context.useServerInitialProps = (handler) => {
        return async (context) => {
            try {
                return {
                    props: {

                        pageProps: {__storeState__: {}}
                    },
                };
            } catch (error) {
                console.error('Error in useServerInitialProps:', error);
                throw error;
            }
        }

    }


    return context

};

const useServerSideProps = (handler) => {


};

const useServerInitialProps = (handler) => {


};

const useAppStore = (__storeState__) => {

}


export default {
    makeStore,
    useServerSideProps,
    useServerInitialProps,
    useAppStore

};