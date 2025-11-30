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
    deleteProfessor,
    updateProfessor
} from "../../../api/businessApi/ProfessorService";
import { useGlobalAlert } from "../../../context/AlertContext";
import { useApiErrorHandler } from "../../../util/ApiErrorHandler";
import { type FormEvent } from "../../../util/FormEvent";

export const ProfessorsTab = () => {
    const [professors, setProfessors] = useState<Professor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { showAlert } = useGlobalAlert();
    const { handleApiError } = useApiErrorHandler();
    // Modal create
    const [open, setOpen] = useState(false);

    // Modal edit
    const [editOpen, setEditOpen] = useState(false);
    const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);

    // Modal delete
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedProfessorId, setSelectedProfessorId] = useState<number | null>(null);

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
                handleApiError(err, setError, "Error fetching professors.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfessors();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleChange = (
        e: FormEvent
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
            showAlert("Professor created successfully", "success");
        } catch (err) {
            handleApiError(err, setError, "Error creating professor.");
        }
    };

    const handleOpenDeleteModal = (id: number) => {
        setSelectedProfessorId(id);
        setDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedProfessorId === null) return;
        try {
            await deleteProfessor(selectedProfessorId);
            setProfessors((prev) => prev.filter(p => p.id !== selectedProfessorId));
            showAlert("Professor deleted successfully", "success");
        } catch (err) {
            handleApiError(err, setError, "Error deleting professor.");
        } finally {
            setDeleteOpen(false);
            setSelectedProfessorId(null);
        }
    };

    const handleEditClick = (professor: Professor) => {
        setSelectedProfessor(professor);
        setFormData({
            name: professor.name,
            email: professor.email,
            specialty: professor.specialty,
        });
        setEditOpen(true);
    };

    const handleUpdateProfessor = async () => {
        if (!selectedProfessor || !validateForm()) return;

        try {
            const updatedProfessor: Professor = {
                ...selectedProfessor,
                name: formData.name,
                email: formData.email,
                specialty: formData.specialty,
            };

            const response = await updateProfessor(updatedProfessor);

            setProfessors((prev) =>
                prev.map((p) => (p.id === selectedProfessor.id ? response : p))
            );

            setEditOpen(false);
            setSelectedProfessor(null);
            setFormData({ name: "", email: "", specialty: "" });
            showAlert("Professor updated successfully", "success");
        } catch (err) {
            handleApiError(err, setError, "Error updating professor.");
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
                <Button data-testid="add-professor" variant="contained" onClick={() => setOpen(true)}>
                    Add +
                </Button>
            </Box>

            <Box sx={{ mt: 3 }}>
                {professors.length > 0 ? (
                    professors.map((professor) => (
                        <ProfessorCard
                            data-testid={`professor-${professor.id}`}
                            key={professor.id}
                            professor={professor}
                            showActions
                            onEdit={() => handleEditClick(professor)}
                            onDelete={handleOpenDeleteModal}
                        />
                    ))
                ) : (
                    <Typography variant="body1">No professors found.</Typography>
                )}
            </Box>

            {/* Modal Create */}
            <Dialog data-testid="create-professor-modal" open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Create Professor</DialogTitle>
                <DialogContent
                    sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
                >
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

                    <TextField
                        inputProps={{ 'data-testid': 'input-email' }}
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
                            data-testid="select-specialty"
                            displayEmpty
                            name="specialty"
                            value={formData.specialty}
                            onChange={handleChange}
                        >
                            <MenuItem value="" disabled>
                                Select Specialty
                            </MenuItem>
                            {specialties.map((spec) => (
                                <MenuItem data-testid={`specialty-${spec}`} key={spec} value={spec}>
                                    {spec}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{formErrors.specialty}</FormHelperText>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        data-testid="submit-professor"
                        variant="contained"
                        onClick={handleCreateProfessor}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal Edit */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                <DialogTitle>Edit Professor</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <TextField
                        sx={{
                            mt: "5px"
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
                            <MenuItem value="" disabled>Select Specialty</MenuItem>
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
                    <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleUpdateProfessor}>
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal confirm delete */}
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this professor?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleConfirmDelete}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
