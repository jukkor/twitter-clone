import { useUser } from '../contexts/UserContext';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';

import './Sidebar.css';

import TweetButton from './TweetButton';

const Sidebar = () => {

  let { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

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
            <li className={location.pathname == `/user/${id}` ? "active-link" : ""}>
              <a href={`/user/${user.uid}`}>Profile</a>
            </li>
          </ul>
          <TweetButton/>
        </nav>
        <ul className="logout-button">
          <a onClick={handleSignOut} >Sign Out</a>
        </ul>
      </div>
    </>
  )
}

export default Sidebar;
