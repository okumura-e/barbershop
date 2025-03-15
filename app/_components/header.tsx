'use client';

import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import SideMenu from './side-menu';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const Header = () => {
  return (
    <header>
      <Card className="rounded-none">
        <CardContent className="p-5 justify-between items-center flex flex-row">
          <Link href="/">
            <Image
              src="/logo-cheia.png"
              alt="FSW Barber"
              height={18}
              width={120}
              className="w-auto h-auto"
            />
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <MenuIcon size={18} />
              </Button>
            </SheetTrigger>

            <SheetContent className="p-0">
              <SideMenu />
            </SheetContent>
          </Sheet>
        </CardContent>
      </Card>
    </header>
  );
};
export default Header;