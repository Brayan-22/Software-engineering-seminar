import api from "./Api";
import type { Professor } from "../../models/Professor";
export const getProfessors = async () => {
  const res = await api.get("/professors");
  return res.data;
};

export const searchProfessors = async (query: string) => {
  const res = await api.get("/professors/search", { params: { q: query } });
  return res.data;
};

export const getProfessorById = async (id: number) => {
  const res = await api.get(`/professors/${id}`);
  return res.data;
};

export const createProfessor = async (profData: Professor) => {
  const res = await api.post("/professors", profData);
  return res.data;
};

export const updateProfessor = async ( professor: Professor) => {
  const res = await api.put(`/professors/${professor.id}`, professor);
  return res.data;
};

export const deleteProfessor = async (id: number) => {
  const res = await api.delete(`/professors/${id}`);
  return res.data;
};
