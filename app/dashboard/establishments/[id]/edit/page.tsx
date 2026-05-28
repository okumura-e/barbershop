import Header from '@/app/_components/header';
import { Button } from '@/app/_components/ui/button';
import { authOptions } from '@/app/_lib/auth';
import { db } from '@/app/_lib/prisma';
import { ChevronLeftIcon } from 'lucide-react';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EditEstablishmentForm from '../../_components/edit-establishment-form';

interface EditEstablishmentPageProps {
  params: {
    id: string;
  };
}

const EditEstablishmentPage = async ({ params }: EditEstablishmentPageProps) => {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id: string } | undefined)?.id;

  const establishment = await db.establishment.findFirst({
    where: { id: params.id, ownerId: userId },
    include: {
      employees: { orderBy: { name: 'asc' } },
      services: { orderBy: { name: 'asc' } }
    }
  });

  if (!establishment) {
    notFound();
  }

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

        <h1 className="text-xl font-bold mb-6">Editar estabelecimento</h1>
        <EditEstablishmentForm
          establishmentId={establishment.id}
          defaultValues={{
            name: establishment.name,
            address: establishment.address,
            imageUrl: establishment.imageUrl,
            employees: establishment.employees.map(employee => ({
              id: employee.id,
              name: employee.name,
              imageUrl: employee.imageUrl ?? ''
            })),
            services: establishment.services.map(service => ({
              id: service.id,
              name: service.name,
              description: service.description,
              price: Number(service.price),
              imageUrl: service.imageUrl ?? ''
            }))
          }}
        />
      </div>
    </>
  );
};

export default EditEstablishmentPage;
