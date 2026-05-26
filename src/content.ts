import {
  Activity,
  ClipboardCheck,
  FileSearch,
  Globe2,
  Microscope,
  Network,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

export const navItems = [
  { label: "Company", href: "#company" },
  { label: "Services", href: "#services" },
  { label: "Workflow", href: "#workflow" },
  { label: "Monitoring", href: "#monitoring" },
  { label: "Patients", href: "#patients" },
  { label: "Contact", href: "#contact" },
];

export const heroMetrics = [
  { value: "I-IV", label: "Clinical trial phases" },
  { value: "MoH / ISP", label: "Regulatory agency experience" },
  { value: "Chile", label: "Clinical operations base" },
];

export const capabilities = [
  {
    eyebrow: "01",
    title: "Site identification and feasibility",
    copy: "Country and site options are assessed before commitments are made, including strategic feasibility for the therapeutic area and study profile.",
    deliverable: "Site map, feasibility route, viability notes",
    risk: "Weak site fit",
    icon: FileSearch,
  },
  {
    eyebrow: "02",
    title: "Site selection and partnerships",
    copy: "Site selection, strategic site partnerships, and investigator dynamics are coordinated to support high-performing study execution.",
    deliverable: "Selected site list, partnership route, startup inputs",
    risk: "Low enrollment sites",
    icon: Network,
  },
  {
    eyebrow: "03",
    title: "Investigator qualifications",
    copy: "Investigator qualification is supported as part of startup, helping sponsors work with sites that match protocol and study demands.",
    deliverable: "Investigator review, qualification file, site readiness notes",
    risk: "Qualification gaps",
    icon: ShieldCheck,
  },
  {
    eyebrow: "04",
    title: "Regulatory activation and IMP import",
    copy: "Local regulatory submissions, site contracting, clinical startup, and IMP import are facilitated through Technical Director interaction with ISP.",
    deliverable: "Submission path, contract status, IMP import coordination",
    risk: "Activation delay",
    icon: ClipboardCheck,
  },
  {
    eyebrow: "05",
    title: "Patient recruitment follow-up",
    copy: "Recruitment follow-up is shaped around participant demographics, therapeutic area, site dynamics, and high-enrolling site potential.",
    deliverable: "Recruitment follow-up, enrollment signal, site support",
    risk: "Enrollment delay",
    icon: UsersRound,
  },
  {
    eyebrow: "06",
    title: "Site closure and reporting",
    copy: "Study close-out and reporting support preserve continuity after execution, keeping sponsor and site teams aligned through closure.",
    deliverable: "Closure package, reporting support, continuity notes",
    risk: "Closure friction",
    icon: Activity,
  },
];

export const workflowSteps = [
  {
    step: "Site identification",
    outcome: "Potential sites are identified against study needs, investigator dynamics, and local execution context.",
  },
  {
    step: "Strategic feasibility",
    outcome: "Feasibility is reviewed before commitments, with attention to timelines, participants, and sponsor expectations.",
  },
  {
    step: "Selection and qualification",
    outcome: "Site selection, strategic partnerships, and investigator qualifications are moved into a startup-ready route.",
  },
  {
    step: "Activation",
    outcome: "Local regulatory submissions, site contracting, clinical startup, and IMP import coordination advance the study.",
  },
  {
    step: "Monitoring and recruitment",
    outcome: "CRAs review data and compliance while recruitment follow-up tracks site dynamics and participant demographics.",
  },
  {
    step: "Site closure",
    outcome: "Site closure and reporting support keep sponsor and site teams aligned at the end of the study.",
  },
];

export const proofPoints = [
  {
    title: "The CRO that takes responsibility",
    copy: "Thera Research drives and supports sponsor and site staff with a process aimed at reducing study timelines and enhancing study success.",
    icon: ShieldCheck,
  },
  {
    title: "Medical research across diseases",
    copy: "Clinical trial services are offered for medical research studies in all diseases, with flexibility around outsourcing demands.",
    icon: Activity,
  },
  {
    title: "Site dynamics and enrollment",
    copy: "Knowledge of investigators, site dynamics, demographics, and high-enrolling sites supports efficient enrollment.",
    icon: Globe2,
  },
  {
    title: "Audits and regulatory experience",
    copy: "Experience includes internal and external audits, Regulatory Authority / ISP exposure, and MoH / ISP inspection knowledge.",
    icon: Microscope,
  },
];

export const operatingSignals = [
  { label: "CRO base", value: "Chile" },
  { label: "Sponsor sectors", value: "Pharma, biotech, generics, OTC, devices" },
  { label: "Study scope", value: "Planning, running, reporting" },
  { label: "Regulatory line", value: "MoH / ISP" },
];

export const monitoringSignals = [
  "Oversee data collection",
  "Review source documentation and case report forms",
  "Ensure regulatory compliance",
  "Resolve data queries requested by clients",
];

export const images = {
  hero: "/assets/clinical-cells.jpg",
  lab: "/assets/lab-workstation.jpg",
  monitoring: "/assets/pipette-monitoring.jpg",
  patients: "/assets/patient-recruitment.jpg",
};

export const clinicalIntelligenceImages = {
  hero: "/assets/thera-hero-clinical-operations.webp",
  lab: "/assets/thera-v5-regulatory-activation.webp",
  monitoring: "/assets/thera-v5-monitoring-cra.webp",
  patients: "/assets/thera-v5-patient-recruitment.webp",
};
