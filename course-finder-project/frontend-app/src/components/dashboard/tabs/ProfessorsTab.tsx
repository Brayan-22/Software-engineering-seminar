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
    FormHelperText,
    FormControl,
} from "@mui/material";
import type { Professor } from "../../../models/Professor";
import { ProfessorCard } from "../../home/ProfessorCard";
import {
    getProfessors,
    createProfessor,
} from "../../../api/businessApi/ProfessorService";

export const ProfessorsTab = () => {
    const [professors, setProfessors] = useState<Professor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal state
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        specialty: "",
    });

    const [formErrors, setFormErrors] = useState({
        name: "",
        email: "",
        specialty: "",
    });

    const specialties = [
        "Mathematics",
        "Computer Science",
        "Physics",
        "Chemistry",
        "Philosophy",
        "Economics",
    ];

    useEffect(() => {
        const fetchProfessors = async () => {
            try {
                const data = await getProfessors();
                setProfessors(data.professors);
            } catch (err) {
                console.error(err);
                setError("Error loading professors");
            } finally {
                setLoading(false);
            }
        };

        fetchProfessors();
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
        const errors = { name: "", email: "", specialty: "" };

        if (!formData.name.trim()) {
            errors.name = "Name is required";
            valid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            errors.email = "Email is required";
            valid = false;
        } else if (!emailRegex.test(formData.email)) {
            errors.email = "Invalid email format";
            valid = false;
        }

        if (!formData.specialty) {
            errors.specialty = "Please select a specialty";
            valid = false;
        }

        setFormErrors(errors);
        return valid;
    };

    const handleCreateProfessor = async () => {
        if (!validateForm()) return;

        try {
            const professor: Professor = {
                id: 0,
                name: formData.name,
                email: formData.email,
                specialty: formData.specialty,
            };

            const newProfessor = await createProfessor(professor);
            setProfessors((prev) => [...prev, newProfessor]);
            setOpen(false);
            setFormData({ name: "", email: "", specialty: "" });
            setFormErrors({ name: "", email: "", specialty: "" });
        } catch (err) {
            console.error("Error creating professor:", err);
        }
    };

    if (loading)
        return <Typography sx={{ mt: 2 }}>Loading professors...</Typography>;

    if (error)
        return (
            <Typography sx={{ mt: 2, color: "red" }} variant="body1">
                {error}
            </Typography>
        );

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", justifyContent: "left", gap: "40px" }}>
                <Typography variant="h4">Professors 📚</Typography>
                <Button variant="contained" onClick={() => setOpen(true)}>
                    +
                </Button>
            </Box>

            <Box sx={{ mt: 3 }}>
                {professors.length > 0 ? (
                    professors.map((professor) => (
                        <ProfessorCard
                            key={professor.id}
                            professor={professor}
                            showActions
                        />
                    ))
                ) : (
                    <Typography variant="body1">No professors found.</Typography>
                )}
            </Box>

            {/* Modal */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Create Professor</DialogTitle>
                <DialogContent
                    sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
                >
                    <TextField sx={{
                        mt: "4px"
                    }}
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                    />
                    <FormControl fullWidth error={!!formErrors.specialty}>
                        <Select
                            displayEmpty
                            name="specialty"
                            value={formData.specialty}
                            onChange={handleChange}
                        >
                            <MenuItem value="" disabled>
                                Select Specialty
                            </MenuItem>
                            {specialties.map((spec) => (
                                <MenuItem key={spec} value={spec}>
                                    {spec}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{formErrors.specialty}</FormHelperText>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateProfessor}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
