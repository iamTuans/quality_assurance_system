import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';

import Logout from './pages/Logout';


// Global
import Home from './pages/Home';
import Profile from './pages/Profile';

//Admin Function
import ADMIN_UserManager from './pages/Admin/UserManager';
import ADMIN_ProjectManager from './pages/Admin/ProjectManager';
import HomeAdmin from './pages/Admin/HomeAdmin';

//ProjectLead Function
import HomePM from './pages/ProjectLead/HomePM';
import PM_EditProject from './pages/ProjectLead/EditProject'
import PM_ChangeInfo from './pages/Profile'
import CreateDocument from './pages/ProjectLead/CreateDocument';
import ProjectInfo from './pages/ProjectLead/ProjectInfo'
import ViewProject from './pages/ProjectLead/ViewProject';


//User Function
import HomeUser from './pages/User/HomeUser';


import PrivateRouter from "./middlewares/PrivateRouter";
import PublicRouter from './middlewares/PublicRouter';
import Error from './pages/Error';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={
          <PrivateRouter enabled={['admin', 'pm', 'ba']}>
            <Home />
          </PrivateRouter>
        } />

        <Route path="/profile" element={
          <PrivateRouter enabled={['admin', 'pm']}>
            <Profile />
          </PrivateRouter>
        } />

        <Route path="/admin" element={
          <PrivateRouter enabled={['admin']}>
            <HomeAdmin />
          </PrivateRouter>
        } />

        <Route path="/login" element={
          <PublicRouter>
            <Login />
          </PublicRouter>
        } />

        <Route path="/logout" element={
          <Logout />
        } />

        <Route path="/admin/users" element={
          <PrivateRouter enabled={['admin']}>
            <ADMIN_UserManager />
          </PrivateRouter>
        } />

        <Route path="/admin/projects" element={
          <PrivateRouter enabled={['admin']}>
            <ADMIN_ProjectManager />
          </PrivateRouter>
        } />

        <Route path="/pm" element={
          <PrivateRouter enabled={['pm']}>
            <HomePM />
          </PrivateRouter>
        } />

        <Route path="/pm/projects" element={
          <PrivateRouter enabled={['pm']}>
            <ProjectInfo />
          </PrivateRouter>
        } />    

        <Route path="/pm/project/edit/:projectID" element={
          <PrivateRouter enabled={['pm']}>
            <PM_EditProject />
          </PrivateRouter>
        } />

        <Route path="/pm/change-info" element={
          <PrivateRouter enabled={['pm']}>
            <PM_ChangeInfo />
          </PrivateRouter>
        } />


        <Route path="/create-document" element={
          <PrivateRouter enabled={['pm', 'ba']}>
            <CreateDocument />
          </PrivateRouter>
        } />

        <Route path="/view-projects" element={
          <PrivateRouter enabled={['pm']}>
            <ViewProject />
          </PrivateRouter>
        } />

        <Route path="/user" element={
          <PrivateRouter enabled={['ba']}>
            <HomeUser />
          </PrivateRouter>
        } />

        <Route path="/user/projects" element={
          <PrivateRouter enabled={['ba']}>
            <ProjectInfo />
          </PrivateRouter>
        } />

        <Route path="*" element={
          <Error />
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App;