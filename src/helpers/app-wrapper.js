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

    const initApp = (Component) => {


        Component.getInitialProps = async (appContext) => {

            let pageProps = {};

            const store = createStore(initialState);
            debugger
            Object.assign(appContext, {store});

            if (Component.getInitialProps) {
                pageProps = await App.getInitialProps(appContext);
            }

            pageProps.state = initialState;

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
                console.error('Error in getInitialProps:', error);
                throw error;
            }
        }
    }
    const useServerSideProps = (handler) => {
        return async (context) => {
            try {
                const pageProps = await handler(context);
                return {pageProps};
            } catch (error) {
                console.error('Error in useServerSideProps:', error);
                throw error;
            }
        }
    }
    const useServerStaticProps = (handler) => {
        return async (context) => {
            try {
                const pageProps = await handler(context);
                return {pageProps};
            } catch (error) {
                console.error('Error in useServerStaticProps:', error);
                throw error;
            }
        }
    }
    const useServerPaths = (handler) => {
        return async (context) => {
            try {
                const pageProps = await handler(context);
                return {pageProps};
            } catch (error) {
                console.error('Error in useServerPaths:', error);
                throw error;
            }
        }
    }


    return {
        dispatch, getState, initApp, useInitialProps, useServerSideProps, useServerStaticProps, useServerPaths
    }
}

