import { redirect } from 'next/navigation';

const DashboardPage = () => {
  redirect('/dashboard/establishments');
};

export default DashboardPage;
