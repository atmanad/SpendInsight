import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";


const Profile = () => {
    const { logout } = useAuth0();


  return (
    <Dropdown>
      <Dropdown.Toggle variant="dark" id="profileDropdown">
        Profile
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item as={Link} to="/user">User Page</Dropdown.Item>
        <Dropdown.Item onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Profile;
