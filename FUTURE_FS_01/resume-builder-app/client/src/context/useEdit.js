import { useContext } from "react";
import { EditContext } from "./EditContext";

export default function useEdit() {
  return useContext(EditContext);
}
