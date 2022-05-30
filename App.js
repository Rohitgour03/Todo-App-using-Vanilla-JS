// Default TODOs
const defaultTODOs = [{
        taskID: 0,
        taskText: "Complete Online Javascript course",
        taskStatus: false,
    },
    {
        taskID: 1,
        taskText: "Jog around the park 3x",
        taskStatus: false,
    },
    {
        taskID: 2,
        taskText: "10 minutes meditation",
        taskStatus: false,
    },
    {
        taskID: 3,
        taskText: "Read for 1 hour",
        taskStatus: false,
    },
    {
        taskID: 4,
        taskText: "Pick up groceries",
        taskStatus: false,
    },
    {
        taskID: 5,
        taskText: "Complete Todo app on frontend mentor",
        taskStatus: false,
    },
];

// Toggle theme functionality
const toggleBtn = document.querySelector(".toggle-theme");
toggleBtn.addEventListener("click", (event) => {
    const body = document.querySelector("body");
    body.classList.toggle("dark");
});

// ************ Variables referencing the DOM elements
const form = document.getElementById("form");
let taskStatus = document.getElementById("radio-input");
let taskInput = document.querySelector("#task-input");
const tasksCtn = document.querySelector(".tasks-ctn");

const categories = document.querySelector(".tasks-action-ctn");
const categoriesMobile = document.querySelector(".tasks-action-ctn--mobile");

const clearAllTasksBtn = document.querySelector(".clear");

// Holding all the tasks
let taskCount = document.querySelector(".task-count");

// *********** Functions ******************
function submitForm(event) {
    event.preventDefault();
    const taskStatus = event.target[0].checked;
    const inputCtn = event.target[1];
    const inputTaskText = inputCtn.value;

    const taskObj = createTask(taskStatus, inputTaskText);
    displayTask(taskObj);

    tasks.push(taskObj);
    setTask(tasks);
    updateCount();
    alert("Congrats 🎉, Your todo is added to your todo list");

    // Reset the input field
    inputCtn.value = "";
    inputCtn.focus();
}

// Creating the task object
function createTask(taskStatus, taskText) {
    let taskID = new Date().getTime();
    console.log(taskID);
    return { taskID, taskText, taskStatus };
}

// Displaying the task
function displayTask(task) {
    const taskCtn = document.createElement("div");
    taskCtn.classList.add("task-ctn");
    taskCtn.setAttribute("data-index", `${task.taskID}`);

    taskCtn.innerHTML = `
        <div class="checkbox-btn-ctn">
            <label for="" class="check-label">
                <input class="checkbox" type="checkbox" name="task-status" ${
                  task.taskStatus ? "checked" : ""
                } />
            </label>
        </div>
        <div class="task">
            <p class="task-text">${task.taskText}</p>
        </div>
        <div class="delete-btn-ctn">
            <img src="./images/icon-cross.svg" alt="task delete btn" />
        </div>
    `;

    tasksCtn.appendChild(taskCtn);
    updateCount();

    const taskText = taskCtn.querySelector(".task-text");
    if (task.taskStatus) {
        taskText.classList.add("completed-task");
    } else {
        taskText.classList.remove("completed-task");
    }
}

function updateCount() {
    taskCount.textContent = tasks.length;
}
// Complete the task
function completeTask(el) {
    const taskText =
        el.parentElement.parentElement.nextElementSibling.children[0];

    const check = el.checked;

    if (check) {
        taskText.classList.add("completed-task");
    } else {
        taskText.classList.remove("completed-task");
    }
}

function updateTask(el, taskId) {
    const task = tasks.find((task) => task.taskID === parseInt(taskId));

    task.taskStatus = !task.taskStatus;
    console.log(task, el);

    if (task.taskID) {
        el.setAttribute("checked", "");
    } else {
        el.removeAttribute("checked");
    }

    setTask(tasks);
    completeTask(el);
}

// Removing a task
function removeTask(el, taskId) {
    console.log(taskId);
    el.target.parentElement.parentElement.remove();
    tasks = tasks.filter((task) => {
        return taskId !== task.taskID;
    });
    setTask(tasks);
    updateCount();
}

// Getting the task from the local storage
function getTask() {
    return JSON.parse(localStorage.getItem("TODOs"));
}

// Setting the local storage with the tasks array
function setTask(arr) {
    window.localStorage.setItem("TODOs", `${JSON.stringify(arr)}`);
    console.log("task added to local storage");
}

// Filtering the tasks according to its category
function filterTasks(target) {
    const taskCtns = document.querySelectorAll(".task-ctn");
    taskCtns.forEach((task) => (task.style.display = "none"));

    if (target.classList.contains("all")) {
        taskCtns.forEach((task) => (task.style.display = "flex"));
    } else if (target.classList.contains("active")) {
        const activeTasks = tasks
            .filter((task) => task.taskStatus === false)
            .map((activeTask) => activeTask.taskID);

        taskCtns.forEach((task) => {
            const isActive = activeTasks.includes(
                parseInt(task.getAttribute("data-index"))
            );
            if (isActive) {
                task.style.display = "flex";
            }
        });
    } else if (target.classList.contains("completed")) {
        const completedTasks = tasks
            .filter((task) => task.taskStatus === true)
            .map((task) => task.taskID);

        taskCtns.forEach((task) => {
            const isCompleted = completedTasks.includes(
                parseInt(task.getAttribute("data-index"))
            );
            if (isCompleted) {
                task.style.display = "flex";
            }
        });
    }
}

