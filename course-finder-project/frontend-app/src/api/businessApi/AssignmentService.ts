import type { Assignment } from "../../models/Assignment";
import api from "./Api"

export const createAssignment = async (assignmentData: Assignment) => {
    const res = await api.post("/assignmnets", assignmentData);
    return res.data;
};

export const getAssignments = async () => {
    const rest = await api.get("assignments");
    return rest.data;
}