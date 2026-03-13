import { BMCProject, BusinessContext, BMCExercises } from '../../types/bmc';

export const SNAPSHOT_FILE_EXTENSION = '.canvas';

export class CanvasSnapshotError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CanvasSnapshotError';
  }
}

export const SNAPSHOT_VERSION = 1;
export const SNAPSHOT_MIME_TYPE = 'application/json';

export interface CanvasProjectSnapshot {
  displayName: string;
  businessContext: BusinessContext;
  canvasData: BMCExercises;
  lastModified: Record<string, string>;
  completionStatus: Record<string, number>;
}

export interface CanvasSnapshot {
  version: typeof SNAPSHOT_VERSION;
  exportedAt: string;
  project: CanvasProjectSnapshot;
}

export function createCanvasSnapshot(project: BMCProject): CanvasSnapshot {
  if (!project) {
    throw new CanvasSnapshotError('Cannot export an empty project.');
  }

  return {
    version: SNAPSHOT_VERSION,
    exportedAt: new Date().toISOString(),
    project: {
      displayName: project.displayName,
      businessContext: project.businessContext,
      canvasData: project.canvasData,
      lastModified: project.lastModified,
      completionStatus: project.completionStatus,
    },
  };
}

export function serializeCanvasSnapshot(snapshot: CanvasSnapshot): string {
  return JSON.stringify(snapshot);
}

export function createSnapshotBlob(snapshot: CanvasSnapshot): Blob {
  return new Blob([serializeCanvasSnapshot(snapshot)], { type: SNAPSHOT_MIME_TYPE });
}

export async function parseCanvasSnapshotFile(file: File): Promise<CanvasSnapshot> {
  try {
    const text = await file.text();
    return parseCanvasSnapshot(text);
  } catch (error) {
    throw new CanvasSnapshotError(
      error instanceof Error ? error.message : 'Failed to read snapshot file.'
    );
  }
}

export function parseCanvasSnapshot(input: string): CanvasSnapshot {
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch (error) {
    throw new CanvasSnapshotError('Snapshot is not valid JSON.');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new CanvasSnapshotError('Snapshot payload is malformed.');
  }

  const { version, exportedAt, project } = parsed as Partial<CanvasSnapshot>;

  if (version !== SNAPSHOT_VERSION) {
    throw new CanvasSnapshotError(
      `Unsupported snapshot version${typeof version === 'number' ? `: ${version}` : ''}.`
    );
  }

  if (!exportedAt || typeof exportedAt !== 'string') {
    throw new CanvasSnapshotError('Snapshot is missing export timestamp.');
  }

  if (!project || typeof project !== 'object') {
    throw new CanvasSnapshotError('Snapshot is missing project data.');
  }

  validateProjectSnapshot(project, exportedAt);

  return {
    version: SNAPSHOT_VERSION,
    exportedAt,
    project: project as CanvasProjectSnapshot,
  };
}

function validateProjectSnapshot(project: unknown, exportedAt: string): asserts project is CanvasProjectSnapshot {
  const candidate = project as CanvasProjectSnapshot;

  if (typeof candidate.displayName !== 'string') {
    throw new CanvasSnapshotError('Snapshot project is missing display name.');
  }

  if (!isBusinessContext(candidate.businessContext)) {
    throw new CanvasSnapshotError('Snapshot project business context is invalid.');
  }

  if (!isRecordOfString(candidate.canvasData, true)) {
    throw new CanvasSnapshotError('Snapshot project canvas data is invalid.');
  }

  if (!isRecordOfString(candidate.lastModified)) {
    throw new CanvasSnapshotError('Snapshot project lastModified is invalid.');
  }

  if (!isRecordOfNumber(candidate.completionStatus, true)) {
    throw new CanvasSnapshotError('Snapshot project completionStatus is invalid.');
  }

  if (Number.isNaN(Date.parse(exportedAt))) {
    throw new CanvasSnapshotError('Snapshot export timestamp is invalid.');
  }
}

function isBusinessContext(value: unknown): value is BusinessContext {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const context = value as BusinessContext;
  return (
    typeof context.industry === 'string' &&
    typeof context.stage === 'string' &&
    typeof context.description === 'string'
  );
}

function isRecordOfString(value: unknown, allowUndefined = false): value is Record<string, string> {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return Object.values(value as Record<string, unknown>).every((entry) => {
    if (typeof entry === 'string') {
      return true;
    }
    if (allowUndefined && typeof entry === 'undefined') {
      return true;
    }
    return false;
  });
}

function isRecordOfNumber(value: unknown, allowUndefined = false): value is Record<string, number> {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return Object.values(value as Record<string, unknown>).every((entry) => {
    if (typeof entry === 'number' && Number.isFinite(entry)) {
      return true;
    }
    if (allowUndefined && typeof entry === 'undefined') {
      return true;
    }
    return false;
  });
}

export function getSnapshotFilename(project: BMCProject): string {
  const projectName = (project.displayName || 'Business-Model-Canvas').replace(/[^a-zA-Z0-9]/g, '-');
  const date = new Date().toISOString().split('T')[0];
  return `${projectName}_BMC_Snapshot_${date}${SNAPSHOT_FILE_EXTENSION}`;
}
