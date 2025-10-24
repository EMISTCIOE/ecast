import { useEffect, useState } from "react";
import Router from "next/router";
import dynamic from "next/dynamic";

// Dynamically import dashboard components
const AdminDashboard = dynamic(() => import("../components/dashboard/admin"));
const MemberDashboard = dynamic(() => import("../components/dashboard/member"));
const AmbassadorDashboard = dynamic(
  () => import("../components/dashboard/ambassador")
);
const AlumniDashboard = dynamic(() => import("../components/dashboard/alumni"));

export default function MePage() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const access = localStorage.getItem("access");

    if (!access) {
      Router.replace("/login");
      return;
    }

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setRole(user.role);
      } catch (error) {
        Router.replace("/login");
        return;
      }
    } else {
      Router.replace("/login");
      return;
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Render the appropriate dashboard based on role
  switch (role) {
    case "ADMIN":
      return <AdminDashboard />;
    case "AMBASSADOR":
      return <AmbassadorDashboard />;
    case "ALUMNI":
      return <AlumniDashboard />;
    case "MEMBER":
      return <MemberDashboard />;
    default:
      Router.replace("/login");
      return null;
  }
}
