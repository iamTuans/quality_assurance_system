import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';

import Logout from './pages/Logout';

//Admin Function
import ADMIN_UserManager from './pages/Admin/UserManager';
import ADMIN_ProjectManager from './pages/Admin/ProjectManager';
import HomeAdmin from './pages/Admin/HomeAdmin';

//ProjectLead Function
import HomePM from './pages/ProjectLead/HomePM';
import PM_EditProject from './pages/ProjectLead/EditProject'
import PM_ChangeInfo from './pages/ProjectLead/ChangeInfo'


import PrivateRouter from "./middlewares/PrivateRouter";
import PublicRouter from './middlewares/PublicRouter';
import Error from './pages/Error';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={
          <PrivateRouter enabled={['admin', 'pm']}>
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

        <Route path="/admin/user-manager" element={
          <PrivateRouter enabled={['admin']}>
            <ADMIN_UserManager />
          </PrivateRouter>
        } />

        <Route path="/admin/project-manager" element={
          <PrivateRouter enabled={['admin']}>
            <ADMIN_ProjectManager />
          </PrivateRouter>
        } />

        <Route path="/pm/home" element={
          <PrivateRouter enabled={['pm']}>
            <HomePM />
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

        <Route path="*" element={
          <Error />
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App;