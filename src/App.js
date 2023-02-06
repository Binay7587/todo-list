import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import { FaPlus, FaTrash } from "react-icons/fa"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const App = () => {
    const initialData = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [];
    const [todoList, setTodoList] = useState(initialData);
    const [text, setText] = useState("");

    // Function to add todo item
    const addTodo = () => {
        if (!text) {
            notify("Please enter todo.", 'error');
            return;
        }
        const todos = [
            ...localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [],
            {
                data: text,
                date: new Date().toLocaleString().split(",")[0],
                isCompleted: false
            }
        ];
        setTodoList(todos);
        setText("");

        localStorage.setItem("todos", JSON.stringify(todos));
        notify("Todo added successfully.", 'success');
    };

    // Function to toggle todo item completion
    const toggleTodoCompletion = (idx) => {
        const todos = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [];
        const updatedTodo = todos.map((todo, index) => index === idx ? { ...todo, isCompleted: !todo.isCompleted } : todo);
        setTodoList(updatedTodo);
        localStorage.setItem("todos", JSON.stringify(updatedTodo));
    }

    // Function to delete todo item
    const deleteTodo = (idx) => {
        const confirm = window.confirm("Do you want to delete? ");
        if (confirm) {
            const updatedTodo = todoList.filter((_, index) => {
                return index === idx ? false : true;
            })
            notify("Todo deleted successfully.", 'success');
            setTodoList(updatedTodo);
            localStorage.setItem("todos", JSON.stringify(updatedTodo));
        }
    }

    // Function to filter todo items
    const filterTodo = (type) => {
        const filters = document.getElementsByClassName('filters')[0].children;
        for (let i = 0; i < filters.length; i++) {
            filters[i].classList.remove('active');
        }

        if (type === 'active') {
            filters[1].classList.add('active');
            const todos = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [];
            const activeTodos = todos.filter(todo => !todo.isCompleted);
            setTodoList(activeTodos);
        } else if (type === 'completed') {
            filters[2].classList.add('active');
            const todos = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [];
            const completedTodos = todos.filter(todo => todo.isCompleted);
            setTodoList(completedTodos);
        } else if (type === 'all') {
            filters[0].classList.add('active');
            const todos = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [];
            setTodoList(todos);
        }
    }

    //Function to show hide trash icon
    const showHideTrash = (idx, type) => {
        document.getElementById(`trash${idx}`).firstChild.style.display = type;
    }

    //Function to clear all todos
    const clearAll = () => {
        const confirm = window.confirm("Do you want to clear all todos? ");
        if (confirm) {
            setTodoList([]);
            localStorage.setItem("todos", JSON.stringify([]));
            notify("All todos cleared successfully", 'success');
        }
    }

    const notify = (message, type) => {
        if (type === 'success') {
            toast.success(message, {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            toast.error(message, {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
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
                        <li key={index} className='task' onClick={() => toggleTodoCompletion(index)} onMouseEnter={() => showHideTrash(index, 'block')} onMouseLeave={() => showHideTrash(index, 'none')}>
                            <div className='description'>
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