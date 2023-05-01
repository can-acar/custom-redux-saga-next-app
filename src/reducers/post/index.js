export const initialState = {
    data: {},
    loading: false,
    error: null,
};

const postReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_POST_REQUEST':
            debugger
            return {...state, loading: true};
        case 'FETCH_POST_SUCCESS':
            debugger
            return {...state, loading: false, data: action.payload};
        case 'FETCH_POST_FAILURE':
            return {...state, loading: false, error: action.error};
        case 'UPDATE_POST_TITLE_REQUEST':
            debugger
            return {...state, loading: true};
        case 'UPDATE_POST_TITLE_SUCCESS':
            debugger
            return {...state, loading: false, data: action.payload};
        default:
            return state;
    }
};
export default postReducer;
