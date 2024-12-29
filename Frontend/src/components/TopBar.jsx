import '../assets/style/topbar.css'

const TopBar = () => {
    const navItems = [
        { name: "companies", path: "/companies" },
        { name: "departments", path: "/departments" },
        { name: "employees", path: "/employees" },
        { name: "users", path: "/users" }
    ];

    return (
        <div id="topbar">
            <nav>
                <ul className="nav-bar">
                    {navItems.map(item => (
                        <li key={item.path} onClick={() => window.location.href = item.path}>
                            {item.name}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}

export default TopBar;
