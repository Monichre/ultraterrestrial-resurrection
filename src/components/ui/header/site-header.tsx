// import { Logo } from '@/components/logo'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { FunctionComponent } from 'react'

interface SiteHeaderProps { }

export const SiteHeader: FunctionComponent<SiteHeaderProps> = () => {
  return (
    <header className='fixed left-0 w-full top-0 flex h-16 items-center gap-4  bg-transparent px-4 md:px-6 h-[90px]'>
      <nav className='p-4 flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
        {/* <Logo /> */}
      </nav>
      {/* <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <Link href="#" className="hover:text-foreground">
            Dashboard
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground"
          >
            Orders
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground"
          >
            Products
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground"
          >
            Customers
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground"
          >
            Analytics
          </Link>
        </nav>
      </SheetContent>
    </Sheet> */}
      <div className='flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4'>
        <form className='ml-auto flex-1 sm:flex-initial border-none'>
          <div className='relative'>
            <Search className='absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='search'
              className='pl-8 sm:w-[200px] md:w-[200px] lg:w-[200px] border-none'
            />
          </div>
        </form>
      </div>
    </header>
  )
}
