import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import { FaPlus, FaTrash } from "react-icons/fa"
import './App.css';

const App = () => {
    const initialData = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [];
    const [todoList, setTodoList] = useState(initialData);
    const [text, setText] = useState("");

    // Function to add todo item
    const addTodo = () => {
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
            const updatedTodo = todoList.filter((todo, index) => {
                return index === idx ? false : true;
            })
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
        }
    }

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
                            <div>
                                <span className='task-title' style={{
                                    textDecoration: todo.isCompleted ? "line-through" : "none"
                                }}>{todo.data}</span><br />
                                <small className='task-date' style={{
                                    textDecoration: todo.isCompleted ? "line-through" : "none",
                                }}>{todo.date}</small>
                            </div>
                            <div id={`trash${index}`}>
                                <FaTrash size="40" color="red" display={'none'} onClick={() => {
                                    deleteTodo(index)
                                }} />
                            </div>
                        </li >
                    )
                }) : <li className='task'>No Any Todo ...</li>}
            </ul>
        </div >
    )
}

export default App