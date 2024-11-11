import React from 'react';
import './global.css';
import { View, StyleSheet } from 'react-native-web';
import Topbar from './components/TopBar';
import Info from './pages/Info';
import Atlas from './pages/Atlas';
import Galerie from './pages/Galerie';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <View style={styles.app}>
        <View style={styles.header}>
          <Topbar />
        </View>
        <View style={styles.content}>
          <Routes>
            <Route path="/" element={<Navigate to="/info" />} />
            <Route path="/info" element={<Info />} />
            <Route path="/atlas" element={<Atlas />} />
            <Route path="/galerie" element={<Galerie />} />
          </Routes>
        </View>
      </View>
    </Router>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    height: '100vh',
    width: '100%',
  },
  header: {
    diplay: 'flex',
    height: '3%',
    margin: 30,
  },
  content: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
