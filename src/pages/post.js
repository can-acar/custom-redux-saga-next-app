import {useEffect, useReducer, useState} from 'react';
import useAppReducer from "@/hooks/use-app-reducer";
import useSaga from "@/hooks/use-saga";
import useReduce from "@/hooks/use-reduce";
import {fetchPostSaga, updatePostTitleSaga} from "@/sagas/post";
import postReducer from "@/reducers/post";
import {createSagaMiddleware, runGenerator} from "@/helpers/create-saga-middleware";
import wrapper from "@/helpers/wrapper";
import {useStore} from "@/contexts/app-provider";
import mediator from "@/helpers/mediator";


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
    const [state, dispatchPost] = useStore('post', postReducer);
    const [inputValue, setInputValue] = useState('');
    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const generator = mediator.publish('action', {
            type: 'ADD_POST',
            payload: {title: inputValue},
        });

        for await (const action of generator) {
            dispatchPost(action);
        }

        setInputValue('');
    };

    return (
        <div>
            <h1>Post Page</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={inputValue} onChange={handleChange}/>
                <button type="submit">Add Post</button>
            </form>
            <ul>
                {state.post.data.map((post, index) => (
                    <li key={index}>{post.title}</li>
                ))}
            </ul>
        </div>
    );
};
export const getServerSideProps = wrapper.useServerSideProps((store) => async (context) => {
    debugger


    return {props: {}};
});

export default PostPage;
