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
    bgcolor: '#0f172a',
    color: '#f1f5f9',
    border: '2px solid #000',
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
                <button className="absolute  cursor-pointer top-2 right-2 bg-red-700 px-1"
                onClick={handleClose}
                ><ClearIcon/></button>
                <Component setRoute={setRoute} setOpen={setOpen} />
            </Box>
        </Modal >
    )
}

export default CustomModel