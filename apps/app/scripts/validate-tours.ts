#!/usr/bin/env node

import { promises as fs } from 'fs'
import { join, resolve } from 'path'
import yaml from 'js-yaml'
import { XataClient } from '@/packages/db/xata'
import type {
  TourDefinition,
  TourWaypoint,
  DatabaseReference,
  ValidationError,
  ValidationWarning,
  TourValidationResult,
  TourYAMLStructure
} from '../src/features/tours/types/tour'

interface ValidationOptions {
  checkDatabase: boolean
  verbose: boolean
  fixableIssues: boolean
  outputFormat: 'console' | 'json' | 'junit'
}

class TourValidator {
  private xata: XataClient
  private errors: ValidationError[] = []
  private warnings: ValidationWarning[] = []
  private validatedTours = new Map<string, TourDefinition>()

  constructor( private options: ValidationOptions ) {
    this.xata = new XataClient()
  }

  async validateAllTours( toursDirectory: string ): Promise<TourValidationResult[]> {
    const results: TourValidationResult[] = []

    try {
      const tourFiles = await this.findTourFiles( toursDirectory )

      if ( this.options.verbose ) {
        console.log( `Found ${tourFiles.length} tour files to validate` )
      }

      for ( const tourFile of tourFiles ) {
        const result = await this.validateTourFile( tourFile )
        results.push( result )

        if ( result.tour ) {
          this.validatedTours.set( result.tour.id, result.tour )
        }
      }

      // Check for cross-tour dependencies and cycles
      await this.validateCrossTourDependencies()

    } catch ( error ) {
      console.error( 'Error during tour validation:', error )
      results.push( {
        isValid: false,
        errors: [{
          type: 'invalidStructure',
          message: `Failed to validate tours: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        warnings: []
      } )
    }

    return results
  }

  private async findTourFiles( directory: string ): Promise<string[]> {
    const files: string[] = []

    try {
      const entries = await fs.readdir( directory, { withFileTypes: true } )

      for ( const entry of entries ) {
        const fullPath = join( directory, entry.name )

        if ( entry.isDirectory() ) {
          // Recursively search subdirectories
          const subFiles = await this.findTourFiles( fullPath )
          files.push( ...subFiles )
        } else if ( entry.isFile() && ( entry.name.endsWith( '.yaml' ) || entry.name.endsWith( '.yml' ) ) ) {
          files.push( fullPath )
        }
      }
    } catch ( error ) {
      if ( this.options.verbose ) {
        console.warn( `Could not read directory ${directory}:`, error )
      }
    }

    return files
  }

  private async validateTourFile( filePath: string ): Promise<TourValidationResult> {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    try {
      // Read and parse YAML file
      const content = await fs.readFile( filePath, 'utf-8' )
      const yamlData = yaml.load( content ) as TourYAMLStructure

      if ( !yamlData || typeof yamlData !== 'object' ) {
        return {
          isValid: false,
          errors: [{
            type: 'invalidStructure',
            message: `Invalid YAML structure in ${filePath}`
          }],
          warnings: []
        }
      }

      // Convert YAML to TourDefinition
      const tour = this.convertYAMLToTour( yamlData, filePath )

      // Validate tour structure
      this.validateTourStructure( tour, errors, warnings )

      // Validate database references if enabled
      if ( this.options.checkDatabase ) {
        await this.validateDatabaseReferences( tour, errors, warnings )
      }

      // Check for cyclic dependencies within the tour
      this.validateWaypointDependencies( tour, errors, warnings )

      return {
        isValid: errors.length === 0,
        tour: errors.length === 0 ? tour : undefined,
        errors,
        warnings
      }

    } catch ( error ) {
      return {
        isValid: false,
        errors: [{
          type: 'invalidStructure',
          message: `Failed to parse tour file ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        warnings: []
      }
    }
  }

  private convertYAMLToTour( yamlData: TourYAMLStructure, filePath: string ): TourDefinition {
    const { tour } = yamlData

    return {
      id: tour.metadata.id,
      title: tour.metadata.title,
      description: tour.metadata.description,
      difficulty: tour.metadata.difficulty,
      estimatedDuration: tour.metadata.estimatedDuration,
      version: tour.metadata.version,
      createdAt: tour.metadata.createdAt,
      updatedAt: tour.metadata.updatedAt,
      waypoints: tour.waypoints.map( wp => ( {
        id: wp.id,
        title: wp.title,
        description: wp.description,
        narrative: wp.narrative,
        dbRef: {
          type: wp.dbRef.type as any,
          id: wp.dbRef.id,
          table: wp.dbRef.table,
          relationships: wp.dbRef.relationships
        },
        contextRules: {
          searchRules: wp.context.searchRules,
          filterCriteria: {
            dateRange: wp.context.filters?.dateRange,
            locationRadius: wp.context.filters?.location ? {
              center: { lat: wp.context.filters.location.lat, lng: wp.context.filters.location.lng },
              radiusKm: wp.context.filters.location.radius
            } : undefined,
            entityTypes: wp.context.filters?.types,
            keywords: wp.context.filters?.keywords,
            excludeKeywords: wp.context.filters?.exclude
          },
          layoutPreferences: {
            type: ( wp.context.layout?.type as any ) || 'radial',
            spacing: wp.context.layout?.spacing || 200,
            centerChildren: wp.context.layout?.centerChildren !== false,
            parentChildSpacing: 150
          }
        },
        visualSettings: {
          highlightColor: wp.visual.highlight,
          nodeStyle: ( wp.visual.style as any ) || 'default',
          showConnections: true,
          zoomLevel: wp.visual.zoom || 1,
          centerOnLoad: wp.visual.center !== false,
          animationDuration: 500
        },
        prerequisites: wp.prerequisites,
        validation: wp.validation ? {
          required: wp.validation.required || false,
          validationRules: wp.validation.rules || []
        } : undefined
      } ) ),
      metadata: tour.metadata.metadata
    }
  }

  private validateTourStructure( tour: TourDefinition, errors: ValidationError[], warnings: ValidationWarning[] ): void {
    // Validate required fields
    if ( !tour.id ) {
      errors.push( {
        type: 'invalidStructure',
        message: 'Tour must have an ID',
        field: 'id'
      } )
    }

    if ( !tour.title ) {
      errors.push( {
        type: 'invalidStructure',
        message: 'Tour must have a title',
        field: 'title'
      } )
    }

    if ( !tour.waypoints || tour.waypoints.length === 0 ) {
      errors.push( {
        type: 'invalidStructure',
        message: 'Tour must have at least one waypoint',
        field: 'waypoints'
      } )
      return
    }

    // Validate waypoints
    const waypointIds = new Set<string>()

    for ( const waypoint of tour.waypoints ) {
      // Check for duplicate waypoint IDs
      if ( waypointIds.has( waypoint.id ) ) {
        errors.push( {
          type: 'invalidStructure',
          waypointId: waypoint.id,
          message: `Duplicate waypoint ID: ${waypoint.id}`
        } )
      }
      waypointIds.add( waypoint.id )

      // Validate waypoint structure
      this.validateWaypoint( waypoint, errors, warnings )
    }

    // Check version compatibility
    if ( tour.version && !this.isVersionCompatible( tour.version ) ) {
      warnings.push( {
        type: 'incompatibleVersion',
        message: `Tour version ${tour.version} may not be compatible with current system`,
        suggestion: 'Consider updating the tour to the latest version format'
      } )
    }
  }

  private validateWaypoint( waypoint: TourWaypoint, errors: ValidationError[], warnings: ValidationWarning[] ): void {
    // Validate required fields
    if ( !waypoint.id ) {
      errors.push( {
        type: 'invalidStructure',
        message: 'Waypoint must have an ID',
        field: 'id'
      } )
    }

    if ( !waypoint.title ) {
      errors.push( {
        type: 'invalidStructure',
        waypointId: waypoint.id,
        message: 'Waypoint must have a title',
        field: 'title'
      } )
    }

    if ( !waypoint.dbRef ) {
      errors.push( {
        type: 'invalidStructure',
        waypointId: waypoint.id,
        message: 'Waypoint must have a database reference',
        field: 'dbRef'
      } )
    } else {
      this.validateDatabaseReference( waypoint.dbRef, waypoint.id, errors, warnings )
    }

    // Validate prerequisites exist
    if ( waypoint.prerequisites ) {
      // Note: Cross-waypoint validation will be done later when all tours are loaded
    }
  }

  private validateDatabaseReference( dbRef: DatabaseReference, waypointId: string, errors: ValidationError[], warnings: ValidationWarning[] ): void {
    const validTypes = ['events', 'personnel', 'topics', 'organizations', 'testimonies', 'documents', 'sightings']

    if ( !validTypes.includes( dbRef.type ) ) {
      errors.push( {
        type: 'invalidStructure',
        waypointId,
        message: `Invalid database reference type: ${dbRef.type}. Must be one of: ${validTypes.join( ', ' )}`,
        field: 'dbRef.type'
      } )
    }

    if ( !dbRef.id ) {
      errors.push( {
        type: 'invalidStructure',
        waypointId,
        message: 'Database reference must have an ID',
        field: 'dbRef.id'
      } )
    }

    if ( !dbRef.table ) {
      warnings.push( {
        type: 'missingOptional',
        waypointId,
        message: 'Database reference should specify a table name',
        suggestion: 'Add table field to database reference for better validation'
      } )
    }
  }

  private async validateDatabaseReferences( tour: TourDefinition, errors: ValidationError[], warnings: ValidationWarning[] ): Promise<void> {
    if ( this.options.verbose ) {
      console.log( `Validating database references for tour: ${tour.title}` )
    }

    for ( const waypoint of tour.waypoints ) {
      try {
        const exists = await this.checkDatabaseRecordExists( waypoint.dbRef )

        if ( !exists ) {
          errors.push( {
            type: 'missingReference',
            waypointId: waypoint.id,
            message: `Database record not found: ${waypoint.dbRef.type}:${waypoint.dbRef.id}`
          } )
        }
      } catch ( error ) {
        warnings.push( {
          type: 'performanceConcern',
          waypointId: waypoint.id,
          message: `Could not validate database reference: ${error instanceof Error ? error.message : 'Unknown error'}`,
          suggestion: 'Check database connectivity and permissions'
        } )
      }
    }
  }

  private async checkDatabaseRecordExists( dbRef: DatabaseReference ): Promise<boolean> {
    try {
      // Use the Xata client to check if the record exists
      const tableName = dbRef.table || dbRef.type
      const record = await ( this.xata as any )[tableName].read( dbRef.id )
      return !!record
    } catch ( error ) {
      if ( this.options.verbose ) {
        console.warn( `Database check failed for ${dbRef.type}:${dbRef.id}:`, error )
      }
      return false
    }
  }

  private validateWaypointDependencies( tour: TourDefinition, errors: ValidationError[], warnings: ValidationWarning[] ): void {
    const waypointIds = new Set( tour.waypoints.map( wp => wp.id ) )

    for ( const waypoint of tour.waypoints ) {
      if ( waypoint.prerequisites ) {
        for ( const prereqId of waypoint.prerequisites ) {
          if ( !waypointIds.has( prereqId ) ) {
            errors.push( {
              type: 'missingReference',
              waypointId: waypoint.id,
              message: `Prerequisite waypoint not found: ${prereqId}`
            } )
          }
        }
      }
    }

    // Check for cycles in prerequisites
    this.detectCycles( tour, errors )
  }

  private detectCycles( tour: TourDefinition, errors: ValidationError[] ): void {
    const visited = new Set<string>()
    const recursionStack = new Set<string>()

    const dfs = ( waypointId: string, path: string[] ): boolean => {
      if ( recursionStack.has( waypointId ) ) {
        errors.push( {
          type: 'cyclicDependency',
          waypointId,
          message: `Cyclic dependency detected in tour prerequisites: ${path.join( ' -> ' )} -> ${waypointId}`
        } )
        return true
      }

      if ( visited.has( waypointId ) ) {
        return false
      }

      visited.add( waypointId )
      recursionStack.add( waypointId )

      const waypoint = tour.waypoints.find( wp => wp.id === waypointId )
      if ( waypoint?.prerequisites ) {
        for ( const prereqId of waypoint.prerequisites ) {
          if ( dfs( prereqId, [...path, waypointId] ) ) {
            return true
          }
        }
      }

      recursionStack.delete( waypointId )
      return false
    }

    for ( const waypoint of tour.waypoints ) {
      if ( !visited.has( waypoint.id ) ) {
        dfs( waypoint.id, [] )
      }
    }
  }

  private async validateCrossTourDependencies(): Promise<void> {
    // Check for references between tours if any tours reference external tour waypoints
    // This is a placeholder for future cross-tour dependency validation
    for ( const [tourId, tour] of this.validatedTours ) {
      if ( tour.metadata?.relatedTours ) {
        for ( const relatedTourId of tour.metadata.relatedTours ) {
          if ( !this.validatedTours.has( relatedTourId ) ) {
            this.warnings.push( {
              type: 'missingOptional',
              message: `Related tour not found or not validated: ${relatedTourId} (referenced by ${tourId})`,
              suggestion: 'Ensure all related tours are present and valid'
            } )
          }
        }
      }
    }
  }

  private isVersionCompatible( version: string ): boolean {
    // Implement version compatibility check
    // For now, accept any version that starts with "1."
    return version.startsWith( '1.' )
  }

  generateReport( results: TourValidationResult[] ): string {
    const totalTours = results.length
    const validTours = results.filter( r => r.isValid ).length
    const totalErrors = results.reduce( ( sum, r ) => sum + r.errors.length, 0 )
    const totalWarnings = results.reduce( ( sum, r ) => sum + r.warnings.length, 0 )

    let report = `\n=== Tour Validation Report ===\n`
    report += `Total Tours: ${totalTours}\n`
    report += `Valid Tours: ${validTours}\n`
    report += `Invalid Tours: ${totalTours - validTours}\n`
    report += `Total Errors: ${totalErrors}\n`
    report += `Total Warnings: ${totalWarnings}\n\n`

    if ( totalErrors > 0 ) {
      report += `ERRORS:\n`
      for ( const result of results ) {
        for ( const error of result.errors ) {
          report += `  - ${error.waypointId ? `[${error.waypointId}] ` : ''}${error.message}\n`
        }
      }
      report += `\n`
    }

    if ( totalWarnings > 0 ) {
      report += `WARNINGS:\n`
      for ( const result of results ) {
        for ( const warning of result.warnings ) {
          report += `  - ${warning.waypointId ? `[${warning.waypointId}] ` : ''}${warning.message}\n`
          if ( warning.suggestion ) {
            report += `    Suggestion: ${warning.suggestion}\n`
          }
        }
      }
    }

    return report
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice( 2 )
  const options: ValidationOptions = {
    checkDatabase: args.includes( '--check-database' ) || args.includes( '-d' ),
    verbose: args.includes( '--verbose' ) || args.includes( '-v' ),
    fixableIssues: args.includes( '--fix' ) || args.includes( '-f' ),
    outputFormat: 'console'
  }

  if ( args.includes( '--json' ) ) {
    options.outputFormat = 'json'
  } else if ( args.includes( '--junit' ) ) {
    options.outputFormat = 'junit'
  }

  const toursDirectory = args.find( arg => !arg.startsWith( '-' ) ) || resolve( process.cwd(), 'tours' )

  if ( options.verbose ) {
    console.log( 'Tour Validation Options:', options )
    console.log( 'Tours Directory:', toursDirectory )
  }

  const validator = new TourValidator( options )

  try {
    const results = await validator.validateAllTours( toursDirectory )

    switch ( options.outputFormat ) {
      case 'json':
        console.log( JSON.stringify( results, null, 2 ) )
        break
      case 'junit':
        // Implement JUnit XML format if needed
        console.log( 'JUnit format not yet implemented' )
        break
      default:
        console.log( validator.generateReport( results ) )
    }

    // Exit with appropriate code
    const hasErrors = results.some( r => !r.isValid )
    process.exit( hasErrors ? 1 : 0 )

  } catch ( error ) {
    console.error( 'Validation failed:', error )
    process.exit( 1 )
  }
}

// Run if called directly
if ( require.main === module ) {
  main().catch( error => {
    console.error( 'Unhandled error:', error )
    process.exit( 1 )
  } )
}

export { TourValidator }
export type { ValidationOptions } 