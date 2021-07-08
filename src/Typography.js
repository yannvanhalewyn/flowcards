import React from "react";

export const DashedHeading = ({ children }) => (
  <React.Fragment>
    <h1 className="font-bold text-xl mb-2 text-center">{children}</h1>
    <hr className="mb-4 border-2 border-dashed border-yellow-200"/>
  </React.Fragment>
)
