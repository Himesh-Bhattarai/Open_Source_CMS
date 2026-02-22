// core/eventBus.js
const listeners = {};

export const emitEvent = (eventName, payload) => {
  if (!listeners[eventName]) return;
  listeners[eventName].forEach((handler) => handler(payload));
};

export const onEvent = (eventName, handler) => {
  if (!listeners[eventName]) listeners[eventName] = [];
  listeners[eventName].push(handler);
};
