// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Groups from './pages/Groups';
import CreateGroup from './pages/CreateGroup';
import GroupDetails from './pages/GroupDetails';
import EditGroup from './pages/EditGroup';
import CreateAccount from './pages/CreateAccount';
import EditAccount from './pages/EditAccount';
import SplitAccount from './pages/SplitAccount';



function App() {

  
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/groups/create" element={<CreateGroup />} />
        <Route path="/groups/:id" element={<GroupDetails />} />
        <Route path="/groups/:id/edit" element={<EditGroup />} />
        <Route path="/groups/:groupId/accounts/new" element={<CreateAccount />} />
        <Route path="/accounts/:id/edit" element={<EditAccount />} />
        <Route path="/accounts/:id/split" element={<SplitAccount />} />
      </Routes>
    </div>



  );
}

export default App;
