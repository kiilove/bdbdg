export const EditcupReducer = (state, action) => {
  switch (action.type) {
    case "EDIT":
      //console.log(action.payload);
      return {
        editCup: action.payload.cupData,
        step: action.payload.step,
      };
    case "END":
      return {
        editCup: null,
        step: null,
      };
    default:
      return state;
  }
};
