import { Button } from '@/app/_components/ui/button';
import { db } from '@/app/_lib/prisma';
import {
  ChevronLeftIcon,
  MapPin,
  MapPinIcon,
  MenuIcon,
  StarIcon
} from 'lucide-react';
import Image from 'next/image';
import EstablishmentInfo from './_components/establishment-info';
import ServiceItem from './_components/service-item';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/_lib/auth';

interface EstablishmentDetailsPageProps {
  params: {
    id?: string;
  };
}

const EstablishmentDetailsPage = async ({
  params
}: EstablishmentDetailsPageProps) => {
  const session = await getServerSession(authOptions);

  if (!params.id) {
    // TODO: redirecionar para a home page
    return null;
  }

  const establishment = await db.establishment.findUnique({
    where: {
      id: params.id
    },
    include: {
      services: true
    }
  });

  if (!establishment) {
    // TODO: redirecionar para a home page
    return null;
  }

  return (
    <div>
      <EstablishmentInfo establishment={establishment} />

      <div className="px-5 flex flex-col gap-4 py-6">
        {establishment.services.map(service => (
          <ServiceItem
            key={service.id}
            service={service}
            isAuthenticated={!!session?.user}
            establishment={establishment}
          />
        ))}
      </div>
    </div>
  );
};
export default EstablishmentDetailsPage;