// *********** Event listeners ************

// when the HTML has been loaded then do ...
window.addEventListener("DOMContentLoaded", () => {
    const userTODOs = JSON.parse(localStorage.getItem("TODOs"));

    if (userTODOs === null) {
        tasks = [...defaultTODOs];
        console.log("nothing in the local storage");
    } else {
        tasks = [...userTODOs];
        console.log("coming from the local storage");
    }

    tasks.forEach((todo) => {
        displayTask(todo);
    });
    setTask(tasks);
    updateCount();
});

// Form submit event listener
form.addEventListener("submit", submitForm);

// Listening for click event on the delete task button
tasksCtn.addEventListener("click", (event) => {
    if (event.target.parentElement.className === "delete-btn-ctn") {
        const id = parseInt(event.target.parentElement.parentElement.dataset.index);
        removeTask(event, id);
    }
});

//  Listening for input event on the checkbox button
tasksCtn.addEventListener("input", (event) => {
    const id =
        event.target.parentElement.parentElement.parentElement.dataset.index;
    console.log(id);
    updateTask(event.target, id);
});

// Listening for click event on the tasks categories
categories.addEventListener("click", (event) => {
    filterTasks(event.target);
});

// Listening for click event on the tasks categories at mobile device
categoriesMobile.addEventListener("click", (event) => {
    filterTasks(event.target);
});

// listening for removing completed tasks
clearAllTasksBtn.addEventListener("click", (event) => {
    const taskCtns = document.querySelectorAll(".task-ctn");
    taskCtns.forEach((task) => {
        const isCompleted =
            task.children[0].children[0].children[0].checked === true;
        if (isCompleted) {
            task.remove();
        }
    });
    tasks = tasks.filter((task) => task.taskStatus === false);
    setTask(tasks);
});

// To do list array to hold all the TODOs tasks
// const todoList = [
//   {
//     taskId: 0,
//     task: "Complete Online Javascript course",
//     isDone: false,
//   },
//   {
//     taskId: 1,
//     task: "Jog around the park 3x",
//     isDone: false,
//   },
//   {
//     taskId: 2,
//     task: "10 minutes meditation",
//     isDone: false,
//   },
//   {
//     taskId: 3,
//     task: "Read for 1 hour",
//     isDone: false,
//   },
//   {
//     taskId: 4,
//     task: "Pick up groceries",
//     isDone: false,
//   },
//   {
//     taskId: 5,
//     task: "Complete Todo app on frontend mentor",
//     isDone: false,
//   },
// ];

// (function TODO() {
//     // Showing all the tasks when the page has been loaded
//     window.onload = function() {
//         if (localStorage.getItem("tasks") !== null) {
//             // localStorage.removeItem("tasks");
//             const arr = getData();
//             showTasks(arr);
//             console.log("content from local storage");

//             clearTask();
//         } else {
//             showTasks(todoList);
//         }
//     };

//     // Stopping the function from submitting
//     form.addEventListener("submit", (event) => {
//         event.preventDefault();
//     });

//     // When user has typed the task and hit enter
//     document.addEventListener("keyup", (event) => {
//         if (event.key === "Enter") {
//             let arr = [];

//             if (localStorage.getItem("tasks") === null) {
//                 arr = [...todoList];
//                 console.log("this time local storage was empty");
//             } else {
//                 arr = getData();
//                 console.log("we have data in local storage");
//             }

//             arr.push(getFormData());
//             setData(arr);
//             showTasks(arr);
//             alert("task added to todo list");
//             console.log(arr);
//             taskInput.value = "";
//             taskStatus.checked = false;

//             clearTask();
//         }
//         return;
//     });

//     // Getting the data from the form
//     function getFormData() {
//         const taskID = todoList.length;
//         return {
//             taskId: taskID,
//             task: taskInput.value,
//             isDone: taskStatus.checked,
//         };
//     }

//     // Setting all the tasks in the local storage
//     function setData(arr) {
//         localStorage.setItem("tasks", JSON.stringify(arr));
//     }

//     // getting the data from the localStarage
//     function getData() {
//         return JSON.parse(localStorage.getItem("tasks"));
//     }

//     // show all the tasks got from local storage
//     // TODO make it work for completed, active and all the tasks
//     function showTasks(arr) {
//         const todos = arr.map((item) => {
//             return `
//         <div class="task-ctn" data-index="${item.taskId}">
//             <div class="radio-btn-ctn">
//                 <label for=""><input type="radio"
//                 ${item.isDone ? "checked" : ""} /></label>
//             </div>
//             <div class="task">
//                 <p class="task-text">${item.task}</p>
//             </div>
//             <div class="delete-btn-ctn">
//                 <img src="./images/icon-cross.svg" alt="task delete btn" />
//             </div>
//         </div>
//         `;
//         });
//         tasksCtn.innerHTML = todos.join("");
//     }

//     function clearTask() {
//         const clearTaskBtn = document.querySelectorAll(".delete-btn-ctn");
//         console.log(clearTaskBtn);

//         clearTaskBtn.forEach((taskBtn) => {
//             taskBtn.addEventListener("click", (event) => {
//                 const task = event.currentTarget.parentElement;

//                 const index = parseInt(task.dataset.index);
//                 console.log(index);

//                 const arr = getData().filter((task) => {
//                     return task.taskId !== index;
//                 });
//                 console.log(arr);
//                 setData(arr);
//                 showTasks(arr);
//             });
//         });
//     }
// })();