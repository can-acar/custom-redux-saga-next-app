import {useContext} from "react";
import {runGenerator} from "@/helpers/create-saga-middleware";
import stateContext from "@/contexts/state-context";

const useSaga = (effects) => {
    const appContext = useContext(stateContext);

    return (action) => {
        if (effects.hasOwnProperty(action.type)) {
            const generator = effects[action.type](action, appContext?.dispatch);
            return runGenerator(generator, appContext);
        }
    };
};

export default useSaga;
