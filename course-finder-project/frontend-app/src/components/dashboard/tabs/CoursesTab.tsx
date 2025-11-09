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
    Select,
    MenuItem,
    FormControl,
    FormHelperText,
} from "@mui/material";
import type { Course } from "../../../models/Course";
import { CourseCard } from "../../home/CourseCard";
import {
    getCourses,
    createCourse,
    deleteCourse,
    updateCourse
} from "../../../api/businessApi/CourseService";
import { useGlobalAlert } from "../../../context/AlertContext";

export const CoursesTab = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { showAlert } = useGlobalAlert();

    // modal create
    const [open, setOpen] = useState(false);

    // modal delete confirm
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const [formData, setFormData] = useState({
        code: "",
        name: "",
        day: "",
        time: "",
    });

    const [formErrors, setFormErrors] = useState({
        code: "",
        name: "",
        day: "",
        time: "",
    });

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const timeSlots = ["8am - 10am", "10am - 12m", "12m - 2pm", "2pm - 4pm"];

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getCourses();
                setCourses(data.courses);
            } catch (err) {
                console.error(err);
                setError("Error loading courses");
                showAlert("Error loading courses", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name!]: value }));
        setFormErrors((prev) => ({ ...prev, [name!]: "" }));
    };

    const validateForm = () => {
        let valid = true;
        const errors = { code: "", name: "", day: "", time: "" };

        if (!formData.code.trim()) {
            errors.code = "Code is required";
            valid = false;
        }
        if (!formData.name.trim()) {
            errors.name = "Name is required";
            valid = false;
        }
        if (!formData.day) {
            errors.day = "Please select a day";
            valid = false;
        }
        if (!formData.time) {
            errors.time = "Please select a time slot";
            valid = false;
        }

        setFormErrors(errors);
        return valid;
    };

    const handleCreateCourse = async () => {
        if (!validateForm()) return;

        try {
            const schedule = `${formData.day} ${formData.time}`;
            console.log("sch: " + schedule);
            const course: Course = {
                id: 0,
                code: formData.code,
                name: formData.name,
                schedule,
            };

            const newCourse = await createCourse(course);
            setCourses((prev) => [...prev, newCourse]);
            setOpen(false);
            setFormData({ code: "", name: "", day: "", time: "" });
            setFormErrors({ code: "", name: "", day: "", time: "" });
            showAlert("Course created successfully!", "success");
        } catch (err) {
            console.error("Error creating course:", err);
            showAlert("Failed to create course", "error");
        }
    };

    const handleDeleteClick = (course: Course) => {
        setSelectedCourse(course);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedCourse) return;

        try {
            await deleteCourse(selectedCourse.id);
            setCourses((prev) => prev.filter((c) => c.id !== selectedCourse.id));
            showAlert(`Deleted course "${selectedCourse.name}"`, "success");
        } catch (err) {
            console.error("Error deleting course:", err);
            showAlert("Error deleting course", "error");
        } finally {
            setConfirmOpen(false);
            setSelectedCourse(null);
        }
    };

    const handleEditClick = (course: Course) => {
        const [day, time] = course.schedule.split(" ");
        setFormData({ code: course.code, name: course.name, day, time });
        setSelectedCourse(course);
    };

    const handleUpdateCourse = async () => {
        if (!selectedCourse || !validateForm()) return;
        try {
            const updatedCourse = {
                ...selectedCourse,
                code: formData.code,
                name: formData.name,
                schedule: `${formData.day} ${formData.time}`,
            };
            console.log("UPDATED COURSE: " + JSON.stringify(updatedCourse,null,2));
            const response = await updateCourse(updatedCourse);
            setCourses((prev) =>
                prev.map((c) => (c.id === selectedCourse.id ? response : c))
            );
            setSelectedCourse(null);
            showAlert("Course updated successfully!", "success");
        } catch (err) {
            console.error("Error updating course:", err);
            showAlert("Error updating course", "error");
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
                <Typography variant="h4">Courses 📘</Typography>
                <Button variant="contained" onClick={() => setOpen(true)}>
                    Add +
                </Button>
            </Box>

            <Box sx={{ mt: 3 }}>
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            onEdit={() => handleEditClick(course)}
                            onDelete={() => handleDeleteClick(course)}
                            showActions
                        />
                    ))
                ) : (
                    <Typography variant="body1">No courses found.</Typography>
                )}
            </Box>

            {/* Modal create */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Create Course</DialogTitle>
                <DialogContent
                    sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
                >
                    <TextField
                        sx={{ mt: "5px" }}
                        label="Code"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        fullWidth
                        error={!!formErrors.code}
                        helperText={formErrors.code}
                    />
                    <TextField
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                    />
                    <FormControl fullWidth error={!!formErrors.day}>
                        <Select
                            displayEmpty
                            name="day"
                            value={formData.day}
                            onChange={handleChange}
                        >
                            <MenuItem value="" disabled>
                                Select Day
                            </MenuItem>
                            {days.map((day) => (
                                <MenuItem key={day} value={day}>
                                    {day}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{formErrors.day}</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth error={!!formErrors.time}>
                        <Select
                            displayEmpty
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                        >
                            <MenuItem value="" disabled>
                                Select Time Slot
                            </MenuItem>
                            {timeSlots.map((slot) => (
                                <MenuItem key={slot} value={slot}>
                                    {slot}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{formErrors.time}</FormHelperText>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateCourse}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal edit */}
            <Dialog open={!!selectedCourse && !confirmOpen && !open} onClose={() => setSelectedCourse(null)}>
                <DialogTitle>Edit Course</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <TextField
                        sx={{ mt: "5px" }}
                        label="Code"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        fullWidth
                        error={!!formErrors.code}
                        helperText={formErrors.code}
                    />
                    <TextField
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                    />
                    <FormControl fullWidth error={!!formErrors.day}>
                        <Select displayEmpty name="day" value={formData.day} onChange={handleChange}>
                            <MenuItem value="" disabled>Select Day</MenuItem>
                            {days.map((day) => (
                                <MenuItem key={day} value={day}>{day}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{formErrors.day}</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth error={!!formErrors.time}>
                        <Select displayEmpty name="time" value={formData.time} onChange={handleChange}>
                            <MenuItem value="" disabled>Select Time Slot</MenuItem>
                            {timeSlots.map((slot) => (
                                <MenuItem key={slot} value={slot}>{slot}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{formErrors.time}</FormHelperText>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedCourse(null)}>Cancel</Button>
                    <Button variant="contained" onClick={handleUpdateCourse}>Save Changes</Button>
                </DialogActions>
            </Dialog>

            {/* Modal confirm delete */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete{" "}
                        <strong>{selectedCourse?.name}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
