import { useContext } from "react";
import { ErrorContext } from "../components/ErrorReport/Provider";

export const useErrorLogger = () => {
    const context = useContext(ErrorContext);
    if (!context) throw new Error('useErrorLogger deve estar dentro de ErrorProvider');
    return context.reportError;
};
