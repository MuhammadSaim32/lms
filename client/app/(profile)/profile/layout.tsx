import Link from "next/link";

const sideBar = [
  { name: "My Account", url: "accounts" },
  { name: "Change Password", url: "accounts" },
  { name: "Enrolled Courses", url: "accounts" },
  { name: "Log Out", url: "accounts" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen h-screen bg-gray-900  flex  items-center justify-between p-3.5 ">
      {/* wrapper of children and side bar */}
      <div className=" flex  justify-between  h-[90%] bg-black w-screen ">
        {/* side bar */}
        <div className="bg-[#E0E0E0] flex flex-col gap-6 p-3 h-full w-[20%] justify-center">
          {sideBar.map((item) => {
            return (
              <Link
                href={`${item.url}`}
                key={item.name}
                className="text-center bg-amber-700"
              >
                {item.name}
              </Link>
            );
          })}
        </div>
        {/* children */}
        <div>{children}</div>
      </div>
    </div>
  );
}
