
export interface Term {
  id: number;
  day: string;
  date: string;
  month: string;
  schedule: ScheduleMeta[];
  week_name: string;
  professor: string;
  tooltip: string;
}
export interface ScheduleMeta {
  id: number;
  room: string;
  section: string
}


export interface Schedule {
  course: string;
  section: string;
  room: string;
  day: string;
  time: string;
  professor: string;
  label: string
  indicator: string
}
