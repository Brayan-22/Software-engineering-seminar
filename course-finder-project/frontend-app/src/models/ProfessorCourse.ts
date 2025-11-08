import type { Course } from "./Course";
import type { Professor } from "./Professor";

export interface ProfessorCourse {
    groupId: number,
    professor: Professor,
    course: Course,
    assignedAt: Date,
    status: string
}