import React, { useEffect, useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { toast } from 'react-toastify';
import { addTaskToLS, getTaskFromLS, removeTaskFromLS } from '../Utilities/LocalStorageUtilities';
import { FiEdit2 } from "react-icons/fi";
import { IoTrashBinOutline } from "react-icons/io5";
import Swal from 'sweetalert2';

const MyTasks = () => {

  // to show all the tasks
  const [allTasks,setAllTasks] = useState([]);

  // to update a task
  const [updatingTask,setUpdatingTask] = useState(null);

  const handleCreateTask = (e) => {
    e.preventDefault();

    const form = e.target;

    const taskName = form.taskName.value;
    const taskPriority = form.taskPriority.value;
    const taskDeadline = form.taskDeadline.value;

    // console.log(taskName,taskPriority,taskDeadline);

    if(taskName === '' || taskPriority === '' || taskDeadline === ''){
      toast.error("You must fill all the fields to create a new tasks.");
      return;
    }

    const createdAt = new Date().toISOString().split("T")[0];

    const deadlineDate = new Date(taskDeadline);
    const createdDate = new Date(createdAt);

    if (deadlineDate < createdDate) {
      toast.error("Deadline must be in the future");
      return;
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

  const openUpdateModal = (task) => {
    setUpdatingTask(task);
    document.getElementById('updateTask').showModal();
  }

  const handleUpdateTask = (e) => {
    e.preventDefault();

    const form = e.target;

    const updateTaskName = form.taskName.value;
    const updateTaskPriority = form.taskPriority.value;
    const updateTaskDeadline = form.taskDeadline.value;

    if(updateTaskName === updatingTask.taskName && updateTaskPriority === updatingTask.priority && updateTaskDeadline === updatingTask.deadline){
      toast.info("No changes were made.");
      document.getElementById('updateTask').close();
      return;
    }

    else{
      const updatedTask = allTasks.map((task)=> task.id === updatingTask.id ? 
        {
          ...task,
          taskName: updateTaskName,
          priority: updateTaskPriority,
          deadline: updateTaskDeadline
        } :
        task
    )
  
    localStorage.setItem('Tasks' , JSON.stringify(updatedTask));
    setAllTasks(updatedTask);
  
    toast.success("Successfully updated the task!");
  
    document.getElementById('updateTask').close();
    }
  }

  const handleDelete = (id) => {

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
        const updatedTask = removeTaskFromLS(id);
        setAllTasks(updatedTask);
        toast.success("You've successfully deleted the task!")
      }
    });


  }


  return (
    <div>
      <div className='flex justify-between items-center mt-10'>
        <h3 className=" text-amber-100 text-2xl font-bold">My Tasks: {allTasks.length}</h3>
        <div onClick={()=>document.getElementById('createTask').showModal()}
          className='flex items-center gap-2 border-2 border-amber-100 rounded-xl p-3 text-amber-100 font-medium hover:bg-yellow-100 hover:text-black cursor-pointer transition-all duration-200 mx-3'>
          <h4>Add Task</h4>
          <FaPlus></FaPlus>
        </div>
      </div>
      {/* showing all the tasks */}
      {
        allTasks.length===0 ?
        <>
          <h3 className="text-center text-xl mt-10">No Tasks Found</h3>
        </>
        :
        <>
          <div className='overflow-x-auto mx-5 lg:mx-0'>
              <table className="table w-full table-zebra mt-15 border border-gray-50 rounded-sm p-5">
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
                {
                  allTasks.map((task,index) => (
                  <tr key={task.id}>
                    <td className='text-lg text-center'>{index+1}</td>
                    <td className='text-lg text-center whitespace-nowrap'>{task.taskName}</td>
                    <td className='text-lg text-center whitespace-nowrap capitalize'>
                    <span className={`px-3 py-1 border rounded-2xl
                        ${task.priority === "high" && "text-green-700 border-green-700 bg-green-200"}
                        ${task.priority === "medium" && "text-yellow-700 border-yellow-700 bg-yellow-200"}
                        ${task.priority === "low" && "text-red-700 border-red-700 bg-red-200"}
                      `}>
                        {task.priority}
                    </span>
                    </td>
                    <td className='text-lg text-center whitespace-nowrap'>{task.deadline}</td>
                    <td className='text-lg text-center'>{task.createdAt}</td>
                    <td className="text-lg flex gap-2 justify-center items-center">
                      <button 
                        onClick={() => openUpdateModal(task)} 
                        className="btn btn-md border-none bg-yellow-100 text-black hover:-translate-y-2 transition-all duration-300 group"
                        >
                          <FiEdit2 className='group-hover:rotate-18'></FiEdit2>
                        Update
                      </button>
                      <button 
                        onClick={() => handleDelete(task.id)} 
                        className="btn btn-md bg-yellow-100 text-black hover:-translate-y-2 transition-all duration-300 group"
                      >
                        <IoTrashBinOutline className='group-hover:rotate-18'></IoTrashBinOutline>
                        Delete
                      </button>
                    </td>
                  </tr>
                )
                )}
            </tbody>
            </table>
          </div>
        </>
      }

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

                  <option value="">Select priority</option>
                  <option value="low">Low</option> 
                  <option value="medium">Medium</option> 
                  <option value="high">High</option> 

                </select> 
                <label className='whitespace-nowrap mr-5 text-yellow-100 text-2xl font-bold' htmlFor="taskDeadline">Task Deadline</label> 
                <input className='input input-bordered w-full' type="date" name="taskDeadline" id="taskDeadline" placeholder='Enter task deadline' /> 
              </div> 
              
              <div className='modal-action flex items-center justify-between gap-2 mt-5'>
                <button type="submit" className="btn bg-yellow-100 text-black w-[50%]"> Add Task </button>
                
                <button className="btn bg-black/50 w-[50%]" type="button"
                onClick={() => document.getElementById("createTask").close()}>Close</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>

      {/* modal to update a task */}
      <dialog id="updateTask" className="modal">
        <div className="modal-box">
          <form key={updatingTask?.id} onSubmit={handleUpdateTask} className="space-y-7">

            <label className="text-yellow-100 text-xl lg:text-2xl font-bold">
              Task Name
            </label>
            
            <input
              type="text"
              name="taskName"
              defaultValue={updatingTask?.taskName}
              className="input input-bordered w-full mt-3"
            />

            <label className="text-yellow-100 text-xl lg:text-2xl font-bold">
              Task Priority
            </label>

            <select
              name="taskPriority"
              defaultValue={updatingTask?.priority}
              className="select select-bordered w-full mt-3"
            >
              <option value="">Select priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <label className="text-yellow-100 text-xl lg:text-2xl font-bold">
              Deadline
            </label>

            <input
              type="date"
              name="taskDeadline"
              defaultValue={updatingTask?.deadline}
              className="input input-bordered w-full mt-3"
            />

            <div className="modal-action flex items-center justify-between gap-2 mt-5">
              <button type="submit" className="btn bg-yellow-100 text-black w-[50%]">
                Update Task
              </button>

              <button
                type="button"
                className="btn bg-black/50 w-[50%]"
                onClick={() => document.getElementById("updateTask").close()}
              >
                Close
              </button>
            </div>

          </form>
        </div>
      </dialog>
    </div>
  );
}

export default MyTasks;