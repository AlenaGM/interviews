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
  result: 'Offer' | 'Reject'
}

export interface IStage {
  name: string
  date: string
  description: string
}
