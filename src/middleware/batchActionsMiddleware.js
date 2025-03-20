/**
 * Middleware for handling batched Redux actions.
 * When it receives a batch action, it sequentially dispatches each contained action.
 * This reduces the number of renders and recalculations during complex state updates.
 */
const batchActionsMiddleware = store => next => action => {
  // Check if this is a batch action
  if (action.type === 'savedCalculations/batchLoadCalculation' && action.payload?.actions) {
    // Process each action in the batch
    action.payload.actions.forEach(batchedAction => {
      store.dispatch(batchedAction);
    });
    
    // Return the last action result
    return action;
  }
  
  // For regular actions, just pass through to the next middleware
  return next(action);
};

export default batchActionsMiddleware; 