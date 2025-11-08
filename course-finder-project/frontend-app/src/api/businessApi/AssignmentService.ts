import type { Assignment } from "../../models/Assignment";
import api from "./Api"

export const createAssignment = async (assignmentData: Assignment) => {
    console.log("📦 Enviando assignmentData:", JSON.stringify(assignmentData, null, 2));
    const res = await api.post("/assignments", assignmentData);
    return res.data;
};

export const getAssignments = async () => {
    const rest = await api.get("/assignments");
    return rest.data;
}