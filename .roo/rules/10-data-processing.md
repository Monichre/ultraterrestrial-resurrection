---
description: 
globs: 
alwaysApply: false
---
# Data Processing

The project includes data processing pipelines for various types of information.

## Data Processing Structure

- `apps/app/scripts/data-import` - Data import scripts
- `apps/app/scripts/data-import/processing` - Processing logic
- `apps/app/scripts/data-import/importers` - Data importers
- `apps/app/scripts/data-import/processors` - Data processors

## Data Categories

- `events` - Historical events
- `personnel` - Personnel records
- `testimonies` - Testimonial records
- `ufo-int-tests` - UFO interaction tests

## Key Data Processing Files

- [apps/app/scripts/data-import/events](mdc:/Users/liamellis/Desktop/UltraterrestrialSalvageAttempt/ultraterrestrial-resurrection/apps/app/scripts/data-import/events/) - Event processing
- [apps/app/scripts/data-import/testimonies](mdc:/Users/liamellis/Desktop/UltraterrestrialSalvageAttempt/ultraterrestrial-resurrection/apps/app/scripts/data-import/testimonies/) - Testimony processing
- [apps/app/scripts/data-import/processing](mdc:/Users/liamellis/Desktop/UltraterrestrialSalvageAttempt/ultraterrestrial-resurrection/apps/app/scripts/data-import/processing/) - Core processing logic

## Data Usage Patterns

- Follow established data schemas
- Implement proper validation and error handling
- Process data in batches for efficiency
- Ensure data consistency across different types
