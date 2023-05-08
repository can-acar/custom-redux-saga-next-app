class Mediator {
    constructor() {
        this.listeners = new Map();
    }

    subscribe(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
        return () => {
            this.unsubscribe(event, callback);
        };
    }

    unsubscribe(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
        }
    }

    * publish(event, data) {
        const listeners = this.listeners[event] || [];
        for (const listener of listeners) {
            yield listener(data);
        }
    }

    run(event, data) {
        const generator = this.publish(event, data);
        const runNext = (value) => {
            const result = generator.next(value);
            if (!result.done) {
                result.value.then(runNext);
            }
        };
        runNext();
    }

    // * run(event, payload) {
    //     const listeners = this.listeners.get(event) || [];
    //     for (const generator of listeners) {
    //         yield* generator(payload);
    //     }
    // }
}

const mediator = new Mediator();

export default mediator;
