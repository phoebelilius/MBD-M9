/**
 * Author: Phoebe Lilius
 * ChatGPT has been used in creation of this code.
 * 
 * ~~~ My To-Do List App ~~~
 * 
 * This app allows users to:
 * - add tasks to a to-do list, 
 * - mark them as completed,
 * - and delete them.
 * 
 * Additional functionality: 
 * - Tasks are saved to localStorage so they persist when the page is reloaded.
 */

// Function to load task template from task-template.html
function loadTaskTemplate(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'templates/task-template.html', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr.responseText);
        }
    };
    xhr.send();
}

// Function to add task using template
function addTask() {
    var taskInput = document.getElementById("taskInput");
    var taskName = taskInput.value.trim();

    // If task input is empty, add is-invalid class
    if (taskName === "") {
        taskInput.classList.add("is-invalid");
        return;
    }

    // If task input is not empty, remove the is-invalid class
    taskInput.classList.remove("is-invalid");

    // Load task template and add task to the list
    loadTaskTemplate(function (template) {
        var taskContainer = document.getElementById("todoList");
        var taskElement = document.createElement("div");
        taskElement.innerHTML = template.trim();
        taskElement.querySelector('.task-name').textContent = taskName;
        taskContainer.appendChild(taskElement.firstChild);

        // Clear input field after adding task
        taskInput.value = "";

        // Save tasks to localStorage after adding
        saveTasks();
    });
}

// Function to save tasks to localStorage
function saveTasks() {
    var todoListHtml = document.getElementById("todoList").innerHTML;
    var completedListHtml = document.getElementById("completedList").innerHTML;
    localStorage.setItem("todoTasks", todoListHtml);
    localStorage.setItem("completedTasks", completedListHtml);
}

// Function to load tasks from localStorage
function loadTasks() {
    // Get tasks from storage
    var savedTodoTasks = localStorage.getItem("todoTasks");
    var savedCompletedTasks = localStorage.getItem("completedTasks");
    
    // If any "todo" tasks are saved, load them
    if (savedTodoTasks) {
        document.getElementById("todoList").innerHTML = savedTodoTasks;
    }
    // If any "completed" tasks are saved, load them
    if (savedCompletedTasks) {
        var completedList = document.getElementById("completedList");
        completedList.innerHTML = savedCompletedTasks;
        
        // Ensure checkboxes are ticked for completed tasks
        var completedTasks = completedList.querySelectorAll('input[type="checkbox"]');
        completedTasks.forEach(function(checkbox) {
            checkbox.checked = true;
        });
    }
}


// Load tasks from localStorage when the page loads
window.onload = function() {
    loadTasks();
}

// Event listener for checkbox change
function completeTask(checkbox) {
    var task = checkbox.parentNode.parentNode;
    var completedList = document.getElementById("completedList");
    if (checkbox.checked) {
        task.classList.add("completed");
        completedList.appendChild(task);
    } else {
        task.classList.remove("completed");
        var todoList = document.getElementById("todoList");
        todoList.appendChild(task);
    }
    // Save tasks to localStorage after completion
    saveTasks();
}

// Event listener for delete button click
function deleteTask(button) {
    var task = button.parentNode.parentNode;
    task.parentNode.removeChild(task);
    // Save tasks to localStorage after deletion
    saveTasks();
}
