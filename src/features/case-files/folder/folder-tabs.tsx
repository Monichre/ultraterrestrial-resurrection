import { BoxIcon, HouseIcon, PanelsTopLeftIcon } from "lucide-react"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function Component() {
  return (
    <Tabs defaultValue="tab-1">
      <ScrollArea>
        <TabsList className="before:bg-gray-200 relative mb-3 h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px dark:before:bg-gray-800">
          <TabsTrigger
            value="tab-1"
            className="bg-gray-100 overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none dark:bg-gray-800"
          >
            <HouseIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="tab-2"
            className="bg-gray-100 overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none dark:bg-gray-800"
          >
            <PanelsTopLeftIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Projects
          </TabsTrigger>
          <TabsTrigger
            value="tab-3"
            className="bg-gray-100 overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none dark:bg-gray-800"
          >
            <BoxIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Packages
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TabsContent value="tab-1">
        <p className="text-gray-500 p-4 pt-1 text-center text-xs dark:text-gray-400">
          Content for Tab 1
        </p>
      </TabsContent>
      <TabsContent value="tab-2">
        <p className="text-gray-500 p-4 pt-1 text-center text-xs dark:text-gray-400">
          Content for Tab 2
        </p>
      </TabsContent>
      <TabsContent value="tab-3">
        <p className="text-gray-500 p-4 pt-1 text-center text-xs dark:text-gray-400">
          Content for Tab 3
        </p>
      </TabsContent>
    </Tabs>
  )
}
