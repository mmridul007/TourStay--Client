// import { createContext, useReducer } from "react";

// const INITIAL_STATE = {
//   city: undefined,
//   dates: [],
//   options: {
//     adult: undefined,
//     children: undefined,
//     room: undefined,
//   },
// };

// export const SearchContext = createContext(INITIAL_STATE);

// const SearchReducer = (state, action) => {
//   switch (action.type) {
//     case "NEW_SEARCH":
//       return action.payload;
//     case "RESET_SEARCH":
//       return INITIAL_STATE;
//     default:
//       return state;
//   }
// };

// export const SearchContextProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(SearchReducer, INITIAL_STATE);

//   return (
//     <SearchContext.Provider
//       value={{
//         city: state.city,
//         dates: state.dates,
//         options: state.options,
//         dispatch,
//       }}
//     >
//       {children}
//     </SearchContext.Provider>
//   );
// };

import { createContext, useReducer } from "react";

const INITIAL_STATE = {
  city: undefined,
  dates: [],
  options: {
    adult: 1,
    children: 0,
    room: 1,
  },
};

export const SearchContext = createContext(INITIAL_STATE);

const SearchReducer = (state, action) => {
  switch (action.type) {
    case "NEW_SEARCH":
      return {
        city: action.payload.city,
        dates: action.payload.dates,
        options: {
          ...state.options, // Keep existing options
          ...action.payload.options, // Merge new options
        },
      };
    case "RESET_SEARCH":
      return { ...INITIAL_STATE };
    default:
      return state;
  }
};

export const SearchContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(SearchReducer, INITIAL_STATE);

  return (
    <SearchContext.Provider
      value={{
        ...state, // Spread to pass all state values
        dispatch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
