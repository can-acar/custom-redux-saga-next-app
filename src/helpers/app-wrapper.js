import App from "next/app";

export const createStore = (initialState) => {
    const state = {};

    for (const key in initialState) {
        if (typeof initialState[key] === "function") {
            state[key] = initialState[key](state, {type: "@@INIT"});
        } else {
            console.warn(`initialState[${key}] is not a function.`);
        }
    }

    const dispatch = (action) => {
        for (const key in initialState) {
            state[key] = initialState[key](state[key], action);
        }
    }
    const getState = () => {
        return state;
    }

    return {
        getState,
        dispatch
    }
}

export const createWrapper = async (store) => {


    const initApp = (Component) => {
        Component.getInitialProps = async (appContext) => {


            let pageProps = {};
            const state = store.getState();

            Object.assign(appContext, {store});
            debugger
            if (Component.getInitialProps) {
                pageProps = await App.getInitialProps(appContext);
            }

            Object.assign(pageProps.state, {store});

            return pageProps
        };

        return Component;
    }

    const useInitialProps = (handler) => {
        return async (context) => {
            try {
                const pageProps = await handler(context);
                return {pageProps};
            } catch (error) {
                console.error("Error in useInitialProps:", error);
                throw error;
            }
        };
    };

    const useServerSideProps = (handler) => {
        return async (context) => {
            try {
                const pageProps = await handler(context);
                return {props: {...pageProps}};
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
        initApp,
        useInitialProps,
        useServerSideProps,
        useServerPaths,
        useServerStaticProps,
    }
}



