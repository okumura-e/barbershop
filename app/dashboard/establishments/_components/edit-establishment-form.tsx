'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { updateEstablishment } from '../_actions/update-establishment';
import EstablishmentForm, {
  EstablishmentFormValues
} from './establishment-form';

interface EditEstablishmentFormProps {
  establishmentId: string;
  defaultValues: EstablishmentFormValues;
}

const EditEstablishmentForm = ({
  establishmentId,
  defaultValues
}: EditEstablishmentFormProps) => {
  const router = useRouter();

  const handleSubmit = async (data: EstablishmentFormValues) => {
    try {
      await updateEstablishment(establishmentId, data);
      toast.success('Estabelecimento atualizado');
      router.push('/dashboard/establishments');
      router.refresh();
    } catch {
      toast.error('Erro ao atualizar estabelecimento');
    }
  };

  return (
    <EstablishmentForm
      defaultValues={defaultValues}
      submitLabel="Salvar alterações"
      onSubmit={handleSubmit}
    />
  );
};

export default EditEstablishmentForm;
