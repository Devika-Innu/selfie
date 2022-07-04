import { React, useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import Navbar from '../Navbar/Navbar'
import './home.css'

import { db, auth } from '../Firebase/fireBase';
import { collection, doc, addDoc, updateDoc, getDoc, setDoc } from "firebase/firestore"
import styles from "./form.module.css"


function Home() {
    const [taskModal, setTaskModal] = useState(false);
    const [task, setTask] = useState("")
    const [desc, setDesc] = useState("")
    const [category, setCategory] = useState("")
    const [date, setDate] = useState("")

    async function addData() {
        const dataDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (dataDoc.exists()) {
            const currentTaskNo = dataDoc.data().totalTasks
            addDoc(collection(db, "users/" + auth.currentUser.uid + "/tasks"), {
                task: task,
                desc: desc,
                category: category,
                date: date,
                completed: false,
                taskNo: currentTaskNo + 1,
            }).then(() => {
                updateDoc(doc(db, "users", auth.currentUser.uid), {
                    totalTasks: currentTaskNo + 1
                })
            })
        } else {
            addDoc(collection(db, "users/" + auth.currentUser.uid + "/tasks"), {
                task: task,
                desc: desc,
                category: category,
                date: date,
                completed: false,
                taskNo: 1,
            }).then(() => {
                setDoc(doc(db, "users", auth.currentUser.uid), {
                    totalTasks: 1,
                })
            }
            )
        }

    }



    return (
        <div>
            <Navbar />
            <div className="mbox">
                {taskModal &&
                    (<form className={styles.form} onSubmit={(e) => { e.preventDefault(); addData() }}>
                        <div className={styles.modal}>
                            <div onClick={() => { setTaskModal(false) }}>hide</div>
                            <div>
                                <input type="text" id="task" className="taskName" placeholder="Task" onChange={e => setTask(e.target.value)} />
                                <label>Task</label>
                            </div>
                            <div>
                                <input type="text" id="description" className="taskName" placeholder="What do you need to do?" onChange={e => setDesc(e.target.value)} />
                                <label>Description</label>
                            </div>
                            {/* <div>
                                <select onChange={e => setCategory(e.target.value)}>
                                    <option value="Personal">Personal</option>
                                    <option value="Work">Work</option>
                                    <option value="School">School</option>
                                    <option value="Cleaning">Cleaning</option>
                                    <option value="Other">Other</option>
                                </select>
                                <label>Category</label>
                            </div> */}
                            <div>
                                <input type="date" onChange={e => setDate(e.target.value)} />
                                <label>Due Date</label>
                            </div>
                            <div>
                                <button type='submit'>Add task</button>
                            </div>
                        </div>
                    </form>)
                }
                <div>
                    <button className="btn" onClick={() => { setTaskModal(true) }}>New Task</button>
                    <span></span>
                </div>
                <div className="hd1">
                    <h3>Today's Tasks</h3>
                    <div></div>
                </div>
                <div className="hd2">
                    <h3>Your Statistic</h3>
                    <div></div>
                </div>
                <div className="hd3">
                    <h3>Your Progress</h3>
                    <div></div>
                </div>
            </div>
        </div>
    )
}

export default Home