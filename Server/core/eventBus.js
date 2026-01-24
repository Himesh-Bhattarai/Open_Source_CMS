// core/eventBus.js
const listeners = {}

export const emitEvent = (eventName, payload) => {
    console.log("EMIT_EVENT called:", eventName, payload); // <--- add this
    if (!listeners[eventName]) return
    listeners[eventName].forEach((handler) => handler(payload))
}

export const onEvent = (eventName, handler) => {
    if (!listeners[eventName]) listeners[eventName] = []
    listeners[eventName].push(handler)
}

