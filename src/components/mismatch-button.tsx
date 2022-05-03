import { Button, ButtonProps, Tooltip } from "@chakra-ui/react";
import { useNetworkMismatch } from "@thirdweb-dev/react";
import React from "react";

export const MismatchButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, isDisabled, onClick, loadingText, type, ...props }, ref) => {
    const networksMismatch = useNetworkMismatch();

    return (
      <Tooltip
        isDisabled={!networksMismatch}
        label="To do this please switch yout wallet network."
        hasArrow
      >
        <Button
          w="full"
          {...props}
          type={type}
          loadingText={loadingText}
          onClick={onClick}
          ref={ref}
          isDisabled={networksMismatch || isDisabled}
        >
          {children}
        </Button>
      </Tooltip>
    );
  }
);

MismatchButton.displayName = "MismatchButton";
