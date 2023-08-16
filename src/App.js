import React, { useState, useEffect } from 'react';
import './App.css';

async function fetchData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
}

function App() {
  const [users, setUsers] = React.useState([]);
  const [todos, setTodos] = React.useState([]);
  useEffect(() => {
    fetchData('https://jsonplaceholder.typicode.com/users')
      .then(data => {
        setUsers(data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });

    fetchData('https://jsonplaceholder.typicode.com/todos')
      .then(data => {
        setTodos(data);
      })
      .catch(error => {
        console.error('Error fetching todo data:', error);
      });
  }, []);

  const userTasks = users.map(user => {
    const userTodos = todos.filter(todo => todo.userId === user.id);
    return {
      userId: user.id,
      name: user.name,
      tasks: userTodos.map(todo => ({
        title: todo.title,
        completed: todo.completed,
      })),
    };
  });
  return (
    <div className="container">
      <h1>User Tasks</h1>
      {userTasks.map(userTask => (
        <div key={userTask.userId} className="user-task">
          <h2>{userTask.name}</h2>
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Task Title</th>
              </tr>
            </thead>
            <tbody>
              {userTask.tasks.map(task => (
                <tr key={task.id}>
                  <td className={task.completed ? 'completed' : 'not-completed'}>
                    {task.completed ? 'Completed' : 'Not Completed'}
                  </td>
                  <td>{task.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default App;
