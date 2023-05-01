import {fetchPostSaga, updatePostTitleSaga} from "@/sagas/post";

export default function* rootSaga() {
    yield* fetchPostSaga
    yield* updatePostTitleSaga
}