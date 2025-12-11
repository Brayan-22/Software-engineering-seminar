import { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import type { Course } from "../../../models/Course";
import { CourseCard } from "../../home/CourseCard";
import { getCourses } from "../../../api/businessApi/CourseService";
import { useApiErrorHandler } from "../../../util/ApiErrorHandler";
import { CourseModal } from "../modals/CourseModal";

export const CoursesTab = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const { handleApiError } = useApiErrorHandler();

    const [openModal, setOpenModal] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit" | "delete" | "">("");
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const onCourseCreated = (newCourse: Course) => {
        console.log("created", newCourse);
        setCourses((prev) => [...prev, newCourse]);
    }

    const onCourseUpdated = (response: Course) => {
        setCourses((prev) =>
            prev.map((c) => (c.id === response.id ? response : c))
        );
    }

    const onCourseDeleted = (course: Course) => {
        setCourses((prev) => prev.filter((c) => c.id !== course.id));
    }

    const handleOpenCreate = () => {
        setSelectedCourse(null);
        setModalMode("create");
        setOpenModal(true);
    };

    const handleOpenEdit = (course: Course) => {
        setSelectedCourse(course);
        setModalMode("edit");
        setOpenModal(true);
    };

    const handleOpenDelete = (course: Course) => {
        setSelectedCourse(course);
        setModalMode("delete");
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setSelectedCourse(null);
        setOpenModal(false);
    }

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getCourses();
                setCourses(data.courses);
            } catch (err) {
                handleApiError(err, "Error fetching courses.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (loading)
        return <Typography sx={{ mt: 2 }}>Loading courses...</Typography>;

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", justifyContent: "left", gap: "40px" }}>
                <Typography variant="h4">Courses 📘</Typography>
                <Button
                    data-testid="add-course"
                    variant="contained"
                    onClick={handleOpenCreate}
                >
                    Add +
                </Button>
            </Box>

            <Box sx={{ mt: 3 }}>
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            onEdit={() => handleOpenEdit(course)}
                            onDelete={() => handleOpenDelete(course)}
                            showActions
                        />
                    ))
                ) : (
                    <Typography variant="body1">No courses found.</Typography>
                )}
            </Box>

            <CourseModal
                selectedCourse={selectedCourse}
                isOpen={openModal}
                onClose={handleCloseModal}
                mode={modalMode}
                onCourseCreated={onCourseCreated}
                onCourseUpdated={onCourseUpdated}
                onCourseDeleted={onCourseDeleted}
            />
        </Box>
    );
};