export interface Days {
  id: number;
  day: string;
  date: string;
  month: string;
  schedule: Schedule[];
  week_name: string;
  professor: string;
  tooltip: string;
}

export interface Schedule {
  id: number;
  room: string;
  section: string
}
