const fetchApi = async (url) => {
    const response = await fetch(url);
    return await response.json();
}

async function* fetchPostSaga(action, dispatch) {

    if (action.type === "FETCH_POST_REQUEST") {

        const result = await fetchApi("https://jsonplaceholder.typicode.com/posts/1");

        yield dispatch({type: "FETCH_POST_SUCCESS", payload: result});
    }
}

function* updatePostTitleSaga(action, dispatch) {
    if (action.type === "UPDATE_POST_TITLE_REQUEST") {
        // Başlığı güncellemek için asenkron işlemlerinizi burada yapabilirsiniz

        const newTitle = action.payload;
        yield dispatch({type: "UPDATE_POST_TITLE_SUCCESS", payload: newTitle});
    }
}

export {fetchPostSaga, updatePostTitleSaga};