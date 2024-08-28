import WidgetsIcon from '@mui/icons-material/Widgets';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  const [active, setActive] = useState("/");

  const handleClick = (path) => {
    setActive(path);
  }

  return (
    <div className="sticky top-0 border-gray-200 bg-green-300 h-screen">
      <div className='p-8'>
         <ul className='flex flex-col gap-5'>
          <Link to="/" onClick={()=>handleClick('/')} >
            <li className={`flex gap-2 items-center ${active === "/" && 'text-purple-700 font-semibold'}  `}>
                <WidgetsIcon/>
                <span>Progress</span>
            </li>
            </Link>
            <Link to='/videos' onClick={()=>handleClick('/videos')} >
            <li className={`flex gap-2 items-center ${active === "/videos" && 'text-purple-700 font-semibold'} `}>
                <WidgetsIcon/>
                <span>Videos</span>
            </li>
            </Link>
         </ul>
      </div>
    </div>
  );
}
