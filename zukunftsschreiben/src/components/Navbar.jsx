import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react'

import './Navbar.scss';

class Navbar extends React.Component {

  render() {
    const { loggedIn, user } = this.props;

    return (
      <header className="component-navbar">
        <nav className="nav">
          <ul className="left">
            <li className="navlink logo">
              <Link to="/">
                <img src="/c20.png" alt="Centerling News Logo" />
                <span>Zukunftschreiben</span>
              </Link>
            </li>
            <li className="navlink">
              <Link to="/">Home</Link>
            </li>
            <li className="navlink">
              <Link to="/projects">Projekte</Link>
            </li>
            <li className="navlink">
              <Link to="/create-project">Erstellen</Link>
            </li>
          </ul>
          <ul className="right">
            {loggedIn &&
              <li className="navlink">
                <Link to="/profile"><Icon size="big" name="user circle" />{user.username}</Link>
              </li>
            }
            {loggedIn &&
              <li className="navlink">
                <Link to="/logout">Abmelden</Link>
              </li>
            }
            {!loggedIn &&
              <li className="navlink">
                <Link to="/login">Anmelden</Link>
              </li>
            }

          </ul>
        </nav>
      </header>
    );
  }
}

function mapStateToProps(state) {
  const { loggedIn, user } = state.login;
  return {
    loggedIn,
    user
  };
}

const connectedNavbar = connect(mapStateToProps)(Navbar);
export { connectedNavbar as Navbar }; 
