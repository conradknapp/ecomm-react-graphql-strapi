import React from "react";
import { GridLoader } from "react-spinners";
import { Box } from "gestalt";

const Loader = ({ show }) =>
  show && (
    <Box
      fit
      dangerouslySetInlineStyle={{
        __style: {
          bottom: 250,
          left: "50%",
          transform: "translateX(-50%)"
        }
      }}
      paddingX={1}
      position="fixed"
    >
      <GridLoader color="darkorange" size={25} margin="3px" />
    </Box>
  );

export default Loader;
