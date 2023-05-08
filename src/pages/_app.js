import '@assets/globals.css';
import {AppProvider} from "@/contexts/app-provider";
import wrapper from "@/store/store";


const InitMain = ({Component, ...rest}) => {


    debugger
    return (
        <AppProvider initialState={rest}>
            <Component {...rest.pageProps} />
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
