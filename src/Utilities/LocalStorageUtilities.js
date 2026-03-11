export const getTaskFromLS = () => {
    const task = localStorage.getItem('Tasks');

    if(task){   
        const convertedTask = JSON.parse(task);
        return convertedTask;
    }

    else{
        return [];
    }
}

export const addTaskToLS = (task) => {
    const existingTask = getTaskFromLS();

    
    const duplicate = existingTask.find(
        (t) => t.taskName === task.taskName
    );
    
    if(duplicate){
        return false;
    }

    else{
        existingTask.push(task);

        const addingToLS = JSON.stringify(existingTask);
        localStorage.setItem('Tasks' , addingToLS);

        return existingTask;
    }
}

export const removeTaskFromLS = (id) => {
    const existingTask = getTaskFromLS();

    const remainingTask = existingTask.filter((t) => t.id !== id);

    const addingToLS = JSON.stringify(remainingTask);
    localStorage.setItem('Tasks' , addingToLS);

    return remainingTask;
}