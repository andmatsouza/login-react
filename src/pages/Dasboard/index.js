import React from "react";

export const Dasboard = () => {

  const token = localStorage.getItem('token');
  return(
    <div>
      <h1>Dasboard</h1>
      <p>Token: {token}</p>
    </div>
  );
}