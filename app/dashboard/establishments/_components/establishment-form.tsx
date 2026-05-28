'use client';

import { Button } from '@/app/_components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/app/_components/ui/form';
import { Input } from '@/app/_components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const serviceSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, 'Nome do serviço é obrigatório'),
  description: z.string().trim().min(1, 'Nome do serviço é obrigatório'),
  price: z.coerce.number().min(1, 'Preço deve ser maior que 0'),
  imageUrl: z
    .string()
    .trim()
    .url('Informe uma URL válida')
    .optional()
    .or(z.literal(''))
});

const employeeSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, 'Nome do funcionário é obrigatório'),
  imageUrl: z
    .string()
    .trim()
    .url('Informe uma URL válida')
    .optional()
    .or(z.literal(''))
});

export const establishmentFormSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório'),
  address: z.string().trim().min(1, 'Endereço é obrigatório'),
  imageUrl: z.string().trim().url('Informe uma URL de imagem válida'),

  employees: z.array(employeeSchema),
  services: z.array(serviceSchema)
});

export type EstablishmentFormValues = z.infer<
  typeof establishmentFormSchema
>;

interface EstablishmentFormProps {
  defaultValues?: EstablishmentFormValues;
  submitLabel: string;
  onSubmit: (data: EstablishmentFormValues) => Promise<void>;
}

const EstablishmentForm = ({
  defaultValues,
  submitLabel,
  onSubmit
}: EstablishmentFormProps) => {
  const form = useForm<EstablishmentFormValues>({
    resolver: zodResolver(establishmentFormSchema),
    defaultValues: defaultValues ?? {
      name: '',
      address: '',
      imageUrl: '',
      employees: [],
      services: [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'employees'
  });
 
  const { fields: serviceFields, append: serviceAppend, remove: serviceRemove } = useFieldArray({
    control: form.control,
    name: 'services'
  });

  const handleSubmit = async (data: EstablishmentFormValues) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do estabelecimento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Rua, número, bairro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL da imagem</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://exemplo.com/imagem.png"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <p className="font-medium">Funcionários</p>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  name: '',
                  imageUrl: ''
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </div>

          {fields.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhum funcionário adicionado.
            </p>
          )}

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col gap-4 rounded-md border p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  Funcionário {index + 1}
                </p>

                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <FormField
                control={form.control}
                name={`employees.${index}.id`}
                render={({ field }) => (
                  <input type="hidden" {...field} value={field.value ?? ''} />
                )}
              />

              <FormField
                control={form.control}
                name={`employees.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome do funcionário"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`employees.${index}.imageUrl`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da imagem</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://exemplo.com/foto.png"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>


        <div className="flex flex-col gap-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <p className="font-medium">Serviços</p>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                serviceAppend({
                  name: '',
                  description: '',
                  price: 0,
                  imageUrl: ''
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </div>

          {serviceFields.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhum Serviço adicionado.
            </p>
          )}

          {serviceFields.map((serviceField, index) => (
            <div
              key={serviceField.id}
              className="flex flex-col gap-4 rounded-md border p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  Serviço {index + 1}
                </p>

                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => serviceRemove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <FormField
                control={form.control}
                name={`services.${index}.id`}
                render={({ field }) => (
                  <input type="hidden" {...field} value={field.value ?? ''} />
                )}
              />

              <FormField
                control={form.control}
                name={`services.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome do Serviço"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name={`services.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Descrição do Serviço"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name={`services.${index}.price`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Preço do serviço"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`services.${index}.imageUrl`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da imagem</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://exemplo.com/foto.png"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? 'Salvando...'
            : submitLabel}
        </Button>
      </form>
    </Form>
  );
};

export default EstablishmentForm;