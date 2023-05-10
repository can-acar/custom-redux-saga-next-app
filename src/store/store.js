import {createStore, createWrapper} from "@/helpers/app-wrapper";
import appReducer from "@/reducers/default";

let initialSate = ({
    "app": appReducer
})

const store = createStore(initialSate);

const wrapper = createWrapper(store);
export default wrapper;
