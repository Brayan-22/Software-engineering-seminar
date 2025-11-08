import { useState, type SyntheticEvent } from 'react';
import { Box, Typography } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { CoursesTab } from "../dashboard/tabs/CoursesTab"
import { ProfessorsTab } from './tabs/ProfessorsTab';
import { AssignmentsTab } from './tabs/AssignmentsTab';
export const CenteredTabs = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{
            width: '100%',
            bgcolor: 'background.paper',
            borderRadius: "16px"
        }}>
            <Tabs value={value} onChange={handleChange} centered>
                <Tab label="Show Courses" />
                <Tab label="Show Professors" />
                <Tab label="Assignments" />
            </Tabs>

            {/* Contenido dinámico según tab */}
            <Box sx={{ p: 3 }}>
                {value === 0 && <CoursesTab></CoursesTab>}
                {value === 1 && <ProfessorsTab></ProfessorsTab>}
                {value === 2 && <AssignmentsTab></AssignmentsTab>}
            </Box>
        </Box>
    );
}
