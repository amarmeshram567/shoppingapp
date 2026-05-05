import React from 'react';
import AnnouncementBar from './AnnouncementBar';
import Footer from './Footer';
import MobileBottomNavbar from './MobileBottomNavbar';
import FloatingActions from './FloatingActions';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className='min-h-screen flex flex-col'>
            <AnnouncementBar />
            <Navbar />
            <main className='flex-1 pb-20 md:pb-0'>
                {children}
            </main>
            <Footer />
            <MobileBottomNavbar />
            <FloatingActions />
        </div>
    );
}

export default Layout;
