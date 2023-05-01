import wrapper from "@/helpers/wrapper";
import rootSaga from "@/sagas/root-saga";
import {initialize} from "next/client";

let initialSate = {}

const appStore = ((context) => {
    debugger


    return context;
});

const store = wrapper.makeStore(appStore, rootSaga, initialSate);

export default store;