import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import { ContentProvider } from './context/ContentContext';
import EditControls from './components/EditControls';
import BackgroundMusic from './components/BackgroundMusic';

const App: React.FC = () => {
  return (
    <ContentProvider>
      <div className="min-h-screen bg-brand-dark text-gray-200 font-sans">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Services />
        </main>
        <Contact />
        <BackgroundMusic />
        <EditControls />
      </div>
    </ContentProvider>
  );
};

export default App;