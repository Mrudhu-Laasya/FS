import { useState } from "react";
import { EditContext } from "./EditContext";

export default function EditProvider({ children }) {
  const [isEditValid, setIsEditValid] = useState(false);

  return (
    <EditContext.Provider
      value={{
        isEditValid,
        setIsEditValid,
      }}
    >
      {children}
    </EditContext.Provider>
  );
}
