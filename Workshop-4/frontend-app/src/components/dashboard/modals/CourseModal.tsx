import { useEffect, useState } from "react";
import {
    Box,
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
    Typography,
} from "@mui/material";
import type { Course } from "../../../models/Course"
import {
    createCourse,
    updateCourse,
    deleteCourse,
} from "../../../api/businessApi/CourseService";

import { useGlobalAlert } from "../../../context/AlertContext";
import { useApiErrorHandler } from "../../../util/ApiErrorHandler";
import { type FormEvent } from "../../../util/FormEvent";

type CourseModalProps = {
    selectedCourse: Course | null;
    mode: "create" | "edit" | "delete" | "";
    onClose: () => void;
    isOpen: boolean;
    onCourseCreated?: (course: Course) => void;
    onCourseUpdated?: (course: Course) => void;
    onCourseDeleted?: (Course: Course) => void;
};

export const CourseModal = ({
    selectedCourse,
    isOpen,
    onClose,
    mode,
    onCourseCreated,
    onCourseUpdated,
    onCourseDeleted
}: CourseModalProps) => {

    const [error, setError] = useState<string | null>(null);

    const { showAlert } = useGlobalAlert();
    const { handleApiError } = useApiErrorHandler();

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

    const handleChange = (e: FormEvent) => {
        const { name, value } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: value }));
        setFormErrors(prev => ({ ...prev, [name]: "" }));
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
            const course: Course = {
                id: 0,
                code: formData.code,
                name: formData.name,
                schedule,
            };

            const newCourse = await createCourse(course);
            onCourseCreated?.(newCourse);
            onClose();
            setFormData({ code: "", name: "", day: "", time: "" });
            setFormErrors({ code: "", name: "", day: "", time: "" });
            showAlert("Course created successfully!", "success");
        } catch (err) {
            handleApiError(err, setError, "Error creating course.");
        }
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
            const response = await updateCourse(updatedCourse);
            onCourseUpdated?.(response);
            onClose();
            showAlert("Course updated successfully!", "success");
        } catch (err) {
            handleApiError(err, setError, "Error updating course.");
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedCourse) return;

        try {
            await deleteCourse(selectedCourse.id);
            onCourseDeleted?.(selectedCourse);
            showAlert(`Deleted course "${selectedCourse.name}"`, "success");
        } catch (err) {
            handleApiError(err, setError, "Error deleting course");
        } finally {
            onClose();
        }
    };

    useEffect(() => {
        if (mode === "edit" && selectedCourse) {
            const [day, ...timeParts] = selectedCourse.schedule.split(" ");
            const time = timeParts.join(" ");
            setFormData({
                code: selectedCourse.code,
                name: selectedCourse.name,
                day,
                time
            });
            setFormErrors({ code: "", name: "", day: "", time: "" });
        }

        if (mode === "create") {
            setFormData({ code: "", name: "", day: "", time: "" });
            setFormErrors({ code: "", name: "", day: "", time: "" });
        }
    }, [mode, selectedCourse]);

    switch (mode) {
        case "create":
            return (
                <Dialog
                    data-testid="create-course-modal"
                    open={isOpen}
                    onClose={onClose}
                >
                    <DialogTitle>Create Course</DialogTitle>
                    <DialogContent
                        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
                    >
                        <TextField
                            inputProps={{ 'data-testid': 'input-code' }}
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
                            inputProps={{ 'data-testid': 'input-name' }}
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
                                data-testid="select-day"
                                displayEmpty
                                name="day"
                                value={formData.day}
                                onChange={handleChange}
                            >
                                <MenuItem value="" disabled>
                                    Select Day
                                </MenuItem>
                                {days.map((day) => (
                                    <MenuItem
                                        key={day}
                                        value={day}
                                        data-testid={`day-${day}`}
                                    >
                                        {day}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{formErrors.day}</FormHelperText>
                        </FormControl>
                        <FormControl fullWidth error={!!formErrors.time}>
                            <Select
                                data-testid="select-time"
                                displayEmpty
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                            >
                                <MenuItem value="" disabled>
                                    Select Time Slot
                                </MenuItem>
                                {timeSlots.map((slot) => (
                                    <MenuItem
                                        key={slot}
                                        value={slot}
                                        data-testid={`time-${slot}`}
                                    >
                                        {slot}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{formErrors.time}</FormHelperText>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button
                            data-testid="submit-course"
                            variant="contained"
                            onClick={handleCreateCourse}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            );

        case "edit":
            return (
                <Dialog
                    data-testid="edit-course-modal"
                    open={isOpen}
                    onClose={onClose}
                >
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
                            <Select
                                displayEmpty
                                name="day"
                                value={formData.day}
                                onChange={handleChange}
                            >
                                <MenuItem value="" disabled>Select Day</MenuItem>
                                {days.map((day) => (
                                    <MenuItem key={day} value={day}>{day}</MenuItem>
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
                                <MenuItem value="" disabled>Select Time Slot</MenuItem>
                                {timeSlots.map((slot) => (
                                    <MenuItem key={slot} value={slot}>{slot}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{formErrors.time}</FormHelperText>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button variant="contained" onClick={handleUpdateCourse}>
                            Save Changes
                        </Button>
                    </DialogActions>
                </Dialog>
            );

        case "delete":
            return (
                <Dialog
                    data-testid="delete-course-modal"
                    open={isOpen}
                    onClose={onClose}
                >
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete{" "}
                            <strong>{selectedCourse?.name}</strong>?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleConfirmDelete}
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            );

        default:
            return null;
    }
}