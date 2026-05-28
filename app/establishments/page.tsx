import { redirect } from 'next/navigation';
import EstablishmentItem from '../(home)/_components/establishment-item';
import Header from '../_components/header';
import { db } from '../_lib/prisma';
import Search from '../(home)/_components/search';

interface establishmentPageProps {
  searchParams: {
    search?: string;
  };
}

const EstablishmentPage = async ({ searchParams }: establishmentPageProps) => {
  if (!searchParams.search) {
    return redirect('/');
  }
  const establishments = await db.establishment.findMany({
    where: {
      name: {
        contains: searchParams.search,
        mode: 'insensitive'
      }
    }
  });
  return (
    <>
      <Header />

      <div className="px-5 py-6 flex flex-col gap-6">
        <Search
          defaultValues={{
            search: searchParams.search
          }}
        />
        <h1 className="text-gray-400 font-bold text-xs uppercase">
          Resultados para &quot;{searchParams.search}&quot;
        </h1>
        <div className="grid grid-cols-2 gap-4">
          {establishments.map(establishment => (
            <div className="w-full" key={establishment.id}>
              <EstablishmentItem establishment={establishment} />
            </div>
          ))}
        </div>
        {establishments.length === 0 && <p>Nenhuma barbearia encontrada.</p>}
      </div>
    </>
  );
};
export default EstablishmentPage;