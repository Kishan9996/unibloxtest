import {
    Box,
    Typography,
} from '@mui/material';
import AdminDiscountList from '../components/Admin/AdminDiscountList';

const AdminHome = () => {
    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" sx={{ marginBottom: 3 }}>
                Admin Dashboard
            </Typography>
            <AdminDiscountList />
        </Box>
    );
};

export default AdminHome;
