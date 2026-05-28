'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/app/_components/ui/alert-dialog';
import { Button } from '@/app/_components/ui/button';
import { Card, CardContent } from '@/app/_components/ui/card';
import { Establishment } from '@prisma/client';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { deleteEstablishment } from '../_actions/delete-establishment';

interface EstablishmentListItemProps {
  establishment: Establishment;
}

const EstablishmentListItem = ({
  establishment
}: EstablishmentListItemProps) => {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteEstablishment(establishment.id);
      toast.success('Estabelecimento excluído');
      router.refresh();
    } catch {
      toast.error('Erro ao excluir estabelecimento');
    }
  };

  return (
    <Card>
      <CardContent className="flex gap-4 p-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={establishment.imageUrl}
            alt={establishment.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2 className="font-bold truncate">{establishment.name}</h2>
          <p className="text-sm text-gray-400 truncate">
            {establishment.address}
          </p>

          <div className="mt-2 flex gap-2">
            <Button variant="secondary" size="sm" asChild>
              <Link
                href={`/dashboard/establishments/${establishment.id}/edit`}
              >
                <PencilIcon size={14} className="mr-1" />
                Editar
              </Link>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2Icon size={14} className="mr-1" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[90%]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir estabelecimento</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Serviços, funcionários e
                    agendamentos deste estabelecimento também serão removidos.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row gap-3">
                  <AlertDialogCancel className="w-full m-0">
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="w-full m-0"
                    onClick={handleDelete}
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EstablishmentListItem;
