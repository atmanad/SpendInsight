import React, { useEffect, useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import { useAuth0 } from "@auth0/auth0-react";
import Profile from './Profile';
import {Link} from 'react-router-dom'

const Header = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    console.log(isAuthenticated);
    console.log(user);
    const NavBar = () => {
        if (isAuthenticated) {
            return (
                <>
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                    <Link to="/transactions" className="nav-link">Transactions</Link>
                    <Link to="/reports" className="nav-link">Reports</Link>
                    <Link to="/reports" className="nav-link">Reports</Link>
                    <Profile />
                    
                </>
            );
        } else {
            return (
                <Nav.Link><LoginButton /></Nav.Link>
            );
        }
    };
    return (
        <Navbar bg="dark" variant="dark" expand="md">
            <Navbar.Brand href="/">Spend Insight</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
                <Nav className="ml-auto">
                    <NavBar />
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;
