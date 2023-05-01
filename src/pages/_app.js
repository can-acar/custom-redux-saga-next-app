import '@assets/globals.css';

import rootSaga from "@/sagas/root-saga";
import App from "next/app";
import store from "@/store/store";


const InitMain = ({Component, ...rest}) => {

    const {AppProvider, pageProps} = store.useAppStore(rest);
    debugger
    return (
        <AppProvider rootSaga={rootSaga}>
            <Component {...pageProps} />
        </AppProvider>
    );
}

InitMain.getInitialProps = store.useServerInitialProps(store => async (appContext) => {
    debugger

    const appProps = await App.getInitialProps(appContext);

    return {...appProps};
});


export default InitMain;
