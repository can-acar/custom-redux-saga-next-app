import '@assets/globals.css';
import wrapper from "@/helpers/app-wrapper";
import {AppProvider} from "@/contexts/app-provider";


const InitMain = ({Component, ...rest}) => {


    debugger
    return (
        <AppProvider initialState={pageProps.state}>
            <Component {...pageProps} />
        </AppProvider>
    );
}

// InitMain.getInitialProps = store.useServerInitialProps(store => async (appContext) => {
//     debugger
//
//     const appProps = await App.getInitialProps(appContext);
//
//     return {...appProps};
// });


export default wrapper.initApp(InitMain);
