import styled from "styled-components";
import { NavLink as Link } from "react-router-dom";

export const Nav = styled.nav`
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const NavMenu = styled.ul`
    display: flex;
    list-style: none;
    text-align: center;
    justify-content: center;
`;

export const NavLink = styled(Link)`
    display: flex;
    padding:  1rem;
    height: 100%;
    width: auto; // Changed from 100% to auto for proper alignment
    text-decoration: none;
    color: black; // Default color
    font-family: 'Arial';
    flex: 1;
    &:hover {
        color: blue; // Hover color
        cursor: pointer; // Change cursor to pointer for hover effect
    }
`;

export const Text = styled.span`
    transform: scale(1);
    font-size: 2rem;
`;
