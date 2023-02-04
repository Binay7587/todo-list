import React, { useState } from 'react'
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import { FaPlus, FaTrash } from "react-icons/fa"

const App = () => {
    const initialData = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [];
    const [todoList, setTodoList] = useState(initialData);
    const [text, setText] = useState("");

    // Function to add todo item
    const addTodo = () => {
        const todos = [
            ...todoList,
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
        const updatedTodo = todoList.map((todo, index) => index === idx ? { ...todo, isCompleted: !todo.isCompleted } : todo);
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

    return (
        <Container className='mt-3 text-center'>
            <h3>TodoList App</h3>
            <Form.Control
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTodo()}
            />
            <br />
            <Button onClick={addTodo}>
                {" "}
                <FaPlus />
                <label className='ms-2'>Add</label>
            </Button>
            <br />
            {todoList.length > 0 ? todoList.map((todo, index) => {
                return (
                    <Row key={index}>
                        <Col xs={10}>
                            <Alert
                                variant={todo.isCompleted ? "danger" : "primary"}
                                className="text-start mt-3"
                                style={{
                                    textDecoration: todo.isCompleted ? "line-through" : "none",
                                    cursor: "pointer"
                                }}
                                onClick={() => toggleTodoCompletion(index)}>
                                <h3>{todo.data}</h3>
                                <small>{todo.date}</small>
                            </Alert>
                        </Col>
                        <Col className='mt-4'>
                            <FaTrash size="40" color="red" onClick={() => deleteTodo(index)} />
                        </Col>
                    </Row>
                )
            }) : "No Todo's"}
        </Container>
    )
}

export default App