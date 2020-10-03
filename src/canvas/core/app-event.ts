import { EventEmitter } from 'events';

export class AppEvent<T=void> {
    constructor(
        private eventName: string,
        private originEventEmitter: EventEmitter
    ) {
    }

    emit(data: T) {
        this.originEventEmitter.emit(this.eventName, data);
    }

    on(listener: (data: T) => void) {
        this.originEventEmitter.on(this.eventName, listener);
    }

    once(listener: (data: T) => void) {
        this.originEventEmitter.once(this.eventName, listener);
    }

    addListener(listener: (data: T) => void) {
        this.originEventEmitter.addListener(this.eventName, listener);
    }

    removeListener(listener: (data: T) => void) {
        this.originEventEmitter.removeListener(this.eventName, listener);
    }

    removeAllListeners(listener: (data: T) => void) {
        this.originEventEmitter.removeAllListeners();
    }
}
