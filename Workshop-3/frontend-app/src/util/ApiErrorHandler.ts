// utils/handleApiError.ts
import { useGlobalAlert } from "../context/AlertContext";

export const useApiErrorHandler = () => {
    const { showAlert } = useGlobalAlert();

    const handleApiError = (
        err: unknown,
        setError: (msg: string) => void,
        customError : string
    ) => {

        if (err instanceof Error) {
            setError(err.message);
        } else if (
            typeof err === "object" &&
            err !== null &&
            "message" in err &&
            typeof (err as Error).message === "string"
        ) {
            setError((err as Error).message);
        } else {
            setError("Unexpected error.");
        }
        showAlert(customError, "error");
    };

    return { handleApiError };

}
