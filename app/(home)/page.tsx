import { format } from "date-fns"
import Header from "../_components/header";
import { ptBR } from "date-fns/locale";
import Search from "./_components/search";
import BookingItems from "../_components/booking-items";
import { db } from "../_lib/prisma";
import BarbershopItem from "./_components/barber-shop-item";

export default async function Home() {
  const barbershops = await db.barbershop.findMany({})

  return (
    <div>
      <Header />

      <section className="px-5 pt-5">
        <h2 className="text-xl font-bold">Olá, Adriel</h2>
        <p className="capitalize text-sm">
          {format(new Date(), "EEEE',' dd 'de' MMMM", {
            locale: ptBR
          })}</p>
      </section>

      <section className="px-5 mt-6">
        <Search />
      </section>

      <section className="px-5 mt-6">
        <h2 className="text-sm uppercase text-gray-400 font-bold mb-3">Agendamentos</h2>
        <BookingItems />
      </section>

      <section className="mt-6">
          <h2 className="px-5 mb-3 text-xs uppercase text-gray-400 font-bold">Recomendados</h2>
          <div className="flex px-5 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {barbershops.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            ))}

          </div>
      </section>

    </div>
  );
}
