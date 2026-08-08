import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import OriginalApp from './App_backup';

import Layout from './components/Layout';
import Page1 from './components/page1';
import Page2 from './components/page2';
import Page3 from './components/page3';
import Page4 from './components/page4';
import Page5 from './components/page5';
import Page6 from './components/page6';
import Page7 from './components/page7';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/original" element={<OriginalApp />} />
        
        <Route element={<Layout />}>
          <Route path="/" element={<Page1 />} />
          <Route path="/budget" element={<Page2 />} />
          <Route path="/community" element={<Page3 />} />
          <Route path="/hotels" element={<Page4 />} />
          <Route path="/translate" element={<Page5 />} />
          <Route path="/emergency" element={<Page6 />} />
          <Route path="/support" element={<Page7 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
