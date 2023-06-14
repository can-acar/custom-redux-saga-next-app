import '@assets/globals.css';
import {AppProvider} from "@/contexts/app-provider";
import wrapper from "@/store/store";
import {useMemo, useState} from "react";


const MyApp = ({Component, pageProps}) => <Component {...pageProps} />

// MyApp.getInitialProps = async ({Component, ctx}) => {
//     debugger
//     const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
//
//     return {pageProps};
// }


export default wrapper.withMain(MyApp);

// InitMain.getInitialProps = wrapper.useInitialProps(store => async (appContext) => {
//
//     let pageProps = {};
//
//     if (appContext.Component.getInitialProps) {
//
//         pageProps = await appContext.Component.getInitialProps(appContext.ctx);
//     }
//
//     return {pageProps};
// })