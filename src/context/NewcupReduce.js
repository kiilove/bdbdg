export const NewcupReducer = (state, action) => {
  switch (action.type) {
    case "KEEP":
      return {
        newCup: action.payload.cupData,
        step: action.payload.step,
      };
    case "END":
      return {
        newCup: null,
        step: null,
      };
    default:
      return state;
  }
};
