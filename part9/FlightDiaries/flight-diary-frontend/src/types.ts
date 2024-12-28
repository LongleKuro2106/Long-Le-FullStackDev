export interface Diaries {
  id: string,
  date: string,
  weather: string,
  visibility: string,
  comment: string
}

export type NewDiaries = Omit<Diaries, 'id'>