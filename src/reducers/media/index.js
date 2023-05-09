export const initialState = {
    data: null,
    loading: false,
    error: null,
};

const mediaReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_MEDIA_REQUEST':
            return {...state, loading: true};
        case 'FETCH_MEDIA_SUCCESS':
            return {...state, loading: false, data: action.payload};
        case 'FETCH_MEDIA_FAILURE':
            return {...state, loading: false, error: action.error};
        default:
            return state;
    }
};

export default mediaReducer;