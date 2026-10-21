
import { Outlet } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-zinc-900 bg-white">
      <AnnouncementBar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
