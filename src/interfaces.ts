export interface IInterview {
  id: string
  company: string
  vacancyLink: string
  hrName: string
  contactTelegram?: string
  contactWhatsApp?: string
  contactPhone?: string
  createdAt: Date
  salaryFrom?: number
  salaryTo?: number
  stages?: IStage[]
  result?: 'Reject' | 'Offer'
}

export interface IStage {
  name: string
  date: null | Date
  description: string
}
