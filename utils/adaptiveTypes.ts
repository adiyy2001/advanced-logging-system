interface UserProfile {
  name: string;
  age: number;
}

interface ManagerReport {
  reportId: string;
  data: number[];
}

interface BackupStatus {
  status: string;
  progress: number;
}

type DataType<T> = T extends 'user'
  ? UserProfile
  : T extends 'report'
    ? ManagerReport[]
    : T extends 'backup'
      ? BackupStatus
      : unknown;

export default async function fetchDataAdaptive<T extends 'user' | 'report' | 'backup'>(type: T): Promise<DataType<T>> {
  switch (type) {
    case 'user':
      return { name: 'Alice', age: 30 } as DataType<T>;
    case 'report':
      return [{ reportId: 'R1', data: [1, 2, 3] }] as DataType<T>;
    case 'backup':
      return { status: 'completed', progress: 100 } as DataType<T>;
    default:
      throw new Error('Unknown data type');
  }
}
