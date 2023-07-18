import { Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, TextField, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { UserContext } from "../Context";

export default function ListItem(props) {
    const [open, setOpen] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [title, setTitle] = useState(props.t.title);
    const [description, setDescription] = useState(props.t.description);
    const user = useContext(UserContext).logged.user;
    const [acknowledged, setAcknowledged] = useState(false);
    const [ackList, setAckList] = useState([]);
    let role = useContext(UserContext).logged.role;

    const handleClose = () => {
        setOpen(false);
        props.getTasks();
    }

    const handleCloseUpdate = () => {
        setOpenUpdate(false);
        props.getTasks();
    }

    const deleteTask = async () => {
        let data = {
            title: props.t.title,
            description: props.t.description,
        }
        await fetch("http://localhost:5000/deleteTask", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
            .then(res => res.json())
            .then(async (res) => {
                props.getTasks();
            })
    }

    const update = async () => {
        let data = {
            oldtitle: props.t.title,
            olddescription: props.t.description,
            newtitle: title,
            newdescription: description
        }
        await fetch("http://localhost:5000/updateTask", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
            .then(res => res.json())
            .then(async (res) => {
                setOpenUpdate(false);
                props.getTasks();
            })
    }

    const checkIfAcknowledged = async () => {
        let data = {
            title: props.t.title,
            email: user,
        }
        await fetch("http://localhost:5000/checkIfAcknowledged", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
            .then(res => res.json())
            .then(async (res) => {
                if (res == true) {
                    setAcknowledged(true);
                }
            })
    }

    const getAcknowledgeList = async () => {
        let data = {
            title: props.t.title,
        }
        await fetch("http://localhost:5000/getAcknowledgeList", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
            .then(res => res.json())
            .then(async (res) => {
                setAckList(res);
            })
    }

    const viewTask = () => {
        setOpen(true);
        if (role == 'employee') checkIfAcknowledged();
        if (role == 'admin') getAcknowledgeList();
    }

    const acknowledge = async () => {
        let data = {
            title: props.t.title,
            email: user,
        }
        await fetch("http://localhost:5000/acknowledge", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
            .then(res => res.json())
            .then(async (res) => {
                checkIfAcknowledged();
            })
    }

    return (
        <div className="column">
            {/* <div className="card">Hello</div> */}
            <Card sx={{ backgroundColor: '#fbfbfb' }}>
                <CardContent>
                    <Typography noWrap>{props.t.title}</Typography>
                    <Typography noWrap>{props.t.description}</Typography>
                </CardContent>
                <CardActions
                    disableSpacing
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "flex-start",
                        p: 0,
                        marginBottom: 1
                    }}>
                    {
                        useContext(UserContext).logged.role == 'admin' ?
                            <>
                                <IconButton color="primary" onClick={deleteTask} size="small"><DeleteIcon /></IconButton>
                                <IconButton color="primary" onClick={() => setOpenUpdate(true)} size="small"><CreateIcon /></IconButton>
                            </>
                            : null
                    }

                    <IconButton color="primary" onClick={viewTask} size="small"><VisibilityIcon /></IconButton>
                </CardActions>
            </Card>
            <Dialog fullWidth open={open} onClose={handleClose}>
                <DialogTitle>{props.t.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{props.t.description}</DialogContentText>
                    <Typography sx={{ marginTop: '50px' }} variant="h6">Acknowledgements</Typography>
                    {
                        useContext(UserContext).logged.role == 'admin' ?
                        <List>
                            {ackList && ackList.map((al) => (
                                <Typography>{al.email}</Typography>
                            ))}
                        </List>
                        :
                        null
                    }
                </DialogContent>
                <DialogActions>
                    {useContext(UserContext).logged.role == 'employee' ? <Button onClick={acknowledge} disabled={acknowledged}>{acknowledged ? "Acknowledged" : "Acknowledge"}</Button> : null}
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
            <Dialog fullWidth open={openUpdate} onClose={handleCloseUpdate}>
                <DialogTitle>Update Task</DialogTitle>
                <DialogContent>
                    <TextField value={title} onChange={(e) => setTitle(e.target.value)} size="small" fullWidth placeholder="Title" />
                    <TextField value={description} onChange={(e) => setDescription(e.target.value)} size="small" sx={{ marginTop: '10px' }} fullWidth placeholder="Description" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={update} disabled={title == props.t.title && description == props.t.description}>Update</Button>
                    <Button onClick={handleCloseUpdate}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}