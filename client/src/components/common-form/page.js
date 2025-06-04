"use client";

import { useContext, useState } from "react";
import { Button } from "../ui/button";
import FormControl from "./form-controls";
import { AuthContext } from "@/context/auth-context";
import { useRouter } from "next/navigation";

const CommonForm = ({
  handleSubmit,
  buttonText,
  formControls = [],
  formData,
  setFormData,
  isButtonDisabled = false,
}) => {
 
  return (
    <form onSubmit={handleSubmit}>
      <FormControl
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
      />

      <Button
        type="submit"
        className="mt-5 w-full"
        disabled={isButtonDisabled}
      >
        {buttonText || "Submit"}
      </Button>
    </form>
  );
};

export default CommonForm;
