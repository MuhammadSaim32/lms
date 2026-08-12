import { Modal, Box } from "@mui/material"
import ClearIcon from '@mui/icons-material/Clear';
interface Props {
    open: boolean
    setOpen: (open: boolean) => void
    Component: any
    setRoute: (val: string) => void

}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: 400,
    bgcolor: '#0f172a', // slate-900
    color: '#f1f5f9',
    border: '1px solid #1e293b', // slate-800
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
    p: 4,
};

const CustomModel = ({ open, setOpen, Component, setRoute }: Props) => {

    const handleClose = (event, reason) => {
        if (reason == "backdropClick" || reason === 'escapeKeyDown'){
            return 
        }
        setOpen(false)
        
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <button className="absolute cursor-pointer top-4 right-4 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full p-1 transition-all"
                onClick={handleClose}
                ><ClearIcon fontSize="small" /></button>
                <Component setRoute={setRoute} setOpen={setOpen} />
            </Box>
        </Modal >
    )
}

export default CustomModel