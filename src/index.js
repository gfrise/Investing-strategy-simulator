import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);

// const root = ReactDOM.createRoot(document.getElementById('root')!);
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
// In this TypeScript version:

// The ReactDOM.createRoot method is called with document.getElementById('root')! to assert that the element with the ID 'root' exists in the document.
// The code is wrapped inside <React.StrictMode> component, which is a tool for highlighting potential problems in an application. It performs additional checks and warnings during development.
// The code assumes that you have a file named App.tsx or App.jsx in the same directory, which exports the root component of your application.
