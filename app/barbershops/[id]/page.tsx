import { Button } from "@/app/_components/ui/button";
import { db } from "@/app/_lib/prisma";
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import BarbershopInfo from "./_components/barbershop-info";

interface BarbershopDetailsPageProps {
    params: any;
    id?: string;
}

const BarbershopDetailsPage = async ({ params }: BarbershopDetailsPageProps) => {
    const barbershop = await db.barbershop.findUnique({
        where: {
            id: params.id
        }
    })

    if (!params.id || !barbershop) {
        //to do: redirecionar para a home page
        return null;
    }

    return (
        <BarbershopInfo barbershop={barbershop} />
    );
}

export default BarbershopDetailsPage;