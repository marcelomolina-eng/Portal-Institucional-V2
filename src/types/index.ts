export type MissionId = 
  | 'home' 
  | 'mision1' 
  | 'mision2' 
  | 'mision3' 
  | 'mision4' 
  | 'misionCumplida' 
  | 'admin'
  | 'gasFiles';

export interface InitiativeItem {
  id: string;
  title: string;
  referent: string;
  referentRole?: string;
  category: string;
  iconName: string;
  queHacemos: string;
  porqueLoHacemos: string;
  queValorAporta: string;
  videoDriveId?: string;
  accentColor: string;
  tags: string[];
}

export interface CalendarEvent {
  id: string;
  month: number; // 1-12
  monthName: string;
  dateStr: string;
  title: string;
  category: string;
  responsible: string;
  description: string;
  targetAudience: string;
}

export interface Authority {
  id: string;
  name: string;
  role: string;
  area: string;
  email: string;
  bio: string;
  photoUrl: string;
  phoneExt?: string;
  driveId?: string;
}

export interface OrganigramMember {
  id: string;
  name: string;
  role: string;
  photoUrl?: string;
  email?: string;
}

export interface OrganigramNode {
  id: string;
  title: string;
  subtitle?: string;
  colorTheme?: string;
  responsibles: OrganigramMember[];
  description?: string;
}

export interface OrganigramLevel {
  id: string;
  levelNumber: number;
  levelName: string;
  badge: string;
  description?: string;
  color?: string;
  nodes: OrganigramNode[];
}

export interface CommitmentRule {
  number: number;
  title: string;
  highlight: string;
  description: string;
  tips: string[];
  iconName: string;
  badge: string;
  image?: string;
  closingQuote?: string;
}

export interface DiplomaRecord {
  id: string;
  timestamp: string;
  fullName: string;
  role: string;
  email: string;
  entryDate: string;
  certificateFolio: string;
  verificationHash: string;
  status: 'Emitido' | 'Enviado por Correo' | 'Verificado';
}

export interface FeedbackRecord {
  id: string;
  timestamp: string;
  fullName: string;
  role: string;
  overallRating: number;
  clarityRating: number;
  mostUsefulSection: string;
  suggestions: string;
  wouldRecommend: boolean;
}

export interface NoticeItem {
  id: string;
  date: string;
  title: string;
  content: string;
  author: string;
  priority: 'alta' | 'media' | 'normal';
  pinned?: boolean;
}

export interface AppConfig {
  institutionName: string;
  institutionSubtitle: string;
  slogan: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentGold: string;
  welcomeMessage: string;
  missionTeaserDriveId: string;
}
