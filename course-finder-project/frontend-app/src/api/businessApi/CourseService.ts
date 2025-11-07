import type { Course } from "../../models/Course";
import api from "./Api";

export const getCourses = async () => {
  const res = await api.get("/courses");
  return res.data;
};

export const createCourse = async (courseData: Course) => {
  const res = await api.post("/courses", courseData);
  return res.data;
};
export const searchCourses = async (query: string) => {
  const res = await api.get(`/courses/search`, { params: { q: query } });
  return res.data;
};

export const searchByTeacher = async (teacherName: string) => {
  const res = await api.get(`/teachers/search`, { params: { name: teacherName } });
  return res.data;
};

export const deleteCourse = async (id: number) => {
  const res = await api.delete(`/courses/${id}`);
  return res.data;
};
