import React, { useEffect, useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { toast } from 'react-toastify';
import { addTaskToLS, getTaskFromLS } from '../Utilities/LocalStorageUtilities';
import { FiEdit2 } from "react-icons/fi";
import { IoTrashBinOutline } from "react-icons/io5";

const MyTasks = () => {

  // to show all the tasks
  const [allTasks,setAllTasks] = useState([]);

  const handleCreateTask = (e) => {
    e.preventDefault();

    const form = e.target;

    const taskName = form.taskName.value;
    const taskPriority = form.taskPriority.value;
    const taskDeadline = form.taskDeadline.value;

    // console.log(taskName,taskPriority,taskDeadline);

    if(taskName === '' || taskPriority === '' || taskDeadline === ''){
      toast.error("You must fill all the fields to create a new tasks.")
    }

    const newTask = {
      id: Date.now(),
      taskName,
      priority: taskPriority,
      deadline: taskDeadline,
      createdAt: new Date().toISOString().split("T")[0]
    }

    const addedTask = addTaskToLS(newTask);
    if(!addedTask){
      toast.error("You already added this Task");
      return;
    }

    else if(newTask.deadline < newTask.createdAt){
      toast.error("Deadline must be in the future");
      return;
    }

    else{
      setAllTasks(addedTask);
      toast.success("You successfully created a new Task!");
    }

    form.reset();

    document.getElementById("createTask").close();

  }

  useEffect(()=>{
    const storedTasks = getTaskFromLS();

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAllTasks(storedTasks);

    // console.log(storedTasks)
  },[])

  return (
    <div>
      <div className='flex justify-between items-center'>
        <h3 className="ml-5 mt-10 text-amber-100 text-2xl font-bold">My Tasks: {allTasks.length}</h3>
        <div onClick={()=>document.getElementById('createTask').showModal()}
        className='flex items-center gap-2 border-2 border-amber-100 rounded-xl p-3 text-amber-100 font-medium hover:bg-yellow-100 hover:text-black cursor-pointer transition-all duration-200'>
          <h4>Add Task</h4>
          <FaPlus></FaPlus>
        </div>
      </div>

      {/* showing all the tasks */}
      <table className="table w-full table-zebra mt-15 border-2 border-white p-5">
          <thead>
            <tr>
              <th className='text-center text-lg'>#</th>
              <th className='text-center text-lg'>Task Name</th>
              <th className='text-center text-lg'>Priority</th>
              <th className='text-center text-lg'>Deadline</th>
              <th className='text-center text-lg'>Created Date</th>
              <th className='text-center text-lg'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allTasks.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">No Tasks Found</td>
              </tr>
            ) : (
              allTasks.map((task,index) => (
                <tr key={task.id}>
                  <td className='text-lg text-center'>{index+1}</td>
                  <td className='text-lg text-center'>{task.taskName}</td>
                  <td className='text-lg capitalize text-center'>{task.priority}</td>
                  <td className='text-lg text-center'>{task.deadline}</td>
                  <td className='text-lg text-center'>{task.createdAt}</td>
                  <td className="text-lg flex gap-2 justify-center">
                    <button 
                      // onClick={() => handleUpdate(task.id)} 
                      className="btn btn-sm border-none bg-yellow-100 text-black hover:-translate-y-2 transition-all duration-300 group"
                      >
                        <FiEdit2 className='group-hover:rotate-6'></FiEdit2>
                      Update
                    </button>
                    <button 
                      // onClick={() => handleDelete(task.id)} 
                      className="btn btn-sm bg-yellow-100 text-black hover:-translate-y-2 transition-all duration-300 group"
                    >
                      <IoTrashBinOutline className='group-hover:rotate-6'></IoTrashBinOutline>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>




      {/* modal to create a new task */}
      <dialog id="createTask" className="modal">
        <div className="modal-box">
          <div className="modal-action justify-start"> 
            <form onSubmit={handleCreateTask} className='space-y-7 w-full'>
              <label htmlFor="taskName" className='text-yellow-100 text-2xl font-bold'>Task Name</label> 
              <br /> 
              <input className='mt-5 p-5 input input-bordered w-full' type="text" name="taskName" id="taskName" placeholder='Enter your task' /> 
              
              <div className='flex flex-col space-y-7'> 
                <label className='whitespace-nowrap mr-5 text-yellow-100 text-2xl font-bold' htmlFor="taskPriority">Task Priority</label> 
                <select className='select select-bordered w-full' name="taskPriority" id="taskPriority"> 
                  <option value="low">Low</option> 
                  <option value="medium">Medium</option> 
                  <option value="high">High</option> 
                </select> 
                <label className='whitespace-nowrap mr-5 text-yellow-100 text-2xl font-bold' htmlFor="taskDeadline">Task Deadline</label> 
                <input className='input input-bordered w-full' type="date" name="taskDeadline" id="taskDeadline" placeholder='Enter task deadline' /> 
              </div> 
              
              <div className='modal-action flex items-center justify-between gap-2 mt-5'>
                <button type="submit" className="btn bg-yellow-100 text-black w-[50%]"> Add Task </button>
                
                <button className="btn bg-yellow-100 text-black w-[50%]" type="button"
                onClick={() => document.getElementById("createTask").close()}>Close</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default MyTasks;