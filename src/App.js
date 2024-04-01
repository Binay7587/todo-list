import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import { FaPlus, FaTrash } from "react-icons/fa"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const App = () => {
    /**
    * @description Function to get local storage data
    * @param {string} key     * 
    */
    const getLocalStorageData = (key) => {
        return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
    }

    /**
     * @description Function to set local storage data
     * @param {string} key
     * @param {object} data
     */
    const setLocalStorageData = (key, data) => {
        return localStorage.setItem(key, JSON.stringify(data));
    }

    const [todoList, setTodoList] = useState(getLocalStorageData("todos"));
    const [text, setText] = useState("");

    /**
     * @description Function to add todo item
     */
    const addTodo = () => {
        if (!text) {
            notify("Please enter todo.", 'error');
            return;
        }
        const newList = [
            ...getLocalStorageData("todos"),
            {
                data: text,
                date: new Date().toLocaleString().split(",")[0],
                isCompleted: false
            }
        ];
        setTodoList(newList);
        setLocalStorageData("todos", newList);
        const filters = document.getElementsByClassName('filters')[0].children;
        for (let i = 0; i < filters.length; i++) {
            filters[i].classList.remove('active');
        }
        filters[0].classList.add('active');

        setText("");
        notify("Todo added successfully.", 'success');
    };

    /**
     * @description Function to toggle todo item completion
     * @param {object} item 
     */
    const toggleTodoCompletion = (item) => {
        const todos = getLocalStorageData("todos");
        const updatedTodo = todos.map(todo => todo.data === item.data ? { ...todo, isCompleted: !todo.isCompleted } : todo);
        setTodoList(updatedTodo);
        setLocalStorageData("todos", updatedTodo);
    }

    /**
     * Function to delete todo item
     * @param {number} idx
     */
    const deleteTodo = (idx) => {
        const confirm = window.confirm("Do you want to delete? ");
        if (confirm) {
            setTodoList((prev) => {
                const updatedTodo = prev.filter((_, index) => index !== idx);
                setLocalStorageData("todos", updatedTodo);
                return updatedTodo;
            });
            notify("Todo deleted successfully.", 'success');
        }
    }

    /**
     * Function to filter todo items
     * @param {string} type
     */
    const filterTodo = (type) => {
        const filters = document.getElementsByClassName('filters')[0].children;
        for (let i = 0; i < filters.length; i++) {
            filters[i].classList.remove('active');
        }

        const todos = getLocalStorageData("todos");
        if (type === 'active') {
            filters[1].classList.add('active');
            const activeTodo = todos.filter(todo => !todo.isCompleted);
            setTodoList(activeTodo);
        } else if (type === 'completed') {
            filters[2].classList.add('active');
            const activeTodo = todos.filter(todo => todo.isCompleted);
            setTodoList(activeTodo);
        } else if (type === 'all') {
            filters[0].classList.add('active');
            setTodoList(todos);
        }
    }

    /**
     * @description Function to show hide trash icon
     * @param {number} idx 
     * @param {string} type 
     */
    const showHideTrash = (idx, type) => {
        document.getElementById(`trash${idx}`).firstChild.style.display = type;
    }

    /**
     * @description Function to clear all todos
     */
    const clearAll = () => {
        const confirm = window.confirm("Do you want to clear all todos? ");
        if (confirm) {
            setTodoList([]);
            setLocalStorageData("todos", []);
            notify("All todos cleared successfully", 'success');
        }
    }

    /**
     * @description Function to show toast notification
     * @param {string} message 
     * @param {string} type 
     */
    const notify = (message, type) => {
        toast[type === "success" ? "success" : "error"](message, {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    return (
        <div className='container'>
            <h3>Todo List</h3>
            <div className="inputField">
                <Form.Control
                    type="text"
                    value={text}
                    placeholder="Enter new Todo"
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTodo()}
                />
                <Button onClick={addTodo}>
                    <FaPlus />
                </Button>
            </div>
            <div className='controls'>
                <div className='filters'>
                    <span onClick={() => filterTodo('all')} className={'active'}>All</span>
                    <span onClick={() => filterTodo('active')}>Active</span>
                    <span onClick={() => filterTodo('completed')}>Completed</span>
                </div>
                <Button variant="danger" onClick={clearAll}>Clear All</Button>
            </div>
            <ul className='todo-list'>
                {todoList.length > 0 ? todoList.map((todo, index) => {
                    return (
                        <li key={index} className='task' onMouseEnter={() => showHideTrash(index, 'block')} onMouseLeave={() => showHideTrash(index, 'none')}>
                            <div className='description' onClick={() => toggleTodoCompletion(todo)}>
                                <span className='task-title' style={{
                                    textDecoration: todo.isCompleted ? "line-through" : "none"
                                }}>{todo.data}</span><br />
                                <small className='task-date' style={{
                                    textDecoration: todo.isCompleted ? "line-through" : "none",
                                }}>{todo.date}</small>
                            </div>
                            <div id={`trash${index}`}>
                                <FaTrash size="25" color="#dc3545" display={'none'} onClick={() => {
                                    deleteTodo(index)
                                }} />
                            </div>
                        </li >
                    )
                }) : <li className='task'>No Any Todo ...</li>}
            </ul>
            <ToastContainer />
        </div >
    )
}

export default App