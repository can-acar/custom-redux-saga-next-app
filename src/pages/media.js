import {useEffect, useReducer, useState} from 'react';
import useAppReducer from "@/hooks/use-app-reducer";
import useSaga from "@/hooks/use-saga";
import useReduce from "@/hooks/use-reduce";




function* fetchMedia(action, dispatch) {
    try {
        const response = yield fetch('https://jsonplaceholder.typicode.com/todos/1');

        const data = yield response.json();

        yield {type: 'FETCH_MEDIA_SUCCESS', payload: data};
    } catch (error) {
        yield {type: 'FETCH_MEDIA_FAILURE', error};
    }
}

const effects = {"FETCH_MEDIA_REQUEST": fetchMedia};

const MediaListPage = (props) => {
    const [currentPage, setPage] = useState(1);
    const {state, dispatch} = useAppReducer('media', initialState, mediaReducer);
    const media = useReduce(state => state?.media)
    const saga = useSaga(effects);


    const handleFetchMedia = async (page) => {
        setPage(page)
        await saga({type: "FETCH_MEDIA_REQUEST", payload: {page, limit: 10}});

    }


    useEffect(() => {

        if (!props.state) {
            console.log('Fetch data...');

        }
    }, []);


    return (
        <div>

            <>

                <pre>{JSON.stringify(state, null, 2)}</pre>
                <pre>{JSON.stringify(props.state, null, 2)}</pre>
                <button onClick={() => handleFetchMedia(currentPage + 1)}>Next Media</button>
                <button onClick={() => handleFetchMedia(currentPage - 1)}>Prev Media</button>

            </>

        </div>
    );
};
export const getServerSideProps = async (ctx) => {


    return {props: {}};
};

// export const getServerSideProps = async (ctx) => {
//
//     let state = null;
//
//     try {
//         const saga = createSagaMiddleware();
//
//         ctx.store.dispatch({type: "FETCH_MEDIA_REQUEST", payload: {page: 1, limit: 10}});
//
//         let result = await saga.run(effects);
//
//
//         state = {
//             ...result,
//         };
//
//     } catch (error) {
//         state = {};
//     }
//
//     return {props: {state}};
// };

export default MediaListPage;
