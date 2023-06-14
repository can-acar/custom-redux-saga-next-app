export const initialState = {
    data: {}, loading: false, error: null,
};

const actions = {
    
    ['SET_APP_DATA']: (state, action) => {
        return {
            ...state, data: action.payload, loading: true,
        }
    }, ['SET_APP_DONE']: (state, action) => {
        return {
            ...state, loading: false, data: action.payload,
        }
    }
    
}

const appReducer = (state = initialState, action) => {
    
    if (actions[action.type]) {
        
        return Object.assign({}, actions[action.type](state, action));
    }
    
    return state;
};

export default appReducer;