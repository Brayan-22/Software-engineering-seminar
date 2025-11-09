import type { Course } from "./Course";
import type { Professor } from "./Professor";

export interface Assignment {
    id: number,
    professor: Professor,
    professor_id: number,
    course: Course,
    course_id: number,
    assigned_at: Date,
    status: string
}