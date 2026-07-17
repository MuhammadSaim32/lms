import { Modal, Box } from "@mui/material"

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
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#0f172a',
    color: '#f1f5f9',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const CustomModel = ({ open, setOpen, Component, setRoute }: Props) => {

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Component setRoute={setRoute} setOpen={setOpen} />
            </Box>
        </Modal >
    )
}

export default CustomModel