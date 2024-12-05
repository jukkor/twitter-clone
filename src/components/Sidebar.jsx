import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';

import './Sidebar.css';

import TweetButton from './TweetButton';

const Sidebar = () => {

  const navigate = useNavigate();

  const handleSignOut = () => {
    auth.signOut();
    navigate("/login");
  }

  return (
    <>
      <div className="sidebar">
        <h2>Twitter clone</h2>
        <nav className="sidebar-tabs">
          <ul>
            <li className={location.pathname === "/home" ? "active-link" : ""}>
              <a href={`/home`}>Home</a>
            </li>
            <li className={location.pathname === "/explore" ? "active-link" : ""}>
              <a href={`/explore`}>Explore</a>
            </li>
          </ul>

          <ul>
            <li className={location.pathname === "/user/example" ? "active-link" : ""}>
              <a href={`/user/example`}>Profile</a>
            </li>
          </ul>
        </nav>
        <TweetButton/>
        <ul className="logout-button">
          <a onClick={handleSignOut} >Sign Out</a>
        </ul>
      </div>
    </>
  )
}

export default Sidebar;
