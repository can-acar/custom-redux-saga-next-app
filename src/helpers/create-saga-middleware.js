// sagaMiddleware.js

export const createSagaMiddleware = () => {
    const runSaga = async (sagas, action) => {
        const sagaContext = {action};

        for (const saga of sagas) {
            const generator = saga(action);
            await runGenerator(generator, sagaContext);
        }
    };
    return (store) => (next) => (action) => {
        store.runSaga = runSaga;
        return next(action);
    };


};

export const runGenerator = async (generator, context) => {
    let next = {done: false, value: undefined};
    while (!next.done) {
        try {
            next = await generator.next(context);
            if (!next.done) {
                const action = next.value;
                if (action) {
                    context?.dispatch(action);
                }
            }
        } catch (error) {
            console.error("Saga error:", error);
            break;
        }
    }

}

// const step = (input) => {
//     const result = generator.next(input);
//
//     if (!result.done) {
//         if (result.value instanceof Promise) {
//             result.value.then((res) => step(res)).catch((err) => generator.throw(err));
//         } else {
//             step(result.value);
//         }
//     }
// };
//
// step();

// return (store) => (next) => (action) => {
//     const sagaContext = {store};
//
//     Object.values(sagaRegistry).forEach((saga) => {
//         const generator = saga(action, store.dispatch);
//         runGenerator(generator, sagaContext).then(r => console.log(r));
//     });
//
//     return next(action);
// };
