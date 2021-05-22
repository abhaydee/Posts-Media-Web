import { set } from "mongoose";
import React, { useState } from "react";

export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState);
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };
  const onSubmit = (event) => {
    event.preventDefault();
    callback();
  };
  console.log("returning the values", values);
  return {
    handleChange,
    values,
    onSubmit,
  };
};
