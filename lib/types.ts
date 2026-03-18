export interface CVData {
  raw: string;
  fileName?: string;
  parsed?: ParsedCV;
}

export interface ParsedCV {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  stateOfOrigin?: string;
  nyscStatus?: string;
  objective?: string;
  skills?: string[];
  experience?: WorkEntry[];
  education?: EduEntry[];
  certifications?: string[];
  projects?: ProjectEntry[];
  referees?: string;
}

export interface WorkEntry {
  title: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface EduEntry {
  degree: string;
  institution: string;
  year: string;
  note?: string;
}

export interface ProjectEntry {
  name: string;
  description: string;
  link?: string;
}

export type DocType = 'cv' | 'resume' | 'cover-letter' | 'email-templates' | 'bio-sheet';
export type DownloadFormat = 'pdf' | 'docx' | 'txt' | 'html';

export type NigerianSector =
  | 'banking'
  | 'oilandgas'
  | 'tech'
  | 'ngo'
  | 'civil-service'
  | 'fmcg'
  | 'general';

export interface GenerateDocRequest {
  cvContent: string;
  docType: DocType;
  format: DownloadFormat;
  candidateName: string;
  jobDescription?: string;
  sector?: NigerianSector;
  targetRole?: string;
  targetCompany?: string;
}

export interface EmailConfig {
  to: string;
  from: string;
  fromName: string;
  subject: string;
  body: string;
  cvContent?: string;
  smtp?: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };
}
