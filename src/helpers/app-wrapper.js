import {useMemo} from "react";
import {produce} from "immer";
import {AppProvider} from "@/contexts/app-provider";

export const createStore = (initialState, middleware) => {
    
    let state = initialState;
    let listeners = [];
    
    const getState = () => {
        
        // initialState ={app: appReducer} return to {app: {data: {}, loading: false, error: null}}
        return Object.keys(state).reduce((acc, key) => {
            acc[key] = state[key](undefined, {type: '@@INIT'});
            return acc;
        }, {})
        
    }
    
    const dispatch = (action) => {
        state = produce(state, (draftState) => {
            for (const key in draftState) {
                if (draftState.hasOwnProperty(key) && typeof draftState[key] === 'function') {
                    draftState[key] = draftState[key](draftState, action);
                }
            }
        });
        
        if (middleware) {
            middleware({getState, dispatch})(action);
        }
        
        listeners.forEach(listener => listener());
    }
    
    const subscribe = (listener) => {
        listeners.push(listener);
        
        return () => {
            listeners = listeners.filter(l => l !== listener);
        }
    }
    
    return (context) => {
        
        
        if (typeof window === 'undefined') {
            if (!context.req?.wrappedStore) {
                context.req.wrappedStore = createStore(initialState, middleware);
            }
        }
        
        return {
            
            getState, dispatch, subscribe,
        };
    }
}

export const createWrapper = (initStore) => {
    
    
    const createProps = async (storeCallback, appContext, initialProps) => {
        
        const store = storeCallback(appContext);
        
        const state = store.getState();
        
        if (appContext.ctx) {
            
            Object.assign(appContext.ctx, {store});
        } else {
            Object.assign(appContext, {store});
        }
        
        if (!Object.hasOwnProperty.call(initialProps, 'state')) {
            
            Object.assign(initialProps, {state});
        }
        
        return {
            state,
            initialProps
        }
        
    }
    const withMain = (Component) => {
        const WrappedComponent = (props) => {
            
            const {state, props: combinedProps} = usePageStore(props);
            
            return (<AppProvider initialState={state}>
                <Component {...(combinedProps)} />
            </AppProvider>);
        };
        
        WrappedComponent.displayName = `withMain(${Component.displayName || Component.name || Component})`;
        
        if (Component.getInitialProps !== undefined) {
            
            WrappedComponent.getInitialProps = Component.getInitialProps;
        }
        
        return WrappedComponent;
    }
    
    const usePageStore = (p) => {
        const {...props} = p;
        
        debugger
        let resultProps = props;
        
        resultProps.pageProps = props.pageProps.props || {};
        
        resultProps.initialState = props.pageProps.initialState;
        
        
        const state = useMemo(() => {
            
            if (resultProps.pageProps && resultProps.pageProps.state) {
                return resultProps.pageProps.state;
            }
            
            return {};
        }, [resultProps.pageProps]);
        
        const pageProps = useMemo(() => {
            
            const {...combinePageProps} = props || {};
            
            return combinePageProps;
        }, [props]);
        
        //
        // delete resultProps?.pageProps.initialState;
        // delete resultProps?.pageProps.initialProps
        
        
        return {state, props: {...resultProps}};
    }
    
    
    const useInitialProps = (handler) => {
        return async (context) => {
            try {
                const pageProps = await createProps(initStore, context, {});
                const nextCallback = handler(context.store);
                const serverSideProps = (nextCallback && (await nextCallback(context))) || {};
                return {...pageProps, ...serverSideProps};
            } catch (error) {
                console.error("Error in useInitialProps:", error);
                throw error;
            }
        };
    };
    const useServerSideProps = (handler) => {
        return async (context) => {
            try {
                
                const pageProps = await createProps(initStore, context, {});
                const nextCallback = handler(context.store);
                const serverSideProps = (nextCallback && (await nextCallback(context))) || {};
                debugger
                return {props: {...pageProps, ...serverSideProps},};
            } catch (error) {
                console.error("Error in useServerSideProps:", error);
                throw error;
            }
        };
    };
    const useServerStaticProps = (handler) => {
        return async (context) => {
            try {
                const pageProps = await handler(context);
                return {props: {...pageProps}};
            } catch (error) {
                console.error("Error in useServerStaticProps:", error);
                throw error;
            }
        };
    };
    const useServerPaths = (handler) => {
        return async (context) => {
            try {
                const paths = await handler(context);
                return {paths, fallback: false};
            } catch (error) {
                console.error("Error in useServerPaths:", error);
                throw error;
            }
        };
    };
    
    
    return {
        withMain,
        useInitialProps,
        useServerSideProps,
        useServerPaths,
        useServerStaticProps,
        usePageStore,
        createStore,
    }
}



