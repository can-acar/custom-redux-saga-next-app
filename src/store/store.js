import {createStore, createWrapper} from "@/helpers/app-wrapper";

let initialSate = {
    deneme: () => "deneme"
}

const store = createStore(initialSate);

const wrapper = createWrapper(store);
export default wrapper;
