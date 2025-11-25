import type { SelectChangeEvent } from "@mui/material";

export type FormEvent =
    | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    | SelectChangeEvent;