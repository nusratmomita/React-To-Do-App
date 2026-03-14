import React, { useEffect, useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { toast } from 'react-toastify';
import { addTaskToLS, getTaskFromLS, removeTaskFromLS } from '../Utilities/LocalStorageUtilities';
import { FiEdit2 } from "react-icons/fi";
import { IoTrashBinOutline } from "react-icons/io5";
import Swal from 'sweetalert2';
import { ErrorMessage, Field, Form, Formik } from 'formik';

const MyTasks = () => {

  // to show all the tasks
  const [allTasks,setAllTasks] = useState([]);

  // to update a task
  const [updatingTask,setUpdatingTask] = useState(null);

  // for sorting
  const [deadlineSorting,setDeadlineSorting] = useState(null);

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
      }
    });


  }

  const sortTasks = [...allTasks].sort((a,b) => {

    if(deadlineSorting === 'earliest'){
      return new Date(a.deadline) - new Date(b.deadline);
    }

    if(deadlineSorting === 'latest'){
      return new Date(b.deadline) - new Date(a.deadline);
    }

    return 0;
  })


  return (
    <div>
      <div className='flex justify-between items-center mt-10 mx-3 lg:mx-5'>
        <h3 className=" text-amber-100 text-xl lg:text-2xl font-bold">My Tasks: {allTasks.length}</h3>
        <div onClick={()=>document.getElementById('createTask').showModal()}
          className='flex items-center gap-2 border-2 border-amber-100 rounded-xl p-1 lg:p-3 text-amber-100 font-medium hover:bg-yellow-100 hover:text-black cursor-pointer transition-all duration-200'>
          <h4>Add Task</h4>
          <FaPlus></FaPlus>
        </div>
      </div>
      <div className='mt-5 mx-3 lg:mx-5'>
        <label htmlFor="sorting" className='mr-5 text-md lg:text-xl text-amber-50'>Sort By Deadline</label>
        <select name="sorting" id="Sorting" className='select select-bordered mt-2 md:mt-0 lg:mt-0'
          value={deadlineSorting}
          onChange={(e) => setDeadlineSorting(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="earliest">Earliest Deadline</option>
          <option value="latest">Latest Deadline</option>
        </select>
      </div>

      {/* showing all the tasks */}
      {
        sortTasks.length===0 ?
        <>
          <h3 className="text-center text-xl mt-10">No Tasks Found</h3>
        </>
        :
        <>
          <div className='overflow-x-auto mx-5 lg:mx-5'>
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
                  sortTasks.map((task,index) => (
                  <tr key={task.id}>
                    <td className='text-lg text-center'>{index+1}</td>
                    <td className='text-lg text-center whitespace-nowrap'>{task.taskName}</td>
                    <td className='text-md lg:text-lg text-center whitespace-nowrap capitalize'>
                    <span className={`px-3 py-1 border rounded-2xl
                        ${task.priority === "high" && "text-red-700 border-red-700 bg-red-200"}
                        ${task.priority === "medium" && "text-yellow-700 border-yellow-700 bg-yellow-200"}
                        ${task.priority === "low" && "text-green-700 border-green-700 bg-green-200"}
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
            <Formik initialValues={{
              taskName: "",
              taskPriority: "",
              taskDeadline: ""
            }}

            validate={(values)=>{
              const errors = {};

              if(!values.taskName){
                errors.taskName = "Task name is necessary"
              }

              const newTask = {
                id: Date.now(),
                taskName: values.taskName,
                priority: values.taskPriority,
                deadline: values.taskDeadline,
                createdAt: new Date().toISOString().split("T")[0]
              }

              const addedTask = addTaskToLS(newTask);

              if(!addedTask){
                errors.taskName = "You already added this Task";
              }

              if(!values.taskPriority){
                errors.taskPriority = "Task priority is necessary"
              }

              if(!values.taskDeadline){
                errors.taskDeadline = "Task Deadline is nessacary"
              }

              const createdAt = new Date().toISOString().split("T")[0];

              const deadlineDate = new Date(values.taskDeadline);
              const createdDate = new Date(createdAt);

              if (deadlineDate < createdDate) {
                errors.taskDeadline = "Deadline must be in the future";
              }

              return errors;
            }}

            onSubmit={(values, {resetForm})=>{

              const newTask = {
                id: Date.now(),
                taskName: values.taskName,
                priority: values.taskPriority,
                deadline: values.taskDeadline,
                createdAt: new Date().toISOString().split("T")[0]
              }

              const addedTask = addTaskToLS(newTask);

              if(!addedTask){
                return;
              }

              else{
                setAllTasks(addedTask);
                toast.success("You successfully created a new Task!");
              }

             resetForm()

              document.getElementById("createTask").close();
            }}
            >

            <Form className="space-y-7 w-full">
              <label className="text-yellow-100 text-2xl font-bold">Task Name</label>
              <Field
                name="taskName"
                type="text"
                placeholder="Enter your task"
                className="input input-bordered w-full mt-3"
              >
              </Field>

              <ErrorMessage name="taskName" component="div" className="text-red-500 -mt-5"/>

              <label className="text-yellow-100 text-2xl font-bold">Task Priority</label>
              <Field
                name="taskPriority"
                as="select"
                className="select select-bordered w-full mt-3"
              >
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Field>

              <ErrorMessage name="taskPriority" component="div" className="text-red-500 -mt-5"/>

              <label className="text-yellow-100 text-2xl font-bold">Task Deadline</label>
              <Field
                name="taskDeadline"
                type="date"
                className="input input-bordered w-full mt-3"
              >
              </Field>

              <ErrorMessage name="taskDeadline" component="div" className="text-red-500 -mt-5"/>

              <div className="modal-action flex gap-2">

                <button type="submit" className="btn bg-yellow-100 text-black w-[50%]">Add Task</button>

                <button
                  type="button"
                  className="btn bg-yellow-100 text-black w-[50%]"
                  onClick={() => document.getElementById("createTask").close()}
                >
                Close
                </button>

              </div>
            </Form>
            </Formik>
          </div>
        </div>
      </dialog>

      {/* modal to update a task */}
      <dialog id="updateTask" className="modal">
        <div className="modal-box">
          <Formik enableReinitialize
                  initialValues={{
                    taskName: updatingTask?.taskName || "",
                    taskPriority: updatingTask?.priority || "",
                    taskDeadline: updatingTask?.deadline || ""
                  }}

            validate={(values)=>{
              const errors = {};

              if(!values.taskName){
                errors.taskName = "Name of the Task is nessacary"
              }

              if(!values.taskPriority){
                errors.taskPriority = "Setting Task Priority is nessacary"
              }

              if(!values.taskDeadline){
                errors.taskDeadline = "Task Deadline is nessacary"
              }

              const createdAt = new Date().toISOString().split("T")[0];

              const deadlineDate = new Date(values.taskDeadline);
              const createdDate = new Date(createdAt);

              if (deadlineDate < createdDate) {
                errors.taskDeadline = "Deadline must be in the future";
              }

              return errors;
            }}

            onSubmit={(values)=>{

              if(
                values.taskName === updatingTask.taskName &&
                values.taskPriority === updatingTask.priority &&
                values.taskDeadline === updatingTask.deadline
              ){
                toast.info("No changes were made");
                document.getElementById("updateTask").close();
                return;
              }

              const updatedTasks = allTasks.map(task =>
                task.id === updatingTask.id
                  ? {
                      ...task,
                      taskName: values.taskName,
                      priority: values.taskPriority,
                      deadline: values.taskDeadline
                    }
                  : task
              );

              localStorage.setItem("Tasks", JSON.stringify(updatedTasks));
              setAllTasks(updatedTasks);

              toast.success("Task updated successfully!");

              document.getElementById("updateTask").close();
            }}
            >

            <Form className="space-y-7 w-full">
              <label className="text-yellow-100 text-2xl font-bold">Task Name</label>
              <Field
                name="taskName"
                type="text"
                placeholder="Enter your task"
                className="input input-bordered w-full mt-3"
              >
              </Field>

              <ErrorMessage name="taskName" component="div" className="text-red-500 -mt-5"/>

              <label className="text-yellow-100 text-2xl font-bold">Task Priority</label>
              <Field
                name="taskPriority"
                as="select"
                className="select select-bordered w-full mt-3"
              >
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Field>

              <ErrorMessage name="taskPriority" component="div" className="text-red-500 -mt-5"/>

              <label className="text-yellow-100 text-2xl font-bold">Task Deadline</label>
              <Field
                name="taskDeadline"
                type="date"
                className="input input-bordered w-full mt-3"
              >
              </Field>

              <ErrorMessage name="taskDeadline" component="div" className="text-red-500 -mt-5"/>

              <div className="modal-action flex gap-2">

                <button type="submit" className="btn bg-yellow-100 text-black w-[50%]">Update Task</button>

                <button
                  type="button"
                  className="btn bg-yellow-100 text-black w-[50%]"
                  onClick={() => document.getElementById("updateTask").close()}
                >
                Close
                </button>

              </div>
            </Form>
          </Formik>
        </div>
      </dialog>
  </div>
  );
}

export default MyTasks;