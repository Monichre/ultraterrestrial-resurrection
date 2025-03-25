'use client'

import { ColumnDef } from '@tanstack/react-table'
import { TABLES } from '@/db/xata'
import { capitalize, truncate } from '@/utils/functions'
import Image from 'next/image'
import { Checkbox } from '@/components/ui/checkbox'
const dayjs = require( 'dayjs' )
const utc = require( 'dayjs/plugin/utc' )
dayjs.extend( utc )

const generateTableConfig = () => {
  const tableColumns: any = {}
  TABLES.forEach( ( { name: tableName, columns }: any ) => {
    tableColumns[tableName] = {
      columns: [
        {
          id: 'select',

          header: ( { table }: any ) => (
            <Checkbox
              className='h-2 w-2'
              checked={
                table.getIsAllPageRowsSelected() ||
                ( table.getIsSomePageRowsSelected() && 'indeterminate' )
              }
              onCheckedChange={( value ) =>
                table.toggleAllPageRowsSelected( !!value )
              }
              aria-label='Select all'
            />
          ),
          cell: ( { row }: any ) => (
            <div className='w-[30px]'>
              <Checkbox
                className='h-2 w-2'
                checked={row.getIsSelected()}
                onCheckedChange={( value ) => row.toggleSelected( !!value )}
                aria-label='Select row'
              />
            </div>
          ),
          enableSorting: false,
          enableHiding: false,
        },
        ...columns.map( ( { name, type }: any ) => ( {
          accessorKey: name,
          header: name,
          sortingFn: name === 'date' ? 'datetime' : 'alphanumeric',
          sortDescFirst: true,
          cell: ( { row }: any ) => {
            if ( name === 'name' ) {
              return (
                <p className='font-source tracking-wide text-sm !text-[#cffafe] w-[500px]'>
                  {capitalize( row.getValue( name ) )}
                </p>
              )
            }
            if ( name === 'date' ) {
              const date = dayjs( row.getValue( 'date' ) ).format( 'MMMM DD, YYYY' )

              return date
            }
            if ( name === 'summary' || name === 'description' ) {
              return (
                <p className='font-source tracking-wide font-light text-sm text-white w-[500px]'>
                  {truncate( row.getValue( name ), 300 )}
                </p>
              )
            }
            if ( name === 'photos' || name === 'photo' ) {
              const photoData = row.getValue( name )
              if ( Array.isArray( photoData ) ) {
                return photoData.map( ( photo: any ) => (
                  <Image
                    key={photo.id}
                    height={20}
                    width={20}
                    src={photo.url}
                    alt={photo.url}
                    className='w-10 h-10 rounded-l-sm'
                  />
                ) )
              } else {
                return (
                  <Image
                    key={photoData.id}
                    height={20}
                    width={20}
                    src={photoData.url}
                    alt={photoData.url}
                    className='w-10 h-10 rounded-l-sm'
                  />
                )
              }
            }
            return <div className='w-fit'>{row.getValue( name )}</div>
          },
        } ) ),
      ],
    }
  } )

  return tableColumns as Record<string, ColumnDef<any>>
}

export const TableConfig: any = generateTableConfig()
