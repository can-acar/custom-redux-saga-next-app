import {useMemo} from "react";
import {produce} from "immer";
import App from "next/app";
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
            if (!context.ctx.req?.wrappedStore) {
                context.ctx.req.wrappedStore = createStore(initialState, middleware);
            }
        }
        
        return {
            
            getState, dispatch, subscribe,
        };
    }
}

export const createWrapper = (initStore) => {
    
    const createProps = async (storeCallback, appContext, initialProp) => {
        
        const store = storeCallback(appContext);
        
        const state = store.getState();
        
        if (appContext.ctx) {
            
            Object.assign(appContext.ctx, {store});
        } else {
            Object.assign(appContext, {store});
        }
        
        if (!Object.hasOwnProperty.call(initialProp.pageProps, 'state')) {
            
            Object.assign(initialProp.pageProps, {state});
        }
        
        
        return {
            state, ...initialProp
        }
        
    }
    const useInitApp = (Component = App) => {
        
        
        const WrappedComponent = (props) => {
            debugger
            const {state, pageProps} = usePageStore(props);
            
            return (<AppProvider initialState={state}>
                <Component {...pageProps} />
            </AppProvider>);
        };
        
        WrappedComponent.displayName = `useInitApp(${Component.displayName || Component.name || Component})`;
        
        if ('getInitialProps' in Component) {
            WrappedComponent.getInitialProps = Component.getInitialProps;
        }
        
        return WrappedComponent;
    };
    const usePageStore = (props) => {
    
        const state = useMemo(() => {
            
            if (props.pageProps && props.pageProps.state) {
                return props.pageProps.state;
            }
            return {};
        }, [props.pageProps]);
        
        const pageProps = useMemo(() => {
            
            const {state, ...combinePageProps} = props.pageProps || {};
            return combinePageProps || {};
        }, [props.pageProps]);
        
        return {state, pageProps};
    };
    const useInitialProps = (handler) => {
        return async (context) => {
            try {
                const nextCallback = handler(context.store);
                const initialProps = (nextCallback && (await nextCallback(context))) || {};
                debugger
                return await createProps(initStore, context, initialProps);
            } catch (error) {
                console.error("Error in useInitialProps:", error);
                throw error;
            }
        };
    };
    const useServerSideProps = (handler) => {
        return async (context) => {
            try {
                const nextCallback = handler(context.store);
                const initialProps = (nextCallback && (await nextCallback(context))) || {};
                return {props: {...initialProps}};
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
        useInitApp,
        useInitialProps,
        useServerSideProps,
        useServerPaths,
        useServerStaticProps,
        usePageStore,
        createStore,
    }
}



