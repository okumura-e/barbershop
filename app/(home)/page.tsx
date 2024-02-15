import { format } from "date-fns"
import Header from "../_components/header";
import { ptBR } from "date-fns/locale";
import Search from "./_components/search";
import BookingItems from "../_components/booking-items";

export default function Home() {
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

      <div className="px-5 mt-6">
        <Search />
      </div>

      <div className="px-5 mt-6">
        <h2 className="text-sm uppercase text-gray-400 font-bold mb-3">Agendamentos</h2>
        <BookingItems />
      </div>

    </div>
  );
}
