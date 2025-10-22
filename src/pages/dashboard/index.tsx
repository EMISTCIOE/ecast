import { useEffect } from 'react';
import Router from 'next/router';

export default function DashboardIndex() {
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const role = userStr ? JSON.parse(userStr)?.role : null;
    if (role === 'ADMIN') Router.replace('/dashboard/admin');
    else if (role === 'AMBASSADOR') Router.replace('/dashboard/ambassador');
    else if (role === 'ALUMNI') Router.replace('/dashboard/alumni');
    else Router.replace('/dashboard/member');
  }, []);
  return null;
}
