import { Box, Button, Typography, Divider } from "@mui/material";
import type { Course } from "../../models/Course";

type CourseCardProps = {
    course: Course;
    showActions?: boolean;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
};

export const CourseCard = ({
    course,
    showActions = false,
    onEdit,
    onDelete,
}: CourseCardProps) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#EBF1F4",
                borderRadius: "16px",
                py: "10px",
                px: "30px",
                mt: "15px",
            }}
        >
            {/* Left box: code*/}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    minWidth: "120px",
                }}
            >
                <Typography variant="h6">Code</Typography>
                <Typography>{course.code}</Typography>
            </Box>
            <Divider orientation="vertical" flexItem />

            {/* Course info */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flexGrow: 1,
                }}
            >
                <Typography variant="h6" textAlign="center">
                    {course.name}
                </Typography>
                <Typography textAlign="center">Schedule: {course.schedule}</Typography>
            </Box>

            {/* Actions */}
            {showActions && (
                <>
                    <Divider orientation="vertical" flexItem />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            gap: "10px",
                            minWidth: "200px",
                        }}
                    >
                        <Button variant="contained"
                            onClick={() => onEdit?.(course.id)}
                            sx={{ textTransform: "none" }}

                        >
                            Edit
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => onDelete?.(course.id)}
                            sx={{ textTransform: "none" }}

                        >
                            Delete
                        </Button>
                    </Box>
                </>
            )}
        </Box>

    );
};
