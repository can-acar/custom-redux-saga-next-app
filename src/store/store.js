import {createStore} from "@/helpers/app-wrapper";
import produce from "immer";

let initialSate = {
    user: ((draft, action) => {
        switch (action.type) {
            case "SET_USER":
                draft = action.payload;
                break;
            default:
                break;
        }
        return draft;
    })
}

const wrapper = createStore(initialSate);
export default wrapper;
