import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
import type { Course } from "../../../models/Course";
import { CourseCard } from "../../home/CourseCard";
import { getCourses, createCourse } from "../../../api/businessApi/CourseService";

export const CoursesTab = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // estado modal
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        description: "",
        schedule: "",
    });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getCourses();
                setCourses(data.courses);
            } catch (err) {
                console.error(err);
                setError("Error loading courses");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [courses]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateCourse = async () => {
        try {
            const course: Course = {
                id: 0,
                code: formData.code,
                name: formData.name,
                description: formData.description,
                schedule: formData.schedule,
            }
            const newCourse = await createCourse(course);

            setCourses((prev) => [...prev, newCourse]);
            setOpen(false);
            setFormData({ code: "", name: "", description: "", schedule: "" });
        } catch (err) {
            console.error("Error creating course:", err);
        }
    };

    if (loading)
        return <Typography sx={{ mt: 2 }}>Loading courses...</Typography>;

    if (error)
        return (
            <Typography sx={{ mt: 2, color: "red" }} variant="body1">
                {error}
            </Typography>
        );

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", justifyContent: "left", gap: "40px" }}>
                <Typography variant="h4">Courses</Typography>
                <Button variant="contained" onClick={() => setOpen(true)}>
                    +
                </Button>
            </Box>

            <Box>
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <CourseCard key={course.id} course={course} showActions />
                    ))
                ) : (
                    <Typography variant="body1">No courses found.</Typography>
                )}
            </Box>

            {/* Modal */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Create Course</DialogTitle>
                <DialogContent
                    sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
                >
                    <TextField
                        label="Code"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                        multiline
                    />
                    <TextField
                        label="Schedule"
                        name="schedule"
                        value={formData.schedule}
                        onChange={handleChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateCourse}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
