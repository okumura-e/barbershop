import Header from '@/app/_components/header';
import { Button } from '@/app/_components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import Link from 'next/link';
import NewEstablishmentForm from '../_components/new-establishment-form';

const NewEstablishmentPage = () => {
  return (
    <>
      <Header />
      <div className="px-5 py-6">
        <Button variant="ghost" className="mb-4 px-0" asChild>
          <Link href="/dashboard/establishments">
            <ChevronLeftIcon size={18} className="mr-1" />
            Voltar
          </Link>
        </Button>

        <h1 className="text-xl font-bold mb-6">Novo estabelecimento</h1>
        <NewEstablishmentForm />
      </div>
    </>
  );
};

export default NewEstablishmentPage;
