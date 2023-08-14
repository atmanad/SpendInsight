import React, { useEffect, useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import { useAuth0 } from "@auth0/auth0-react";
import Profile from './Profile';
import { Link, NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../store/authSlice';

const Header = ({ isAuthenticated, user }) => {
    // const { user, isAuthenticated, isLoading } = useAuth0();
    // console.log(isAuthenticated);
    const { isLoading, getAccessTokenSilently } = useAuth0();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isAuthenticated) {
            getUserMetadata();
        }
    }, [getAccessTokenSilently, user?.sub]);

    const getUserMetadata = async () => {
        const domain = "spend-insight.us.auth0.com";

        try {
            const accessToken = await getAccessTokenSilently({
                authorizationParams: {
                    audience: `https://${domain}/api/v2/`,
                    scope: "read:current_user",
                },
            });
            // console.log(accessToken);
            dispatch(authActions.addToken(accessToken));

            const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;

            const metadataResponse = await fetch(userDetailsByIdUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const res = await metadataResponse.json();
            // console.log(res);
            // dispatch(authActions.addUser(res));
            dispatch(authActions.addMetadata(res));

            // setUserMetadata(user_metadata);  
        } catch (e) {
            console.error(e);
        }
    };

    const NavBar = () => {
        if (isAuthenticated) {
            return (
                <>
                    <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
                    <NavLink to="/transactions" className="nav-link">Transactions</NavLink>
                    <NavLink to="/categories" className="nav-link">Categories</NavLink>
                    <NavLink to="/labels" className="nav-link">Labels</NavLink>
                    <Profile />
                    <img src={user.picture} className='img-fluid rounded-circle' />
                </>
            );
        } else {
            return (
                <>
                    <Nav.Link><LoginButton /></Nav.Link>
                </>
            );
        }
    };
    return (
        <Navbar bg="dark" variant="dark" expand="md" className='nav-container'>
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
