import React from "react";
import { useLocation } from "react-router-dom";
import { Nav, NavMenu, NavLink } from "./NavBarElements";
import { StyleSheet } from "react-native-web";
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
                    style={location.pathname === item.path ? styles.activeText : styles.text}
                >
                    <KarrikRegular>{item.label}</KarrikRegular>
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

const styles = StyleSheet.create({
    text: {
        fontSize: 40,
    },
    activeText: {
        borderBottom: "4px solid blue",
        fontSize: 40,
        color: "blue",
    },
});


export default NavBar;
