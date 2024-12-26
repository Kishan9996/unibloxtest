import {
    Box,
    Typography,
} from '@mui/material';
import AdminDiscountList from '../components/Admin/AdminDiscountList';
import AdminUserList from '../components/Admin/AdminUserSummeryList';

const AdminHome = () => {
    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" sx={{ marginBottom: 3 }}>
                Admin Dashboard
            </Typography>
            <AdminDiscountList />
            <AdminUserList />
        </Box>
    );
};

export default AdminHome;
