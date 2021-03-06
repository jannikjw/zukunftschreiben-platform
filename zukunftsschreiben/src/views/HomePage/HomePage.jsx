import React from 'react';
import { Link } from 'react-router-dom';

import './HomePage.scss';

class HomePage extends React.Component {

  render() {
    return (
      <div className={`view-home-page`}>
        <h2>Zukunfstschreiben Projects</h2>
        <div>
          <p>
            Check whether you are logged in at <Link to="/profile"> /profile</Link>
          </p>
          <p>
            Login at <Link to="/login"> /login</Link>
          </p>
          <p>
            Or logout by browsing to <Link to="/logout"> /logout</Link>
          </p>
          <p>
            Create a new Project <Link to="/create-project"> /create-project</Link>
          </p>
          <p>
            See Projects <Link to="/projects"> /projects</Link>
          </p>
        </div>
      </div>
    );
  }
}


export { HomePage };
