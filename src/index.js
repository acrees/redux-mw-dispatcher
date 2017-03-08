export default function dispatcher(name, funs, log = console.log) {
  return store => next => action => {
    if (!action.type || !action.type.startsWith(name + '/')) return next(action);

    var actionName = action.type.substring(action.type.indexOf('/') + 1);
    var f = funs[actionName];
    if (f) {
      f(action, store.dispatch, store.getState);
      return;
    }

    log("Dispatcher for '" + name + "' has no registered handler for '" + actionName + "'");
    return next(action);
  };
}
