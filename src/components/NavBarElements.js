import styled from "styled-components";
import { NavLink as Link } from "react-router-dom";

export const Nav = styled.nav`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;

    @media (max-width: 768px) {
        padding: 0; // Remove padding for small screens
    }
`;

export const NavMenu = styled.ul`
    display: flex;
    list-style: none;
    text-align: center;
    justify-content: center;
    width: 100%;

    @media (max-width: 768px) {
        flex-direction: row; // Stack items vertically on small screens
    }
`;

export const NavLink = styled(Link)`
    display: flex;
    padding: 1rem;
    height: 100%;
    width: auto;
    text-decoration: none;
    color: black;
    font-family: 'Arial';
    flex: 1;
    justify-content: center; // Center the content horizontally

    &:hover {
        color: blue;
        cursor: pointer;
    }

    @media (max-width: 768px) {
        padding: 0.5rem; // Adjust padding for small screens
    }
`;

export const Text = styled.span`
    transform: scale(1);
    font-size: 2rem;

    @media (max-width: 768px) {
        font-size: 1.5rem; // Adjust font size for small screens
    }

    @media (max-width: 480px) {
        font-size: 1.2rem; // Further adjust font size for very small screens
    }
`;
