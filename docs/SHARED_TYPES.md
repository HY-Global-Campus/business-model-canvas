# Shared Types System Documentation

## Overview

The Business Model Canvas application uses a shared types system to ensure type consistency between the frontend (React/TypeScript) and backend (Node.js/TypeScript) components. This documentation explains how the system works and how to maintain it.

## Directory Structure

```
shared_types/
├── bmc.ts          # Business Model Canvas types
├── exercises.ts    # Exercise and course-related types
```

## Type Categories

### 1. Business Model Canvas Types (`bmc.ts`)

- **BMCBlockId**: Type union for all BMC block identifiers
- **BusinessContext**: Interface for business context information
- **BMCExercises**: Interface for BMC exercise data
- **BMCProject**: Interface for complete BMC projects
- **BMCBlockMeta**: Interface for BMC block metadata (UI-related)

### 2. Exercise Types (`exercises.ts`)

#### Book One Exercises
- **ChooseChallenge** / **ChooseChallengeAnswer**
- **IdentifyLeveragePoints** / **IdentifyLeveragePointsAnswer**
- **RedefineChallenge** / **RedefineChallengeAnswer**
- **Values** / **ValuesAnswer**
- **FromFutureToPresent** / **FromFutureToPresentAnswer**
- **FuturePitch** / **FuturePitchAnswer**
- **BookOneExercises**: Complete interface for all Book One exercises

#### Course Exercises
- **CourseExercises**: Interface for course-related exercise data including:
  - `courseInfo`: Basic course information
  - `learningObjectives`: Learning outcomes and objectives
  - `coreContent`: Core content structure
  - `teachingMethods`: Teaching methods matrix
  - `assessmentMethods`: Assessment methods matrix
  - `gradingCriteriaReflection`: Grading criteria and reflection
  - Legacy fields for backward compatibility

## How It Works

### Frontend Integration

The frontend uses TypeScript path aliases to import types from the `shared_types` directory:

```typescript
// frontend/src/types/exercises.ts
export * from '@shared_types/exercises';

// frontend/src/types/bmc.ts
export * from '@shared_types/bmc';
```

The path alias is configured in `frontend/tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@shared_types/*": ["../shared_types/*"]
    }
  }
}
```

### Backend Integration

The backend includes the shared types directly in its type files:

```typescript
// backend/src/types/exercises.ts
// Contains comprehensive type definitions that match shared_types/exercises.ts
```

### Synchronization Script

A script is provided to synchronize types between the shared directory and both frontend/backend:

```bash
npm run sync-types
```

This script:
1. Copies shared types to frontend type files
2. Creates a comprehensive backend types file
3. Ensures consistency across the entire application

## Usage

### Adding New Types

1. **Add to shared_types**: Create or modify types in the `shared_types/` directory
2. **Run sync script**: `npm run sync-types`
3. **Test**: Verify TypeScript compilation in both frontend and backend

### Modifying Existing Types

1. **Edit shared_types**: Make changes to the appropriate file in `shared_types/`
2. **Run sync script**: `npm run sync-types`
3. **Update imports**: Ensure all files using the modified types are updated
4. **Test**: Run `npm run test-types` to verify type consistency

## Best Practices

1. **Single Source of Truth**: Always modify types in `shared_types/` first
2. **Type Safety**: Use specific types rather than `any` or generic types
3. **Backward Compatibility**: When modifying existing types, consider adding optional fields rather than breaking changes
4. **Documentation**: Add comments to complex type definitions
5. **Testing**: Always test TypeScript compilation after type changes

## Common Commands

```bash
# Sync shared types to frontend and backend
npm run sync-types

# Test TypeScript compilation in both frontend and backend
npm run test-types

# Build frontend (includes TypeScript check)
npm run build

# Build backend (includes TypeScript check)
cd backend && npm run build
```

## Troubleshooting

### TypeScript Errors After Sync

1. **Check imports**: Ensure all files are importing from the correct locations
2. **Run sync again**: Sometimes a second sync resolves issues
3. **Clean build**: Delete `node_modules` and reinstall dependencies
4. **Check tsconfig**: Verify path aliases are correctly configured

### Missing Types

If a type is missing in one part of the application:
1. Verify it exists in `shared_types/`
2. Run `npm run sync-types`
3. Check the specific frontend/backend type file

## Migration Guide

### From Old System to Shared Types

1. **Identify duplicate types**: Find types that exist in multiple locations
2. **Move to shared_types**: Create appropriate files and move types
3. **Update imports**: Change imports to use the shared types
4. **Run sync script**: `npm run sync-types`
5. **Test thoroughly**: Verify all functionality works correctly

## Type Reference

### BMCBlockId

```typescript
export type BMCBlockId = 
  | 'customerSegments' 
  | 'valuePropositions' 
  | 'channels'
  | 'customerRelationships'
  | 'revenueStreams'
  | 'keyResources'
  | 'keyActivities'
  | 'keyPartnerships'
  | 'costStructure';
```

### CourseExercises

```typescript
export interface CourseExercises {
  courseInfo?: {
    name?: string;
    scope?: string;
    targetStudents?: string;
    studentsSkillLevel?: string;
  };
  learningObjectives?: {
    learningOutcomes?: string;
  };
  // ... other exercise fields
}
```

## Maintenance

Regularly review the shared types to:
1. Remove unused types
2. Update documentation
3. Ensure consistency with API contracts
4. Add new types as features are developed

## Version History

- **1.0.0**: Initial shared types system implementation
- **1.0.1**: Added comprehensive documentation
- **1.0.2**: Fixed TypeScript linting issues
- **1.0.3**: Removed debug console.log statements
