import '@assets/globals.css';
import wrapper from "@/store/store";


const InitMain = ({Component, ...rest}) => {
    //const {state, pageProps} = wrapper.usePageStore(rest);

    return (

        <Component {...rest.pageProps} />

    );
}

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

export default wrapper.useInitApp(InitMain);
