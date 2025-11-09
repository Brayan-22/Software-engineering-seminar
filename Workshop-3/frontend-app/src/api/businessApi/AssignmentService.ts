import type { Assignment } from "../../models/Assignment";
import api from "./Api"

export const createAssignment = async (assignmentData: Assignment) => {
    const res = await api.post("/assignments", assignmentData);
    return res.data;
};

export const getAssignments = async () => {
    const res = await api.get("/assignments");
    return res.data;
}

export const deleteAssignment = async (id: number) => {
    const res = await api.delete(`/assignmnets${id}`)
    return res.data;
}