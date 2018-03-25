# redux-mw-dispatcher #

This is a library implementing a pattern I've used on a couple of Redux projects
with a lot of moving parts. Instead of using thunks and action creators that
return functions, which I've found a little hard to manage, it allows defining
a dispatcher to listen for namespaced actions and trigger asynchronous tasks.

## Usage ##

    import dispatcher from 'redux-mw-dispatcher';

    export async function doAsync(action) {
      // asynchronous work
    }

    export default dispatcher('test', {
      'execute': doAsync
    });

Now, when an action of type `'test/execute'` is dispatched, the `doAsync`
function will execute.

## Parameters ##

The properties passed to the asynchronous function are, in order:
 * the dispatched action that triggered the call
 * the redux store's `dispatch` function
 * the redux store's `getState` function

So, `dispatch` and `getState` can be used as in thunks to interact with redux.

When unit testing, it can be beneficial to pass additional dependencies as arguments:

    export async function loadData(fetch, action, dispatch) {
      let response = await fetch('/getData');
      if (response.ok) {
        let model = parseModel(response);
        dispatch(dataLoaded(model));
      }
    }

    export default dispatcher('test', {
      'load': loadData.bind(fetch);
    });

Now, we can pass a stub to the function when testing it:

    let response = { id: '1' };
    let fetchStub = async (url, options) => {
      return { ok: true, json: async () => response };
    }
    await loadData(fetchStub, { type: 'test/load' });
