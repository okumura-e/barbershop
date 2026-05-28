import Header from '@/app/_components/header';
import { Button } from '@/app/_components/ui/button';
import { authOptions } from '@/app/_lib/auth';
import { db } from '@/app/_lib/prisma';
import { PlusIcon } from 'lucide-react';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import EstablishmentListItem from './_components/establishment-list-item';

const EstablishmentsDashboardPage = async () => {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id: string } | undefined)?.id;

  const establishments = await db.establishment.findMany({
    where: { ownerId: userId },
    orderBy: { name: 'asc' }
  });

  return (
    <>
      <Header />
      <div className="px-5 py-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold">Meus estabelecimentos</h1>
          <Button size="sm" asChild>
            <Link href="/dashboard/establishments/new">
              <PlusIcon size={16} className="mr-1" />
              Novo
            </Link>
          </Button>
        </div>

        {establishments.length === 0 ? (
          <p className="text-sm text-gray-400">
            Você ainda não cadastrou nenhum estabelecimento.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {establishments.map(establishment => (
              <EstablishmentListItem
                key={establishment.id}
                establishment={establishment}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default EstablishmentsDashboardPage;
