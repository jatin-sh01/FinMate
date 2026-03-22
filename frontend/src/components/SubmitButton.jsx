import React from "react";
import { Button } from "@nextui-org/react";

const SubmitButton = ({ isLoading, handleSubmit, isDisabled }) => {
  return (
    <Button
      variant="shadow"
      radius="full"
      isLoading={isLoading}
      isDisabled={isDisabled}
      className="premium-button text-lg font-semibold w-full mt-8"
      onClick={handleSubmit}
    >
      Continue
    </Button>
  );
};

export default SubmitButton;
