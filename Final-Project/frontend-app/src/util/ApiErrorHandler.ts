import { useGlobalAlert } from "../context/AlertContext";

export const useApiErrorHandler = () => {
    const { showAlert } = useGlobalAlert();

    const handleApiError = (
        err: unknown,
        customError: string
    ) => {
        let error = "";
        if (err instanceof Error) {
            error = err.message;
        } else if (
            typeof err === "object" &&
            err !== null &&
            "message" in err &&
            typeof (err as Error).message === "string"
        ) {
            error = (err as Error).message;
        } else {
            error = "Unexpected error.";
        }
        showAlert(customError || error, "error");
    };

    return { handleApiError };

}
