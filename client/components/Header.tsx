"use client";
import NavItems from "./NavItems";
const Header = () => {
  return (
    <div className="h-16 bg-black flex justify-between items-center p-4">
      <h1 className="text-white text-2xl">Elearning</h1>

      <NavItems className={"w-80 flex justify-between "} />
    </div>
  );
};

export default Header;
