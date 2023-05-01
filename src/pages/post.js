import {useEffect, useReducer} from 'react';
import useAppReducer from "@/hooks/use-app-reducer";
import useSaga from "@/hooks/use-saga";
import useReduce from "@/hooks/use-reduce";
import {fetchPostSaga, updatePostTitleSaga} from "@/sagas/post";
import postReducer from "@/reducers/post";
import {createSagaMiddleware, runGenerator} from "@/helpers/create-saga-middleware";
import wrapper from "@/helpers/wrapper";


function* fetchData(action) {
    try {
        const response = yield fetch('https://jsonplaceholder.typicode.com/todos/1');
        const data = yield response.json();
        yield {type: 'FETCH_POST_SUCCESS', payload: data};
    } catch (error) {
        yield {type: 'FETCH_POST_FAILURE', error};
    }
}

const effects = {"FETCH_POST_REQUEST": fetchData};

const PostPage = () => {
    const [postState, postDispatch] = useAppReducer("post", postReducer);
    const post = useReduce((state) => state?.post);
    const saga = useSaga({FETCH_POST_REQUEST: fetchPostSaga, UPDATE_POST_TITLE_REQUEST: updatePostTitleSaga});

    useEffect(() => {
        debugger
        saga({type: "FETCH_POST_REQUEST"});
        //postDispatch({type: "FETCH_POST_REQUEST"});
    }, []);

    const handleUpdateTitle = async () => {
        const newTitle = prompt("Enter new title");
        if (newTitle) {
            await saga({type: "UPDATE_POST_TITLE_REQUEST", payload: {title: newTitle}});
        }
    };

    return (
        <div>
            {postState.loading ? (
                <p>Loading...</p>
            ) : postState.error ? (
                <p>Error: {postState.error.message}</p>
            ) : (
                <div>
                  <pre>
                    {JSON.stringify(post, null, 2)}
                  </pre>
                    <button onClick={handleUpdateTitle}>Update Title</button>
                </div>
            )}
        </div>
    );
};
export const getServerSideProps = wrapper.useServerSideProps((store) => async (context) => {
    debugger


    return {props: {}};
});

export default PostPage;
