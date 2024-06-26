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
    padding: 0 1rem;
    height: 100%;
    width: 100%;
    text-decoration: none;
    color: black;
    flex: 1;
    &:hover{
        color: blue;
        cursor: default;
    }
    color: black;
    flex: 1;
`;

export const Text = styled.span`
    transform: scale(1);
    font-size: 2rem;
`;

