import {useContext} from "react";
import StateContext from "@/contexts/state-context";

const useReduce = selector => {
    const appContext = useContext(StateContext);
    return selector(appContext?.state);
};

export default useReduce;