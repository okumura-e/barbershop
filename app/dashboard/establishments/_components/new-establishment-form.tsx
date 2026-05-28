'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createEstablishment } from '../_actions/create-establishment';
import EstablishmentForm, {
  EstablishmentFormValues
} from './establishment-form';

const NewEstablishmentForm = () => {
  const router = useRouter();

  const handleSubmit = async (data: EstablishmentFormValues) => {
    try {
      await createEstablishment(data);
      toast.success('Estabelecimento criado');
      router.push('/dashboard/establishments');
      router.refresh();
    } catch {
      toast.error('Erro ao criar estabelecimento');
    }
  };

  return (
    <EstablishmentForm submitLabel="Criar estabelecimento" onSubmit={handleSubmit} />
  );
};

export default NewEstablishmentForm;
