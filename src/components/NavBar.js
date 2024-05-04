import React from "react";
import { useLocation } from "react-router-dom";
import { Nav, NavMenu, NavLink } from "./NavBarElements";
import { KarrikRegular } from "./Fonts";

const menuItems = [
    { path: "/info", label: "INFO" },
    { path: "/atlas", label: "ATLAS" },
    { path: "/galerie", label: "GALERIE" },
    { path: "/typen", label: "TYPEN" },
    { path: "/arbeit", label: "ARBEIT" },
];

const NavBar = () => {
    const location = useLocation();

    const renderNavLinks = () => {
        return menuItems.map(item => {
            return (
                <NavLink
                    key={item.path}
                    to={item.path}
                    activeStyle={{ color: "red" }}
                    onMouseOver={(e) => e.target.style.color = "red"}
                    onMouseOut={(e) => e.target.style.color = "black"}
                >
                    <KarrikRegular style={{ fontSize: 40, color: 'black' }}>{item.label}</KarrikRegular>
                </NavLink>
            );
        });
    };

    return (
        <Nav>
            <NavMenu>
                {renderNavLinks()}
            </NavMenu>
        </Nav>
    );
}

export default NavBar;
