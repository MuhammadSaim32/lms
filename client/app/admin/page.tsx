import Badge from '@mui/material/Badge';
import EmailIcon from '@mui/icons-material/Email';

export default function Admin() {
    return (
        <div>
            <h1>Admin</h1>


            <Badge
                badgeContent={5}
                color="secondary"
                max={100}
            >
                <EmailIcon />
            </Badge>
        </div>
    );
}