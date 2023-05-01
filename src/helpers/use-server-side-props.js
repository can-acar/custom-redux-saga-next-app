import createAppStore from "@/helpers/store";

const useServerSideProps = (handler) => {

    return async (context) => {

        const store = createAppStore()

        try {
            const result = await handler(store)(context);

            return {
                props: {
                    ...result.props,
                    __storeState__: store.getState(),
                },
            };

        } catch (error) {
            console.error('Error in useServerStore:', error);
            throw error;
        }
    };
};

export default useServerSideProps;