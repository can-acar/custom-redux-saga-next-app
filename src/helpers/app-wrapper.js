export const initApp = (initialReducers) => {
    const state = {};

    for (const key in initialReducers) {
        state[key] = initialReducers[key](undefined, {type: '@@INIT'});
    }

    return state;
};
const wrapper = {
    initApp: (Component) => {
        const initialState = initApp(initialReducers);

        Component.getInitialProps = async (appContext) => {
            // Diğer getInitialProps işlemleri...
            const pageProps = {};

            // Global state'i `pageProps.state` içine yerleştirin
            pageProps.state = initialState;

            return {pageProps};
        };

        return Component;
    },

    useInitialProps: (handler) => {
        return async (context) => {
            try {
                const pageProps = await handler(context);
                return {pageProps};
            } catch (error) {
                console.error('Error in getInitialProps:', error);
                throw error;
            }
        }
    },

    useServerSideProps: (handler) => {
        return async (context) => {
            try {
                const pageProps = await handler(context);
                return {pageProps};
            } catch (error) {
                console.error('Error in useServerSideProps:', error);
                throw error;
            }
        }
    },

    useServerStaticProps: (handler) => {
        return async (context) => {
            try {
                const pageProps = await handler(context);
                return {pageProps};
            } catch (error) {
                console.error('Error in useServerStaticProps:', error);
                throw error;
            }
        }
    },
    useServerPaths: (handler) => {
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

};

export default wrapper;