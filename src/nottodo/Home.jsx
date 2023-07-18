import React, { useContext, useEffect, useState } from "react";
import ListItem from "./ListItem";
import { UserContext } from "../Context";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

export default function Home() {
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();
    const logout = useContext(UserContext).logout;
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();

    const loggedIn = useContext(UserContext).logged.Logged;

    useEffect(() => {
        if (!loggedIn) {
            navigate('/login');
        }
    }, []);

    const getTasks = () => {
        fetch("http://localhost:5000/tasks", {
            method: 'GET',
        })
            .then(res => res.json())
            .then(async (res) => {
                setTasks(res);
            })
    }

    const handleClose = () => {
        getTasks();
        setOpen(false);
    }

    const add = async () => {
        if (title && description) {
            let data = {
                title: title,
                description: description,
            }
            await fetch("http://localhost:5000/insertTask", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            })
                .then(res => res.json())
                .then(async (res) => {
                    getTasks();
                    setOpen(false);
                })
        }
    }

    useEffect(() => {
        getTasks();
    }, [])

    return (
        <>
            <div style={{ marginTop: '5px', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'inline-block' }}>
                    <h2 style={{ color: '#0d6efd', textDecoration: 'underline' }}>Not To Do List</h2>
                </div>

                <div style={{ display: 'inline-block', float: 'right', marginTop: '20px', marginRight: '25px' }}>
                    {useContext(UserContext).logged.role == 'admin' ? <button onClick={() => setOpen(true)} className="addButton">Add +</button> : null}
                    <button onClick={() => { logout(); navigate('/login') }} style={{ marginLeft: '10px', backgroundColor: '#0d6efd', color: 'white' }} className="addButton">Logout</button>
                </div>

            </div>
            <div className="row">
                {
                    tasks && tasks.map((t) => (
                        <ListItem t={t} getTasks={getTasks} />
                    ))
                }
            </div>
            <Dialog fullWidth open={open} onClose={handleClose}>
                <DialogTitle>Add Task</DialogTitle>
                <DialogContent>
                    <TextField value={title} onChange={(e) => setTitle(e.target.value)} size="small" fullWidth placeholder="Title" />
                    <TextField value={description} onChange={(e) => setDescription(e.target.value)} size="small" sx={{ marginTop: '10px' }} fullWidth placeholder="Description" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={add}>Add</Button>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}