import React from "react";
import { useLocation } from "react-router-dom";
import { Nav, NavMenu, NavLink } from "./NavBarElements";
import { StyleSheet, Text } from "react-native-web";
import { ArialText } from "./Fonts";

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
                    <ArialText>{item.label}</ArialText>
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
        fontSize: 25,
    },
    activeText: {
        borderBottom: "4px solid blue",
        fontSize: 25,
        color: "blue",
    },
});


export default NavBar;
