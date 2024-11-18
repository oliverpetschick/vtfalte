import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Nav, NavMenu, NavLink, Text } from "./NavBarElements";
import { StyleSheet } from "react-native-web";

const menuItems = [
    { path: "/info", label: "Info" },
    { path: "/atlas", label: "Atlas" },
    { path: "/galerie", label: "Galerie" },
];

const NavBar = () => {
    const location = useLocation();


    const renderNavLinks = () => {
        return menuItems.map(item => (
            <NavLink
                key={item.path}
                to={item.path}
                style={location.pathname === item.path ? styles.activeText : styles.text}
            >
                <Text style={styles.text}>{item.label}</Text>
            </NavLink>
        ));
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
        fontSize: 22,
        '@media (minWidth: 768px)': {
            fontSize: 18,
        }
    },
    activeText: {
        fontSize: 22,
        color: "blue",
        '@media (minWidth: 768px)': {
            fontSize: 18,
        }
    },
});

export default NavBar;
