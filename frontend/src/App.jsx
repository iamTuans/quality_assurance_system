import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import HomeAdmin from './pages/Admin/HomeAdmin';
import HomeProjectLead from './pages/ProjectLead/HomeProjectLead';

//Admin Function
import UserManager from './pages/Admin/UserManager';
import ProjectManager from './pages/Admin/ProjectManager';

import PrivateRouter from "./middlewares/PrivateRouter";
import PublicRouter from './middlewares/PublicRouter';
import Error from './pages/Error';
import Logout from './pages/Logout';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={
          <PrivateRouter enabled={['admin', 'pm']}>
            <HomeAdmin />
          </PrivateRouter>
        } />

        <Route path="/home-projectlead" element={
            <HomeProjectLead />
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
            <UserManager />
          </PrivateRouter>
        } />

        <Route path="/admin/project-manager" element={
          <PrivateRouter enabled={['admin']}>
            <ProjectManager />
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