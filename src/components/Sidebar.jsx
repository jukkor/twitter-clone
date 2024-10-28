import './Sidebar.css'

function Sidebar() {

  return (
    <>
    <div className="sidebar">
      <h1>Twitter clone</h1>
      <nav>
          <ul>
          <li>
            <a href={`/`}>Home</a>
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
    </div>
    </>
  )
}

export default Sidebar;