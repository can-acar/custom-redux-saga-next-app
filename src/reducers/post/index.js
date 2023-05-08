export const initialState = {
    data: [],
    loading: false,
    error: null,
};


const postReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_POST':
            return {...state, posts: [...state.data, action.payload]};
        default:
            return state;
    }
};
export default postReducer;
