import {
  Activity,
  ClipboardCheck,
  ClipboardList,
  FileSearch,
  Globe2,
  HeartPulse,
  Microscope,
  Network,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export type Language = "en" | "es";

export const languageOptions = [
  { code: "en", label: "EN", name: "English" },
  { code: "es", label: "ES", name: "Español" },
] as const;

export const siteContent = {
  en: {
    meta: {
      skipLink: "Skip to main content",
      homeAria: "Thera Research home",
      navAria: "Primary navigation",
      mobileNavAria: "Mobile navigation",
      closeMenu: "Close menu",
      openMenu: "Open menu",
      languageAria: "Select language",
      emailMenu: "Contact by email",
      linkedIn: "LinkedIn",
    },
    navItems: [
      { label: "Company", href: "#company" },
      { label: "Services", href: "#services" },
      { label: "Workflow", href: "#workflow" },
      { label: "Monitoring", href: "#monitoring" },
      { label: "Patients", href: "#patient-registration" },
      { label: "LinkedIn", href: "#linkedin" },
      { label: "Contact", href: "#contact" },
    ],
    hero: {
      aria: "Thera Research",
      lead: "A Clinical Research Organization specialized in clinical trials management and full study support for pharmaceutical, biotechnology, generic drug, OTC/consumer healthcare, and medical device companies.",
      primaryCta: "Start a study",
      secondaryCta: "Patient recruitment",
    },
    studyPanel: {
      aria: "Clinical trial management summary",
      title: "Clinical trial management",
      footerLabel: "Study oversight",
      footerValue: "Startup through close-out",
    },
    intro: {
      eyebrow: "Our company",
      heading:
        "Clinical trial services for medical research studies in all diseases.",
      copy: "Thera Research provides flexibility in response to client outsourcing demands and assists throughout the clinical trial process, from site identification and strategic feasibility to activation, patient recruitment follow-up, site closure, and reporting.",
      imageAlt:
        "Regulatory dossier and clinical startup materials on a research desk",
    },
    services: {
      eyebrow: "Services",
      heading: "Support across the clinical trial process.",
      copy: "The service model covers site identification, feasibility, site selection, strategic partnerships, investigator qualification, activation, recruitment follow-up, and site closure.",
      deliverableLabel: "Deliverable",
      riskLabel: "Risk controlled",
    },
    capabilities: [
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
        deliverable:
          "Investigator review, qualification file, site readiness notes",
        risk: "Qualification gaps",
        icon: ShieldCheck,
      },
      {
        eyebrow: "04",
        title: "Regulatory activation and IMP import",
        copy: "Local regulatory submissions, site contracting, clinical startup, and IMP import coordination are facilitated through the study activation path.",
        deliverable:
          "Submission path, contract status, IMP import coordination",
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
    ],
    workflow: {
      eyebrow: "Workflow",
      heading: "One process from site identification to closure.",
      lead: "The operating line follows the current Thera Research service path: identification, feasibility, selection, activation, monitoring, recruitment follow-up, and site closure.",
      aria: "Study workflow checkpoints",
      steps: [
        {
          step: "Site identification",
          outcome:
            "Potential sites are identified against study needs, investigator dynamics, and local execution context.",
        },
        {
          step: "Strategic feasibility",
          outcome:
            "Feasibility is reviewed before commitments, with attention to timelines, participants, and sponsor expectations.",
        },
        {
          step: "Selection and qualification",
          outcome:
            "Site selection, strategic partnerships, and investigator qualifications are moved into a startup-ready route.",
        },
        {
          step: "Activation",
          outcome:
            "Local regulatory submissions, site contracting, clinical startup, and IMP import coordination advance the study.",
        },
        {
          step: "Monitoring and recruitment",
          outcome:
            "CRAs review data and compliance while recruitment follow-up tracks site dynamics and participant demographics.",
        },
        {
          step: "Site closure",
          outcome:
            "Site closure and reporting support keep sponsor and site teams aligned at the end of the study.",
        },
      ],
    },
    monitoring: {
      eyebrow: "Clinical trial monitoring",
      heading: "CRA oversight for data quality and site interaction.",
      copy: "Skilled and highly trained CRAs conduct on-site monitoring visits throughout the study, overseeing data collection, reviewing source documentation and case report forms, ensuring regulatory compliance, and resolving data queries requested by clients.",
      imageAlt:
        "Clinical research associate reviewing source documents and study files",
      overlayLabel: "On-site monitoring",
      overlayTitle: "CRA",
      overlayCopy:
        "Data collection, source documentation, CRFs, compliance, and query resolution.",
      signals: [
        "Oversee data collection",
        "Review source documentation and case report forms",
        "Ensure regulatory compliance",
        "Resolve data queries requested by clients",
      ],
    },
    proof: {
      eyebrow: "Positioning",
      heading: "The CRO that takes responsibility.",
      support:
        "The current Thera Research message centers on responsibility, investigator knowledge, site dynamics, quality, audits, and long-term sponsor and site relationships.",
      primaryLabel: "Primary signal",
      supportingLabel: "Supporting signal",
      points: [
        {
          title: "Ownership from startup to close-out",
          copy: "Thera Research drives sponsor and site coordination with a process aimed at reducing study timelines and enhancing study success.",
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
          copy: "Experience includes internal and external audits, regulatory authority exposure, and inspection readiness.",
          icon: Microscope,
        },
      ],
    },
    patients: {
      eyebrow: "Patient recruitment",
      heading: "Enrollment support shaped around study demographics.",
      copy: "Thera Research understands participant demographics in each therapeutic area, how to enroll efficiently, how to identify high-enrolling sites, and how best to work with them.",
      cta: "Register interest",
    },
    linkedin: {
      eyebrow: "LinkedIn updates",
      heading: "News and company activity from Thera Research.",
      copy: "Follow the official LinkedIn page for company updates, patient recruitment notices, clinical research activity, and sponsor-facing announcements.",
      followHeading: "Follow the official company page",
      followCopy:
        "The LinkedIn page is the live channel for current activity. The site keeps a curated path to the most relevant updates without depending on restricted feed access.",
      followFallback: "Follow Thera Research",
      visitPage: "Open LinkedIn page",
      highlightsAria: "LinkedIn content highlights",
      highlights: [
        {
          label: "Company news",
          title: "Clinical research updates",
          copy: "Announcements and professional activity from the Thera Research team are published through the official company page.",
          cta: "View company updates",
        },
        {
          label: "Patient recruitment",
          title: "Recruitment notices",
          copy: "Recruitment calls and study participation information can be followed from LinkedIn when new opportunities are shared.",
          cta: "Follow recruitment posts",
        },
        {
          label: "Clinical operations",
          title: "Sponsor and site perspective",
          copy: "LinkedIn adds a current channel for study execution notes, site dynamics, and clinical operations context.",
          cta: "Go to LinkedIn",
        },
      ],
    },
    patientRegistration: {
      aria: "Patient recruitment registration",
      eyebrow: "Patient recruitment",
      heading: "Registration for patients interested in clinical studies.",
      copy: "Complete these details so the Thera Research team can review your inquiry and contact you by phone or email.",
      stepsAria: "Registration information requested",
      steps: [
        {
          icon: UserRound,
          title: "Personal details",
          copy: "First name, last name, phone number, and city of residence.",
        },
        {
          icon: HeartPulse,
          title: "Clinical background",
          copy: "Cancer diagnosis status and patient-provided diagnosis details.",
        },
        {
          icon: ClipboardList,
          title: "Authorization",
          copy: "Explicit permission for the team to contact the patient.",
        },
      ],
      formAria: "Patient recruitment form",
      fields: {
        firstName: {
          label: "First name",
          error: "Enter your first name.",
        },
        lastName: {
          label: "Last name",
          error: "Enter your last name.",
        },
        phone: {
          label: "Phone",
          error: "Enter a contact phone number.",
        },
        city: {
          label: "City of residence",
          error: "Enter your city.",
        },
        diagnosed: {
          label: "Have you been diagnosed with cancer?",
          yes: "Yes",
          no: "No",
          error: "Select an answer.",
        },
        diagnosis: {
          label: "What is your cancer diagnosis?",
          error: "Enter the diagnosis provided to you.",
        },
        consent: {
          label:
            "I authorize Thera Research to contact me and send information by email or phone.",
          error: "You must authorize contact to submit the registration.",
        },
      },
      status: {
        loadingLabel: "Submitting registration",
        empty: "Required fields must be completed before submitting.",
        error: "Complete the required information.",
        success:
          "Registration submitted. The Thera Research team will be able to review your information.",
      },
      submit: "Submit registration",
      iframeTitle: "Patient recruitment submission",
    },
    operatingSignals: [
      { label: "Operating model", value: "Local site coordination" },
      {
        label: "Sponsor sectors",
        value: "Pharma, biotech, generics, OTC, devices",
      },
      { label: "Study scope", value: "Planning, running, reporting" },
      { label: "Regulatory line", value: "Submissions and startup" },
    ],
    contact: {
      eyebrow: "Contact",
      heading: "Start your next clinical study with Thera Research.",
      copy: "Contact a team built to drive sponsor and site coordination, with the goal of reduced study timelines and enhanced study success.",
    },
    contactForm: {
      aria: "Clinical study contact request",
      fields: {
        name: {
          label: "Name",
          placeholder: "Sponsor or study lead",
          hint: "Used only to identify the contact request.",
          error: "Enter your name.",
        },
        email: {
          label: "Email",
          placeholder: "name@company.com",
          hint: "Corporate contact recommended.",
          error: "Enter a valid email address.",
        },
        message: {
          label: "Study context",
          placeholder:
            "Therapeutic area, sites, timeline, or recruitment needs",
          hint: "Include the minimum useful scope for feasibility review.",
          error: "Add the study context.",
        },
      },
      status: {
        loadingLabel: "Preparing contact request",
        empty:
          "Complete the fields to prepare a clinical study contact request.",
        error: "All fields are required to prepare the request.",
        success:
          "Contact request prepared. Connect this form to CRM or email next.",
      },
      submit: "Prepare request",
    },
    footer: {
      copy: "Clinical Research Organization supporting planning, execution, reporting, monitoring, regulatory coordination, and patient recruitment.",
      label: "Clinical research organization",
    },
  },
  es: {
    meta: {
      skipLink: "Saltar al contenido principal",
      homeAria: "Inicio de Thera Research",
      navAria: "Navegación principal",
      mobileNavAria: "Navegación móvil",
      closeMenu: "Cerrar menú",
      openMenu: "Abrir menú",
      languageAria: "Seleccionar idioma",
      emailMenu: "Contactar por correo",
      linkedIn: "LinkedIn",
    },
    navItems: [
      { label: "Empresa", href: "#company" },
      { label: "Servicios", href: "#services" },
      { label: "Flujo", href: "#workflow" },
      { label: "Monitoreo", href: "#monitoring" },
      { label: "Pacientes", href: "#patient-registration" },
      { label: "LinkedIn", href: "#linkedin" },
      { label: "Contacto", href: "#contact" },
    ],
    hero: {
      aria: "Thera Research",
      lead: "Una organización de investigación clínica (CRO) especializada en la gestión de estudios clínicos y soporte integral para compañías farmacéuticas, biotecnológicas, de medicamentos genéricos, productos OTC/salud de consumo y dispositivos médicos.",
      primaryCta: "Iniciar un estudio",
      secondaryCta: "Reclutamiento de pacientes",
    },
    studyPanel: {
      aria: "Resumen de gestión de estudios clínicos",
      title: "Gestión de estudios clínicos",
      footerLabel: "Supervisión del estudio",
      footerValue: "Desde puesta en marcha hasta cierre",
    },
    intro: {
      eyebrow: "Nuestra empresa",
      heading:
        "Servicios de estudios clínicos para investigación médica en todas las enfermedades.",
      copy: "Thera Research ofrece flexibilidad frente a las necesidades de outsourcing de sus clientes y acompaña todo el proceso del estudio clínico, desde la identificación de centros y la factibilidad estratégica hasta la activación, el seguimiento del reclutamiento de pacientes, el cierre de centros y los informes.",
      imageAlt:
        "Dossier regulatorio y materiales de puesta en marcha clínica sobre una mesa de investigación",
    },
    services: {
      eyebrow: "Servicios",
      heading: "Soporte a lo largo del proceso del estudio clínico.",
      copy: "El modelo de servicio cubre identificación de centros, factibilidad, selección de centros, alianzas estratégicas, calificación de investigadores, activación, seguimiento del reclutamiento y cierre de centros.",
      deliverableLabel: "Entregable",
      riskLabel: "Riesgo controlado",
    },
    capabilities: [
      {
        eyebrow: "01",
        title: "Identificación de centros y factibilidad",
        copy: "Las opciones de país y centros se evalúan antes de asumir compromisos, incluyendo factibilidad estratégica para el área terapéutica y el perfil del estudio.",
        deliverable:
          "Mapa de centros, ruta de factibilidad, notas de viabilidad",
        risk: "Bajo ajuste del centro",
        icon: FileSearch,
      },
      {
        eyebrow: "02",
        title: "Selección de centros y alianzas",
        copy: "La selección de centros, las alianzas estratégicas y la dinámica con investigadores se coordinan para apoyar una ejecución de alto desempeño.",
        deliverable:
          "Lista de centros, ruta de alianzas, insumos de puesta en marcha",
        risk: "Centros con bajo enrolamiento",
        icon: Network,
      },
      {
        eyebrow: "03",
        title: "Calificación de investigadores",
        copy: "La calificación de investigadores se apoya como parte de la puesta en marcha, ayudando a los patrocinadores a trabajar con centros alineados al protocolo y a las exigencias del estudio.",
        deliverable:
          "Revisión de investigador, archivo de calificación, notas de preparación",
        risk: "Brechas de calificación",
        icon: ShieldCheck,
      },
      {
        eyebrow: "04",
        title:
          "Activación regulatoria e importación de producto investigacional",
        copy: "Las presentaciones regulatorias locales, los contratos con centros, la puesta en marcha clínica y la coordinación de importación de producto investigacional se facilitan dentro de la ruta de activación del estudio.",
        deliverable:
          "Ruta de presentación, estado contractual, coordinación de producto investigacional",
        risk: "Retraso en activación",
        icon: ClipboardCheck,
      },
      {
        eyebrow: "05",
        title: "Seguimiento del reclutamiento de pacientes",
        copy: "El seguimiento del reclutamiento se define según demografía de participantes, área terapéutica, dinámica de centros y potencial de centros de alto enrolamiento.",
        deliverable:
          "Seguimiento de reclutamiento, señal de enrolamiento, soporte al centro",
        risk: "Retraso en enrolamiento",
        icon: UsersRound,
      },
      {
        eyebrow: "06",
        title: "Cierre de centros e informes",
        copy: "El soporte de cierre e informes mantiene la continuidad después de la ejecución, alineando a patrocinadores y equipos de centros hasta el cierre.",
        deliverable:
          "Paquete de cierre, soporte de informes, notas de continuidad",
        risk: "Fricción de cierre",
        icon: Activity,
      },
    ],
    workflow: {
      eyebrow: "Flujo",
      heading: "Un proceso desde la identificación de centros hasta el cierre.",
      lead: "La operación sigue la ruta actual de servicios de Thera Research: identificación, factibilidad, selección, activación, monitoreo, seguimiento de reclutamiento y cierre de centros.",
      aria: "Hitos del flujo del estudio",
      steps: [
        {
          step: "Identificación de centros",
          outcome:
            "Los centros potenciales se identifican según las necesidades del estudio, la dinámica de investigadores y el contexto local de ejecución.",
        },
        {
          step: "Factibilidad estratégica",
          outcome:
            "La factibilidad se revisa antes de asumir compromisos, con foco en plazos, participantes y expectativas del patrocinador.",
        },
        {
          step: "Selección y calificación",
          outcome:
            "La selección de centros, las alianzas estratégicas y la calificación de investigadores avanzan hacia una ruta lista para la puesta en marcha.",
        },
        {
          step: "Activación",
          outcome:
            "Las presentaciones regulatorias locales, los contratos con centros, la puesta en marcha clínica y la coordinación de importación de producto investigacional impulsan el estudio.",
        },
        {
          step: "Monitoreo y reclutamiento",
          outcome:
            "Los CRA revisan datos y cumplimiento mientras el seguimiento del reclutamiento observa la dinámica de centros y la demografía de participantes.",
        },
        {
          step: "Cierre de centros",
          outcome:
            "El cierre de centros y el soporte de informes mantienen alineados a patrocinadores y equipos de centros al final del estudio.",
        },
      ],
    },
    monitoring: {
      eyebrow: "Monitoreo de estudios clínicos",
      heading:
        "Supervisión CRA para calidad de datos e interacción con centros.",
      copy: "CRA capacitados y con alta preparación realizan visitas de monitoreo en terreno durante el estudio, supervisando la recolección de datos, revisando documentación fuente y formularios de reporte de caso, asegurando cumplimiento regulatorio y resolviendo consultas de datos solicitadas por los clientes.",
      imageAlt:
        "Clinical research associate revisando documentación fuente y archivos del estudio",
      overlayLabel: "Monitoreo en terreno",
      overlayTitle: "CRA",
      overlayCopy:
        "Recolección de datos, documentación fuente, CRF, cumplimiento y resolución de consultas.",
      signals: [
        "Supervisión de recolección de datos",
        "Revisión de documentación fuente y formularios de reporte de caso",
        "Aseguramiento de cumplimiento regulatorio",
        "Resolución de consultas de datos solicitadas por clientes",
      ],
    },
    proof: {
      eyebrow: "Posicionamiento",
      heading: "La CRO que toma responsabilidad.",
      support:
        "El mensaje actual de Thera Research se centra en responsabilidad, conocimiento de investigadores, dinámica de centros, calidad, auditorías y relaciones de largo plazo con patrocinadores y centros.",
      primaryLabel: "Señal principal",
      supportingLabel: "Señal de apoyo",
      points: [
        {
          title: "Responsabilidad desde la puesta en marcha hasta el cierre",
          copy: "Thera Research impulsa la coordinación entre patrocinador y centro con un proceso orientado a reducir plazos y mejorar el éxito del estudio.",
          icon: ShieldCheck,
        },
        {
          title: "Investigación médica en distintas enfermedades",
          copy: "Los servicios de estudios clínicos se ofrecen para investigación médica en todas las enfermedades, con flexibilidad frente a necesidades de outsourcing.",
          icon: Activity,
        },
        {
          title: "Dinámica de centros y enrolamiento",
          copy: "El conocimiento de investigadores, dinámica de centros, demografía y centros de alto enrolamiento apoya un enrolamiento eficiente.",
          icon: Globe2,
        },
        {
          title: "Auditorías y experiencia regulatoria",
          copy: "La experiencia incluye auditorías internas y externas, exposición a autoridad regulatoria y preparación para inspecciones.",
          icon: Microscope,
        },
      ],
    },
    patients: {
      eyebrow: "Reclutamiento de pacientes",
      heading: "Soporte de enrolamiento según la demografía del estudio.",
      copy: "Thera Research entiende la demografía de participantes en cada área terapéutica, cómo enrolar con eficiencia, cómo identificar centros de alto enrolamiento y cómo trabajar mejor con ellos.",
      cta: "Registrar interés",
    },
    linkedin: {
      eyebrow: "Actualizaciones en LinkedIn",
      heading: "Noticias y actividad de Thera Research.",
      copy: "Sigue la página oficial de LinkedIn para ver novedades de la empresa, avisos de reclutamiento de pacientes, actividad de investigación clínica y anuncios para patrocinadores.",
      followHeading: "Sigue la página oficial de la empresa",
      followCopy:
        "LinkedIn es el canal activo para la actividad reciente. El sitio mantiene una ruta curada hacia las actualizaciones más relevantes sin depender de acceso restringido al feed.",
      followFallback: "Seguir a Thera Research",
      visitPage: "Abrir página de LinkedIn",
      highlightsAria: "Destacados de contenido en LinkedIn",
      highlights: [
        {
          label: "Noticias de empresa",
          title: "Actualizaciones de investigación clínica",
          copy: "Los anuncios y la actividad profesional del equipo de Thera Research se publican desde la página oficial de la empresa.",
          cta: "Ver actualizaciones",
        },
        {
          label: "Reclutamiento de pacientes",
          title: "Avisos de reclutamiento",
          copy: "Las convocatorias de reclutamiento e información sobre participación en estudios pueden seguirse desde LinkedIn cuando se publiquen nuevas oportunidades.",
          cta: "Seguir publicaciones",
        },
        {
          label: "Operación clínica",
          title: "Perspectiva para patrocinadores y centros",
          copy: "LinkedIn agrega un canal actual para notas de ejecución de estudios, dinámica de centros y contexto operativo clínico.",
          cta: "Ir a LinkedIn",
        },
      ],
    },
    patientRegistration: {
      aria: "Registro de reclutamiento de pacientes",
      eyebrow: "Reclutamiento de pacientes",
      heading: "Registro para pacientes interesados en estudios clínicos.",
      copy: "Complete estos datos para que el equipo de Thera Research pueda revisar su consulta y contactarle por teléfono o correo electrónico.",
      stepsAria: "Información solicitada para el registro",
      steps: [
        {
          icon: UserRound,
          title: "Datos personales",
          copy: "Nombre, apellidos, teléfono y ciudad de residencia.",
        },
        {
          icon: HeartPulse,
          title: "Antecedente clínico",
          copy: "Estado de diagnóstico de cáncer y detalle informado por el paciente.",
        },
        {
          icon: ClipboardList,
          title: "Autorización",
          copy: "Permiso explícito para que el equipo contacte al paciente.",
        },
      ],
      formAria: "Formulario de reclutamiento de pacientes",
      fields: {
        firstName: {
          label: "Nombre",
          error: "Ingrese su nombre.",
        },
        lastName: {
          label: "Apellidos",
          error: "Ingrese sus apellidos.",
        },
        phone: {
          label: "Teléfono",
          error: "Ingrese un teléfono de contacto.",
        },
        city: {
          label: "Ciudad donde vive",
          error: "Ingrese su ciudad.",
        },
        diagnosed: {
          label: "¿Ha sido diagnosticado de cáncer?",
          yes: "Sí",
          no: "No",
          error: "Seleccione una respuesta.",
        },
        diagnosis: {
          label: "¿Cuál es su diagnóstico de cáncer?",
          error: "Ingrese el diagnóstico informado.",
        },
        consent: {
          label:
            "Autorizo a Thera Research a contactarme y enviarme información por correo electrónico o teléfono.",
          error: "Debe autorizar el contacto para enviar el registro.",
        },
      },
      status: {
        loadingLabel: "Enviando registro",
        empty: "Complete los campos requeridos para enviar el registro.",
        error: "Complete los datos requeridos.",
        success:
          "Registro enviado. El equipo de Thera Research podrá revisar su información.",
      },
      submit: "Enviar registro",
      iframeTitle: "Envío del reclutamiento de pacientes",
    },
    operatingSignals: [
      { label: "Modelo operativo", value: "Coordinación local de centros" },
      {
        label: "Sectores patrocinadores",
        value: "Pharma, biotech, genéricos, OTC, dispositivos",
      },
      {
        label: "Alcance del estudio",
        value: "Planificación, ejecución, informes",
      },
      {
        label: "Línea regulatoria",
        value: "Presentaciones y puesta en marcha",
      },
    ],
    contact: {
      eyebrow: "Contacto",
      heading: "Inicie su próximo estudio clínico con Thera Research.",
      copy: "Contacte a un equipo preparado para impulsar la coordinación entre patrocinador y centro, con el objetivo de reducir plazos y mejorar el éxito del estudio.",
    },
    contactForm: {
      aria: "Solicitud de contacto para estudio clínico",
      fields: {
        name: {
          label: "Nombre",
          placeholder: "Patrocinador o líder del estudio",
          hint: "Se usa solo para identificar la solicitud de contacto.",
          error: "Ingrese su nombre.",
        },
        email: {
          label: "Correo electrónico",
          placeholder: "nombre@empresa.com",
          hint: "Se recomienda un correo corporativo.",
          error: "Ingrese un correo electrónico válido.",
        },
        message: {
          label: "Contexto del estudio",
          placeholder:
            "Área terapéutica, centros, plazos o necesidades de reclutamiento",
          hint: "Incluya el alcance mínimo útil para revisar factibilidad.",
          error: "Agregue el contexto del estudio.",
        },
      },
      status: {
        loadingLabel: "Preparando solicitud de contacto",
        empty: "Complete los campos para preparar la solicitud de contacto.",
        error: "Todos los campos son requeridos para preparar la solicitud.",
        success:
          "Solicitud de contacto preparada. El siguiente paso es conectar este formulario a CRM o correo.",
      },
      submit: "Preparar solicitud",
    },
    footer: {
      copy: "Organización de investigación clínica que apoya planificación, ejecución, informes, monitoreo, coordinación regulatoria y reclutamiento de pacientes.",
      label: "Organización de investigación clínica",
    },
  },
} as const;

export type SiteContent = (typeof siteContent)[Language];

export const images = {
  hero: assetPath("assets/clinical-cells.jpg"),
  lab: assetPath("assets/lab-workstation.jpg"),
  monitoring: assetPath("assets/pipette-monitoring.jpg"),
  patients: assetPath("assets/patient-recruitment.jpg"),
};

export const clinicalIntelligenceImages = {
  hero: assetPath("assets/thera-hero-clinical-operations.webp"),
  lab: assetPath("assets/thera-v5-regulatory-activation.webp"),
  monitoring: assetPath("assets/thera-v5-monitoring-cra.webp"),
  patients: assetPath("assets/thera-v5-patient-recruitment.webp"),
};
