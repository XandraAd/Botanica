import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { 
  FaTimes, 
  FaBars, 
  FaHome, 
  FaSignOutAlt,
  FaLayerGroup,
  FaBox,
  FaBoxes,
  FaUsers,
  FaShoppingBag 
} from "react-icons/fa";
import { logoutUser } from "../../slices/authSlice"; 

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleLogout = () => { dispatch(logoutUser()); navigate("/"); };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && !e.target.closest('.admin-menu-container')) setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Close menu on route change
  useEffect(() => { setIsMenuOpen(false); }, [location]);

  if (!userInfo?.isAdmin) return null;

  const menuItems = [
    { name: "Admin Dashboard", icon: <FaHome />, path: "/admin/dashboard" },
    { name: "Create Category", icon: <FaLayerGroup />, path: "/admin/categorylist" },
   { name: "Create Collection", icon: <FaLayerGroup />, path: "/admin/collectionlist" },
    { name: "Create Product", icon: <FaBox />, path: "/admin/productlist" },
    { name: "All Products", icon: <FaBoxes />, path: "/admin/allproductslist" },
    {name:"Decor Ideas", icon:<FaBars/>,path:"/admin/decor"},
    { name: "Manage Users", icon: <FaUsers />, path: "/admin/userlist" },
    { name: "Manage Orders", icon: <FaShoppingBag />, path: "/admin/orderlist" },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed z-50 bg-gray-800 p-3 rounded-lg shadow-lg top-4 right-4 admin-menu-container"
        onClick={toggleMenu}
        aria-label="Admin menu"
      >
        {isMenuOpen ? <FaTimes className="text-white text-xl" /> : <FaBars className="text-white text-xl" />}
      </button>

      {/* Overlay */}
      {isMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden" onClick={() => setIsMenuOpen(false)} />}

      {/* Sidebar */}
<aside className={`fixed top-0 left-0 h-full bg-gray-900 text-gray-100 p-6 z-40 transform transition-transform duration-300 ease-in-out admin-menu-container
  ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} w-64 md:translate-x-0 md:static md:h-auto md:bg-gray-100 md:text-gray-900 md:shadow-none md:p-4`}>


        {/* Mobile Header */}
        <div className="flex justify-between items-center mb-8 md:hidden">
          <h2 className="text-white text-xl font-bold">Admin Panel</h2>
          <button onClick={toggleMenu}><FaTimes className="text-white" /></button>
        </div>

        <ul className="space-y-2">
          {menuItems.map(item => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center py-3 px-4 rounded-lg transition-colors duration-200
                  ${isActive ? "bg-pink-200 text-pink-700" : "hover:bg-gray-700 text-gray-100"}
                  md:text-gray-900 md:hover:bg-pink-100 md:hover:text-pink-700
                `}
                onClick={() => window.innerWidth < 768 && setIsMenuOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}

          <li className="border-t border-gray-700 pt-2 mt-4">
            <NavLink
              to="/"
              className="flex items-center py-3 px-4 rounded-lg transition-colors duration-200 hover:bg-gray-700 text-gray-100 md:text-gray-900 md:hover:bg-pink-100 md:hover:text-pink-700"
              onClick={() => window.innerWidth < 768 && setIsMenuOpen(false)}
            >
              <FaHome className="mr-3" /> Back to Store
            </NavLink>
          </li>

          <li>
            <button
              className="flex items-center w-full py-3 px-4 rounded-lg transition-colors duration-200 hover:bg-red-600 text-white md:hover:bg-red-500"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-3" /> Logout
            </button>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default AdminMenu;
