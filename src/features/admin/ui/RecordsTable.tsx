'use client'
import React, { useEffect } from 'react'

import Image from 'next/image'
import { MoreHorizontal } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TableConfig } from '@/features/admin/ui/columns'
import { Badge } from '@/components/ui/badge'
import {
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'
import { AnimatedGridPatternBackground } from '@/components/backgrounds/animated-grid-pattern'
import { Input } from '@/components/ui/input'

export function RecordsTable( {
  model,
  records,
  addItemToSelectedRecordsList,
}: any ) {
  console.log( 'model: ', model )
  console.log( 'records: ', records )
  console.log( 'TableConfig: ', TableConfig )
  const columns = TableConfig[model].columns
  console.log( 'columns: ', columns )

  const [sorting, setSorting] = React.useState<SortingState>( [] )
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>( {} )
  const [rowSelection, setRowSelection] = React.useState( {} )

  const handleRowClick = ( { id, original: item }: any ) => {
    console.log( 'item: ', item )
    addItemToSelectedRecordsList( { rowId: id, ...item } )
  }
  console.log( 'rowSelection: ', rowSelection )

  const table = useReactTable( {
    data: records,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getRowId: ( row: any ) => row?.uuid,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  } )

  useEffect( () => {
    console.log( 'rowSelection: ', rowSelection )
    if ( Object.keys( rowSelection ).length > 0 ) {
      const selected = table.getSelectedRowModel().rows
      console.log( 'selected: ', selected )
      const models = selected.map( ( { id, original }: any ) => ( {
        rowId: id,
        ...original,
      } ) )
      models.forEach( ( model ) => addItemToSelectedRecordsList( model ) )
    }
  }, [addItemToSelectedRecordsList, rowSelection, table] )

  // bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black
  // bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-300 via-lime-900 to-lime-100
  return (
    <Card className='rounded-lg border shadow-sm mt-2 admin-dashboard-table-card backdrop-blur-[10px] relative p-4 relative z-20 h-content'>
      <AnimatedGridPatternBackground
        numSquares={30}
        maxOpacity={0.5}
        duration={3}
        repeatDelay={1}
        className={cn(
          '[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]',
          'inset-x-0 inset-y-[-30%] h-[200%] skew-y-12'
        )}
      />
      <CardHeader>
        <CardTitle>
          <div className='flex justify-between'>
            <h2 className='font-bebasNeuePro text-white uppercase tracking-wide font-medium text-xl'>
              {model}
            </h2>
            <div className='flex flex-col space-y-4'>
              <Input id='file' type='file' />
              <Button variant='outline' className='w-min mx-auto'>
                Upload {model} CSV
              </Button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map( ( column: any ) => (
                <TableHead
                  className='font-bebasNeuePro uppercase font-medium !tracking-[1px] !text-white'
                  key={column.header}
                >
                  {column.header}
                </TableHead>
              ) )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map( ( row ) => (
                <TableRow
                  className='hover:bg-gray-100 bg-[#000001]'
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                // onClick={() => handleRowClick(row)}
                >
                  {row.getVisibleCells().map( ( cell ) => {
                    console.log( 'cell: ', cell )
                    const columnName = cell.column.id
                    const isDescription = columnName === 'description'
                    const className = isDescription ? 'w-content' : 'w-content'
                    return (
                      <TableCell key={cell.id} className={className}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    )
                  } )}
                </TableRow>
              ) )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center w-min'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className='flex items-center justify-between space-x-2 py-4 w-full'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
