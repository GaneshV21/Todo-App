import React, { useEffect, useRef, useState } from "react";
import { Todo } from "../../models/model";
import "./TodoCard.scss";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { MdDone } from "react-icons/md";
import {IoIosUndo} from "react-icons/io"
import { Draggable } from "react-beautiful-dnd";

type Props = {
  index: number;
  todo: Todo;
  todos: Todo[];
  otherTodos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setOtherTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const TodoCard = ({
  index,
  todo,
  todos,
  otherTodos,
  setTodos,
  setOtherTodos,
}: Props) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [editTodo, setEditTodo] = useState<string>(todo.todo);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDone = (id: number) => {
   
    const newOtherTodos = otherTodos;
    setTodos(
      todos.filter((todo) => {
        if (todo.id === id) {
          newOtherTodos.push({ ...todo, isDone: !todo.isDone });
        }
        return todo.id !== id;
      })
    );
    setOtherTodos(newOtherTodos);
  };

  const handleDelete = (id: number) => {

    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleEdit = (e: React.FormEvent, id: number) => {
    e.preventDefault();
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, todo: editTodo } : todo))
    );
    setEdit(false);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [edit]);

  return (
    <Draggable draggableId={todo.id.toString()} index={index}>
      {(provided, snapshot) => (
        <form
          className={`todos__card ${snapshot.isDragging ? "drag" : ""}`}
          onSubmit={(e) => handleEdit(e, todo.id)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {
            edit ? (
              <input
                className="todos__card--edit"
                value={editTodo}
                onChange={(e) => setEditTodo(e.target.value)}
              />
            ) : 
            todo.isDone ? (
              <s className="todos__card--text">{todo.todo}</s>
            ) : (
              <span className="todos__card--text">{todo.todo}</span>
            )
          }

          <div title="Edit" className="todos__card__icons">
            {!todo.isDone && (
              <span
                className="todos__card__icon"
                onClick={() => {
              
                  if (!edit && !todo.isDone) {
                    setEdit(!edit);
                  }
                }}
              >
                <AiFillEdit />
              </span>
            )}

            <span title="Delete" className="todos__card__icon--delete">
              <AiFillDelete onClick={() => handleDelete(todo.id)} />
            </span>

            
              <span
                title={!todo.isDone ? "Complete" : "Undo"}
                className="todos__card__icon"
                onClick={() => handleDone(todo.id)}
              >
                {!todo.isDone ? <MdDone /> : <IoIosUndo />}
              </span>
            
          </div>
        </form>
      )}
    </Draggable>
  );
};

export default TodoCard;
