import { createContext, useReducer } from "react";

export const AuthContext = createContext({
  user: null,
  login: (data) => {},
  logout: () => {},
});

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = (props) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });

  const login = (data) => {
    dispatch({
      type: "LOGIN",
      payload: data,
    });
  };
  const logout = () => {
    dispatch({
      type: "LOGOUT",
      payload: null,
    });
  };
  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
    ></AuthContext.Provider>
  );
};
