import { useState, useEffect } from "react";
import "./App.css";
import { ToastContainer, toast } from 'react-toastify';

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
 
  const [disable, setDisable] = useState([]);
  const [editTask, setEditTask] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [isChecked, setIsChecked] = useState([]);
  const styles ={
    fontSize: "16px",
        fontWeight: "bold",
        padding: "12px 20px",
        borderRadius: "8px",
        width: "300px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  }

  const addTask = () => {
    if (task.trim() !== "" && !tasks.some(t => t.todo === task.trim())) {
      setTasks((prevTasks) => {
        const updatedTasks = [{ todo: task }, ...prevTasks];

        setDisable([...disable, true]);
        setIsChecked([...isChecked, false]);
        return updatedTasks;
      });
      setTask("");
      toast("Task added successfully!", { type: "success", position: "bottom-right", autoClose: 4000 ,style:styles });
    } else if (task.trim() === "") {
      toast("Please enter a task!", { type: "info", position: "bottom-right", autoClose: 4000 ,style:styles});
    } else {
      toast("Task already exists!", { type: "error", position: "bottom-right", autoClose: 4000 ,style:styles});
      setTask("");
    }
  };

  const handleDeleteTask = (index) => {
    const deletedTask = tasks[index]?.todo || "Task";
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    setDisable(disable.filter((_, i) => i !== index));
    setIsChecked(isChecked.filter((_, i) => i !== index));
    toast(`${deletedTask} deleted!`, { type: "info", position: "bottom-right", autoClose: 4000 ,style:styles});
  };

  const handleDeleteAllChecked = () => {
    const newTasks = tasks.filter((_, index) => !isChecked[index]);
    setTasks(newTasks);
    setDisable(disable.filter((_, index) => !isChecked[index]));
    setIsChecked(isChecked.filter(checked => !checked));

    toast("All selected tasks deleted!", { type: "info", position: "bottom-right", autoClose: 4000 ,style:styles });
  };

  const handleEditTask = (index) => {
    setEditIndex(index);
    setEditTask(tasks[index].todo);
    setDisable(disable.map((d, i) => (i === index ? false : d)));
  };

  const handleSaveTask = () => {
    if (editIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editIndex].todo = editTask;
      setTasks(updatedTasks);
      setDisable(disable.map((d, i) => (i === editIndex ? true : d)));
      setEditIndex(null);
    }
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setDisable(disable.map((d, i) => (i === editIndex ? true : d)));
  };

  const handleCheckboxChange = (index) => {
    setIsChecked(isChecked.map((checked, i) => (i === index ? !checked : checked)));
  };


  const areAnyChecked = isChecked.filter(checked => checked).length >= 2;


  useEffect(() => {
    fetch("https://dummyjson.com/todos")
      .then(res => res.json())
      .then(res => {
        setTasks(res.todos.slice(0, 10).map(todo => ({ todo: todo.todo })));
        setDisable(new Array(res.todos.length).fill(true));
        setIsChecked(new Array(res.todos.length).fill(false));
      });
  }, []);

  return (
    <div className="bg-[#081b31] w-screen min-h-screen h-full flex flex-col items-center text-black text-2xl">
      <div className="flex flex-col items-center gap-6 bg-[#FFF5E1] rounded-4xl px-8 mt-5">
        <div className="font-bold text-center text-[50px]">📋 My Tasks</div>
        <div className="p-2 border border-gray-300 rounded-md shadow-md w-150 h-15 text-lg bg-white flex items-center gap-4">
          <label htmlFor="txt">➕ Add A Task</label>
          <input
            type="text"
            id="txt"
            className="flex-1 border-none focus:outline-none"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter text..."
          />
          <button className="ml-auto" onClick={addTask}>
            ➡️
          </button>
        </div>
        <p>{!tasks.length ? "No task defined" : "TO DO"}</p>

        <div className="flex flex-col gap-6 mb-4">
          {tasks.map((task, index) => (
            <div key={index} className="bg-white p-2 rounded-md shadow-md w-150 h-15 text-lg flex flex-row items-center gap-9">
              <input
                type="checkbox"
                className="w-10 h-6 border-2 border-dark rounded-full mr-3"
                checked={isChecked[index]}
                onChange={() => handleCheckboxChange(index)}
              />
              <textarea
                value={editIndex === index ? editTask : task.todo}
                disabled={disable[index]}
                className="flex-1 focus:outline-none disabled:cursor-not-allowed w-[250px] truncate overflow-x-auto whitespace-nowrap"
                onChange={(e) => setEditTask(e.target.value)}

              />
              {editIndex === index ? (
                <div className="mt-4 flex justify-between gap-4">
                  <button onClick={handleSaveTask} className="bg-green-500 text-white py-2 px-4 rounded-md">💾</button>
                  <button onClick={handleCancelEdit} className="bg-red-500 text-white py-2 px-4 rounded-md">❌</button>
                </div>
              ) : (
                <>
                  <button className="rounded-full w-10 " onClick={() => handleEditTask(index)}>✏️</button>
                  <button className="rounded-full w-10 " onClick={() => handleDeleteTask(index)}>🗑️</button>
                </>
              )}
            </div>
          ))}
          <h1>todo list</h1>
          
          <h1>todo list</h1>
          
          <h1>todo list</h1>
        </div>

        {areAnyChecked && (
          <>
          <button className="bg-red-500 text-white py-2 px-4 rounded-md mt-4 mb-4" onClick={handleDeleteAllChecked}>🗑️ Delete Checked Tasks</button>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
