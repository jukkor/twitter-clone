import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import './Sidebar.css'

function Sidebar() {

  const navigate = useNavigate();

  const handleSignOut = () => {
    auth.signOut();
    navigate("/login");
  }

  return (
    <>
      <div className="sidebar">
        <h1>Twitter clone</h1>
        <nav>
          <ul>
            <li>
              <a href={`/home`}>Home</a>
            </li>
            <li>
              <a href={`/explore`}>Explore</a>
            </li>
          </ul>

          <ul>
            <li>
              <a href={`/user/example`}>Profile</a>
            </li>
          </ul>
        </nav>
        <div>
          <a onClick={handleSignOut} >Sign Out</a>
        </div>
      </div>
    </>
  )
}

export default Sidebar;
