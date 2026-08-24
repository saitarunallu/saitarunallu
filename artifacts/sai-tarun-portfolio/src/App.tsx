import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AlertCircle, ArrowLeft, ArrowUpRight, Check, CheckCircle2, ChevronDown, ChevronUp, Download, Eye, Github, Linkedin, LoaderCircle, Mail, MapPin, Menu, Phone, Printer, Terminal, X } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Link, Route, Switch, useLocation, useParams, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const resumePath = '/Allu_Surya_Tarun_Resume.pdf';
const githubUrl = 'https://github.com/saitarunallu';
const linkedinUrl = 'https://www.linkedin.com/in/saitarunallu/';

const navigation = [
  { id: 'top', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

const skillGroups = [
  {
    title: 'Programming',
    skills: ['Java', 'SQL'],
  },
  {
    title: 'Core Java',
    skills: ['OOP', 'Collections Framework', 'Exception Handling', 'File Handling', 'Multithreading', 'Lambda Expressions', 'Stream API', 'Generics', 'Arrays', 'Strings', 'Wrapper Classes', 'Enums', 'Interfaces', 'Abstract Classes'],
  },
  {
    title: 'Database / Backend',
    skills: ['JDBC', 'MySQL', 'SQL', 'PreparedStatement', 'CRUD Operations', 'Transactions'],
  },
  {
    title: 'Frontend',
    skills: ['HTML5', 'CSS3', 'Bootstrap', 'Responsive Web Design', 'Flexbox'],
  },
  {
    title: 'Tools',
    skills: ['Git', 'IntelliJ IDEA', 'Eclipse', 'VS Code'],
  },
  {
    title: 'Engineering Concepts',
    skills: ['Data Structures', 'Algorithms', 'Debugging', 'Input Validation', 'Clean Code', 'Modular Programming'],
  },
];

const experience = [
  {
    date: 'May 2022 — Aug 2023',
    role: 'Associate',
    company: 'Concentrix',
    description: 'Supported banking customers by resolving account-related queries in a high-volume environment. Strengthened analytical thinking, communication, and problem-solving skills while gaining exposure to banking workflows and customer operations.',
    location: 'Banking operations',
  },
  {
    date: 'Oct 2021 — May 2022',
    role: 'Certified Internet Consultant',
    company: 'Just Dial',
    description: 'Consulted businesses on digital products and technology solutions. Conducted product demonstrations and gathered customer requirements, developing strong communication and client relationship management skills.',
    location: 'Digital products',
  },
];

const projects = [
  {
    id: 'banking-management',
    number: '01',
    title: 'Banking Management System',
    description: 'A modular banking application covering the complete account lifecycle, from authentication and account creation to transactions and history.',
    tech: ['Java', 'JDBC', 'MySQL', 'OOP'],
    details: [
      'Account creation, authentication, deposits, withdrawals, fund transfers, balance enquiry, and transaction history.',
      'MySQL integration through JDBC and PreparedStatement for secure database operations.',
      'Object-Oriented Programming through modular class design.',
      'Input validation and exception handling to improve application reliability.',
      'Reusable DAO classes for organized database operations.',
    ],
    repository: 'https://github.com/saitarunallu/java-banking-management-system',
    featured: true,
  },
  {
    id: 'custom-collections',
    number: '02',
    title: 'Custom Java Collections Framework',
    description: 'Custom implementations exploring the mechanics behind familiar data structures, rather than only consuming the standard APIs.',
    tech: ['Core Java'],
    details: ['Custom ArrayList, LinkedList, HashMap, Stack, and Queue implementations.', 'Hashing, collision handling, linked node structures, and dynamic resizing.', 'Modular test classes for each implementation and a deeper understanding of collection internals.'],
    featured: true,
  },
  {
    id: 'student-management',
    number: '03',
    title: 'Student Management System',
    description: 'A CRUD application for registration, search, update, and deletion of student records.',
    tech: ['Java', 'JDBC', 'MySQL'],
    details: ['Student registration, search, update, and deletion functionalities.', 'MySQL integration using JDBC for persistent data storage.', 'Modular programming and validation for efficient record management.'],
  },
  {
    id: 'library-management',
    number: '04',
    title: 'Library Management System',
    description: 'Book and member management with issue, return, search, and fine calculation features.',
    tech: ['Java', 'JDBC', 'MySQL'],
    details: ['Book issue, return, search, and fine calculation features.', 'MySQL-backed book and member records through JDBC.', 'Object-oriented design for maintainable code.'],
  },
  {
    id: 'employee-management',
    number: '05',
    title: 'Employee Management System',
    description: 'A layered employee management application with CRUD operations and department workflows.',
    tech: ['Java', 'JDBC', 'MySQL'],
    details: ['Employee search, department management, salary updates, and validation.', 'Layered architecture with JDBC and MySQL for persistent data management.'],
  },
  {
    id: 'expense-tracker',
    number: '06',
    title: 'Expense Tracker',
    description: 'An in-memory expense tracker that turns daily entries into monthly and category-wise reports.',
    tech: ['Java', 'Collections Framework', 'Stream API', 'Lambda Expressions'],
    details: ['Daily expense recording with monthly and category-wise reports.', 'Java Streams and Lambda Expressions for filtering and data processing.', 'Collections Framework for efficient in-memory data management.'],
  },
];

const education = [
  { years: '2024 — 2026', degree: 'Master of Computer Applications (MCA)', school: 'Andhra University', score: 'CGPA: 9.10 / 10' },
  { years: '2018 — 2023', degree: 'Bachelor of Science (MECS)', school: 'Aditya Degree College', score: 'CGPA: 7.13 / 10' },
];

const certifications = [
  'Java Programming Masterclass — Udemy',
  'Java Programming — SoloLearn',
  'Build Your Own Static Website — NxtWave Intensive (HTML5, CSS3, Bootstrap)',
  'Build Your Own Responsive Website — NxtWave Intensive (Bootstrap, Flexbox)',
];

const achievements = [
  'First Prize — College Science Day PPT Competition',
  'Second Prize — State-Level Electronics Project Competition',
  'Participant — National Service Scheme (NSS) Camp',
];

function Header({ activeSection }: { activeSection: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="nav-shell">
         <a href="#top" className="wordmark" onClick={closeMenu} data-testid="link-home">
          <span className="wordmark-mark">ST</span>
          <span className="wordmark-text">Sai Tarun Allu / Java Engineer</span>
        </a>
        <button
          className="menu-toggle"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          data-testid="button-menu-toggle"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Primary navigation">
           {navigation.map((item) => (
            <a
              href={`#${item.id}`}
              className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              aria-current={activeSection === item.id ? 'page' : undefined}
              onClick={closeMenu}
              key={item.id}
              data-testid={`link-nav-${item.id}`}
            >
              {item.label}
            </a>
          ))}
           <Link href="/resume" className="nav-resume" onClick={closeMenu} data-testid="link-nav-resume">Resume</Link>
        </nav>
      </div>
    </header>
  );
}

function CodeWorkbench() {
  return (
    <div className="hero-visual" aria-label="A Java code workbench illustration">
      <div className="code-panel">
        <div className="code-top" aria-hidden="true">
          <span className="code-dot" />
          <span className="code-dot" />
          <span className="code-dot" />
        </div>
        <span className="code-line code-comment">// building useful things</span>
        <span className="code-line"><span className="code-key">class</span> Engineer {'{'}</span>
        <span className="code-line">&nbsp;&nbsp;<span className="code-key">String</span> focus = <span className="code-string">"Java"</span>;</span>
        <span className="code-line">&nbsp;&nbsp;<span className="code-key">boolean</span> learning = <span className="code-key">true</span>;</span>
        <span className="code-line">&nbsp;</span>
        <span className="code-line">&nbsp;&nbsp;<span className="code-key">void</span> solve(<span className="code-key">Problem</span> problem) {'{'}</span>
        <span className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;cleanCode.<span className="code-key">apply</span>(problem);</span>
        <span className="code-line">&nbsp;&nbsp;{'}'}</span>
        <span className="code-line">{'}'}</span>
         <span className="code-line cursor-line">&gt; <span className="code-string">ship_with_care</span><span className="cursor" /></span>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: typeof projects[number] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article className={`project-card ${project.featured ? 'featured' : ''}`} data-testid={`card-project-${project.id}`}>
      <span className="project-index">{project.number} / PROJECT</span>
       <h3><Link className="project-title-link" href={`/projects/${project.id}`}>{project.title}</Link></h3>
      <p>{project.description}</p>
      <div className="project-tech" aria-label={`${project.title} technologies`}>
        {project.tech.map((technology) => <span key={technology}>{technology}</span>)}
      </div>
      <button
        className="project-toggle"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        data-testid={`button-project-details-${project.id}`}
      >
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
         {expanded ? 'Hide details' : 'View Details'}
      </button>
      {expanded && (
        <div className="project-details">
          <ul>
            {project.details.map((detail) => <li key={detail}>{detail}</li>)}
          </ul>
        </div>
      )}
       {project.repository && (
         <a className="project-repository" href={project.repository} target="_blank" rel="noreferrer">
           <Github size={14} /> View source on GitHub <ArrowUpRight size={13} />
         </a>
       )}
    </article>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [messageLength, setMessageLength] = useState(0);
  const [formValues, setFormValues] = useState({ name: '', email: '', message: '' });
  const [touched, setTouched] = useState({ name: false, email: false, message: false });
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const getFieldError = (field: 'name' | 'email' | 'message', value: string) => {
    if (!value.trim()) return field === 'message' ? 'Add a message so I know how to help.' : 'This field is required.';
    if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address.';
    return '';
  };

  const updateField = (field: 'name' | 'email' | 'message', value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
    if (field === 'message') setMessageLength(value.length);
    if (status === 'success') setStatus('idle');
  };

  const showFieldError = (field: 'name' | 'email' | 'message') => Boolean((touched[field] || hasSubmitted) && getFieldError(field, formValues[field]));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get('name') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const message = String(form.get('message') ?? '').trim();
    const website = String(form.get('website') ?? '').trim();
    setHasSubmitted(true);
    setTouched({ name: true, email: true, message: true });
    if (getFieldError('name', name) || getFieldError('email', email) || getFieldError('message', message)) {
      setStatus('idle');
      setErrorMessage('');
      return;
    }
    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, website }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'The message could not be sent right now.');
      formElement.reset();
      setFormValues({ name: '', email: '', message: '' });
      setMessageLength(0);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'The message could not be sent right now.');
    }
  };

  return (
    <div className="contact-form-shell">
      <div className="contact-form-heading">
        <div className="contact-form-title-row">
          <span>Send a note</span>
          <span className="contact-form-time"><span className="contact-status-dot" /> Usually replies within 1–2 days</span>
        </div>
        <p>Have a role, product, or Java project in mind? A few details are enough to start a useful conversation.</p>
      </div>
      <form className="contact-form" onSubmit={handleSubmit} aria-label="Contact form" noValidate>
        <div className="contact-form-row">
          <label className={showFieldError('name') ? 'has-error' : ''} htmlFor="contact-name">
            <span>Your name <b aria-hidden="true">*</b></span>
            <input
              id="contact-name"
              name="name"
              type="text"
              placeholder="How should I address you?"
              autoComplete="name"
              value={formValues.name}
              onChange={(event) => updateField('name', event.target.value)}
              onBlur={() => setTouched((current) => ({ ...current, name: true }))}
              aria-invalid={showFieldError('name')}
              aria-describedby={showFieldError('name') ? 'contact-name-error' : undefined}
              required
              data-testid="input-contact-name"
            />
            {showFieldError('name') && <span className="contact-field-error" id="contact-name-error"><AlertCircle size={13} /> {getFieldError('name', formValues.name)}</span>}
          </label>
          <label className={showFieldError('email') ? 'has-error' : ''} htmlFor="contact-email">
            <span>Email address <b aria-hidden="true">*</b></span>
            <input
              id="contact-email"
              name="email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              value={formValues.email}
              onChange={(event) => updateField('email', event.target.value)}
              onBlur={() => setTouched((current) => ({ ...current, email: true }))}
              aria-invalid={showFieldError('email')}
              aria-describedby={showFieldError('email') ? 'contact-email-error' : undefined}
              required
              data-testid="input-contact-email"
            />
            {showFieldError('email') && <span className="contact-field-error" id="contact-email-error"><AlertCircle size={13} /> {getFieldError('email', formValues.email)}</span>}
          </label>
        </div>
        <label className={showFieldError('message') ? 'has-error' : ''} htmlFor="contact-message">
          <span>What can I help with? <b aria-hidden="true">*</b></span>
          <textarea
            id="contact-message"
            name="message"
            placeholder="Tell me about the opportunity, product, or problem you’re solving."
            rows={5}
            maxLength={5000}
            value={formValues.message}
            onChange={(event) => updateField('message', event.target.value)}
            onBlur={() => setTouched((current) => ({ ...current, message: true }))}
            aria-invalid={showFieldError('message')}
            aria-describedby={showFieldError('message') ? 'contact-message-error contact-message-count' : 'contact-message-count'}
            required
            data-testid="input-contact-message"
          />
          <span className="contact-message-meta">
            {showFieldError('message') ? <span className="contact-field-error" id="contact-message-error"><AlertCircle size={13} /> {getFieldError('message', formValues.message)}</span> : <span className="contact-field-hint">No pitch deck needed — context is enough.</span>}
            <small className="contact-character-count" id="contact-message-count">{messageLength} / 5000</small>
          </span>
        </label>
        <label className="contact-honeypot" aria-hidden="true">
          <span>Website</span>
          <input name="website" type="text" tabIndex={-1} autoComplete="off" data-testid="input-contact-website" />
        </label>
        <div className="contact-form-footer">
          <button className={`contact-submit contact-submit-${status}`} type="submit" disabled={status === 'sending'} data-testid="button-contact-submit">
            {status === 'sending' ? <LoaderCircle className="contact-submit-icon contact-submit-spin" size={15} /> : status === 'success' ? <Check size={15} /> : status === 'error' ? <Mail size={15} /> : <Mail size={15} />}
            <span>{status === 'sending' ? 'Sending message' : status === 'success' ? 'Message sent' : status === 'error' ? 'Try again' : 'Send message'}</span>
            {status !== 'sending' && status !== 'success' && <ArrowUpRight size={14} />}
          </button>
          <div className={`contact-form-note contact-form-status-${status}`} role={status === 'error' || status === 'success' ? 'status' : undefined} aria-live="polite" data-testid="status-contact-form">
            {status === 'success' ? <><CheckCircle2 size={15} /> <span>Thanks — your note is on its way. I’ll reply by email.</span></> : status === 'error' ? <><AlertCircle size={15} /> <span>{errorMessage}</span></> : <><span className="contact-note-mark">↳</span> <span>Your message goes directly to Sai Tarun.</span></>}
          </div>
        </div>
      </form>
    </div>
  );
}

const publicSections = {
  about: {
    label: 'About',
    title: 'About Sai Tarun Allu',
    description: 'Meet Sai Tarun Allu, a Java Software Engineer from Tuni, Andhra Pradesh, focused on practical backend development.',
    paragraphs: [
      'Allu Surya Naga Sai Tarun is a Java Software Engineer with a strong foundation in Core Java, Object-Oriented Programming, JDBC, MySQL, SQL, and backend application development.',
      'His approach is grounded in understanding what happens underneath abstractions and building clear, maintainable software around data, business rules, and reliable fundamentals.',
    ],
  },
  skills: {
    label: 'Skills',
    title: 'Java Software Engineering Skills',
    description: 'Core Java, JDBC, MySQL, SQL, backend development, data structures, and software engineering skills.',
    paragraphs: ['A growing technical toolkit grounded in fundamentals, clean code, validation, modular programming, and hands-on project development.'],
  },
  experience: {
    label: 'Experience',
    title: 'Professional Experience',
    description: 'Professional experience in banking operations, customer support, digital products, and client consulting.',
    paragraphs: ['Experience at Concentrix and Just Dial strengthened analytical thinking, communication, customer understanding, and problem-solving in practical environments.'],
  },
  education: {
    label: 'Education',
    title: 'Education and Certifications',
    description: 'Academic background, certifications, and achievements of Java Software Engineer Sai Tarun Allu.',
    paragraphs: ['Formal learning gives the work its structure, while hands-on projects give that structure a reason to hold.'],
  },
  contact: {
    label: 'Contact',
    title: 'Contact Sai Tarun Allu',
    description: 'Contact Sai Tarun Allu about Java software engineering, backend development, and practical application projects.',
    paragraphs: ['For Java development opportunities, backend projects, or professional conversations, connect by email, phone, GitHub, or LinkedIn.'],
  },
} as const;

function usePageMeta(title: string, description: string, path: string) {
  useEffect(() => {
    const fullTitle = `${title} | Sai Tarun Allu`;
    const url = `https://saitarunallu.com${path}`;
    const selectors = {
      description: 'meta[name="description"]',
      canonical: 'link[rel="canonical"]',
      ogTitle: 'meta[property="og:title"]',
      ogDescription: 'meta[property="og:description"]',
      ogUrl: 'meta[property="og:url"]',
      twitterTitle: 'meta[name="twitter:title"]',
      twitterDescription: 'meta[name="twitter:description"]',
      twitterUrl: 'meta[name="twitter:url"]',
    };
    const elements = Object.fromEntries(Object.entries(selectors).map(([key, selector]) => [key, document.querySelector(selector)])) as Record<keyof typeof selectors, Element | null>;
    const previousTitle = document.title;
    const previous = Object.fromEntries(Object.entries(elements).map(([key, element]) => [key, element?.getAttribute('content') ?? element?.getAttribute('href') ?? '']));
    document.title = fullTitle;
    elements.description?.setAttribute('content', description);
    elements.canonical?.setAttribute('href', url);
    elements.ogTitle?.setAttribute('content', fullTitle);
    elements.ogDescription?.setAttribute('content', description);
    elements.ogUrl?.setAttribute('content', url);
    elements.twitterTitle?.setAttribute('content', fullTitle);
    elements.twitterDescription?.setAttribute('content', description);
    elements.twitterUrl?.setAttribute('content', url);
    return () => {
      document.title = previousTitle;
      Object.entries(elements).forEach(([key, element]) => {
        if (element) element.setAttribute(key === 'canonical' ? 'href' : 'content', previous[key] ?? '');
      });
    };
  }, [title, description, path]);
}

function SectionPage() {
  const { section } = useParams<{ section: string }>();
  const content = section ? publicSections[section as keyof typeof publicSections] : undefined;
  usePageMeta(content?.title ?? 'Portfolio', content?.description ?? 'Sai Tarun Allu Java Software Engineer portfolio.', `/${section ?? ''}`);
  if (!content) return <NotFound />;

  return (
    <main className="seo-page resume-page">
      <div className="seo-page-toolbar"><Link href="/" className="resume-back"><ArrowLeft size={15} /> Portfolio</Link><Link href="/resume" className="button-primary">View Resume</Link></div>
      <article className="seo-page-sheet resume-sheet">
        <p className="section-kicker">Public profile / {content.label}</p>
        <h1>{content.title}</h1>
        <p className="seo-lede">{content.description}</p>
        {content.paragraphs.map((paragraph) => <p className="seo-copy" key={paragraph}>{paragraph}</p>)}
        {section === 'skills' && <div className="seo-list">{skillGroups.map((group) => <section key={group.title}><h2>{group.title}</h2><p>{group.skills.join(' · ')}</p></section>)}</div>}
        {section === 'experience' && <div className="seo-list">{experience.map((item) => <section key={item.company}><h2>{item.role} — {item.company}</h2><p>{item.date} · {item.location}</p><p>{item.description}</p></section>)}</div>}
        {section === 'education' && <div className="seo-list">{education.map((item) => <section key={item.degree}><h2>{item.degree}</h2><p>{item.school} · {item.years} · {item.score}</p></section>)}<section><h2>Certifications</h2><p>{certifications.join(' · ')}</p></section><section><h2>Achievements</h2><p>{achievements.join(' · ')}</p></section></div>}
         {section === 'contact' && <><div className="seo-links"><a href="mailto:saitarun1932@gmail.com">saitarun1932@gmail.com</a><a href="tel:+919676561932">+91 96765 61932</a><a href={githubUrl}>GitHub</a><a href={linkedinUrl}>LinkedIn</a></div><ContactForm /></>}
        <nav className="seo-related-links" aria-label="Related portfolio pages">
          <Link href="/projects">Explore projects</Link><Link href="/about">About</Link><Link href="/skills">Skills</Link><Link href="/experience">Experience</Link><Link href="/education">Education</Link><Link href="/contact">Contact</Link>
        </nav>
      </article>
    </main>
  );
}

function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((item) => item.id === id);
  usePageMeta(project?.title ?? 'Project', project?.description ?? 'Java software project by Sai Tarun Allu.', `/projects/${id ?? ''}`);
  if (!project) return <NotFound />;
  return (
    <main className="seo-page resume-page">
      <div className="seo-page-toolbar"><Link href="/projects" className="resume-back"><ArrowLeft size={15} /> All projects</Link><Link href="/resume" className="button-primary">View Resume</Link></div>
      <article className="seo-page-sheet resume-sheet">
        <p className="section-kicker">Project {project.number}</p>
        <h1>{project.title}</h1>
        <p className="seo-lede">{project.description}</p>
        <p className="seo-tech">{project.tech.join(' · ')}</p>
         {project.repository && <a className="project-repository project-repository-detail" href={project.repository} target="_blank" rel="noreferrer"><Github size={14} /> View source on GitHub <ArrowUpRight size={13} /></a>}
        <section className="seo-list"><h2>Project details</h2><ul>{project.details.map((detail) => <li key={detail}>{detail}</li>)}</ul></section>
        <nav className="seo-related-links" aria-label="Related portfolio pages"><Link href="/projects">All projects</Link><Link href="/skills">Technical skills</Link><Link href="/experience">Experience</Link><Link href="/resume">Full resume</Link></nav>
      </article>
    </main>
  );
}

function ProjectsPage() {
  usePageMeta('Java Projects', 'Java, JDBC, MySQL, collections, and backend application projects by Sai Tarun Allu.', '/projects');
  return (
    <main className="seo-page resume-page">
      <div className="seo-page-toolbar"><Link href="/" className="resume-back"><ArrowLeft size={15} /> Portfolio</Link><Link href="/resume" className="button-primary">View Resume</Link></div>
      <article className="seo-page-sheet resume-sheet"><p className="section-kicker">Selected work</p><h1>Java Software Projects</h1><p className="seo-lede">Practical Java projects covering banking systems, custom collections, CRUD workflows, JDBC, MySQL, and data processing.</p><div className="seo-project-list">{projects.map((project) => <section key={project.id}><h2><Link href={`/projects/${project.id}`}>{project.title}</Link></h2><p>{project.description}</p><p className="seo-tech">{project.tech.join(' · ')}</p><Link href={`/projects/${project.id}`}>Read project details <ArrowUpRight size={14} /></Link></section>)}</div></article>
    </main>
  );
}

function Home() {
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    const sections = navigation.map(({ id }) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: '-25% 0px -58% 0px', threshold: [0, .2, .5, 1] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="portfolio-page" id="top">
      <Header activeSection={activeSection} />
      <section className="hero" aria-labelledby="hero-title">
        <div>
           <div className="eyebrow reveal">Tuni, Andhra Pradesh, India</div>
           <p className="hero-name reveal">ALLU SURYA NAGA SAI TARUN</p>
           <h1 id="hero-title" className="reveal reveal-delay-1">Java Software <em>Engineer.</em></h1>
           <p className="hero-stack reveal reveal-delay-1">Core Java · OOP · JDBC · MySQL · Backend Development</p>
           <p className="hero-lede reveal reveal-delay-2">Java-focused engineer with an MCA foundation and hands-on practice building clear, modular applications around data, business rules, and the fundamentals underneath.</p>
          <div className="hero-actions reveal reveal-delay-2">
             <Link href="/resume" className="button-primary" data-testid="link-hero-resume"><Eye size={15} /> View Online Resume</Link>
             <a href={resumePath} download="Allu_Surya_Naga_Sai_Tarun_Resume.pdf" className="button-outline" data-testid="link-download-resume"><Download size={15} /> Download Resume PDF</a>
          </div>
           <div className="hero-socials reveal reveal-delay-2" aria-label="Professional profiles">
             <a href={githubUrl} target="_blank" rel="noreferrer" data-testid="link-hero-github"><Github size={15} /> GitHub <ArrowUpRight size={13} /></a>
             <a href={linkedinUrl} target="_blank" rel="noreferrer" data-testid="link-hero-linkedin"><Linkedin size={15} /> LinkedIn <ArrowUpRight size={13} /></a>
           </div>
        </div>
        <CodeWorkbench />
      </section>

      <section className="about-band" id="about" aria-labelledby="about-title">
        <div className="section">
         <div className="section-heading">
            <div>
              <div className="section-kicker">01 / Working profile</div>
              <h2 id="about-title">A practical<br />point of view.</h2>
            </div>
            <p>Built from customer operations, formal study, and a lot of deliberate practice in Java.</p>
          </div>
          <div className="about-grid">
            <p className="about-copy">Good software earns trust one understandable decision at a time.</p>
            <div>
              <p className="about-detail">Motivated Java Developer with a Master of Computer Applications from Andhra University. Strong foundation in Core Java, JDBC, MySQL, SQL, Object-Oriented Programming, Multithreading, and backend application development.</p>
              <p className="about-detail">Passionate about building scalable, maintainable software using clean coding practices and continuously enhancing technical skills through hands-on project development.</p>
              <div className="micro-facts">
                <div className="micro-fact" data-testid="text-location"><strong>Tuni, AP</strong><span>Based in India</span></div>
                <div className="micro-fact" data-testid="text-degree"><strong>MCA</strong><span>Andhra University · 2024–2026</span></div>
                <div className="micro-fact" data-testid="text-focus"><strong>Java + JDBC</strong><span>Backend application development</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="skills" aria-labelledby="skills-title">
        <div className="section-heading">
          <div>
            <div className="section-kicker">03 / Technical toolkit</div>
            <h2 id="skills-title">Tools for the<br />next useful layer.</h2>
          </div>
        </div>
        <div className="skills-layout">
          <p className="skills-intro">A growing toolkit, grounded in fundamentals. I care about understanding what happens underneath the abstraction.</p>
          <div className="skill-groups">
            {skillGroups.map((group) => (
              <div className="skill-group" key={group.title} data-testid={`group-skill-${group.title.toLowerCase().replaceAll(' ', '-')}`}>
                <h3>{group.title}</h3>
                <div className="skill-list">
                  {group.skills.map((skill) => <span className="skill-chip" key={skill}>{skill}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="experience-section" id="experience" aria-labelledby="experience-title">
        <div className="section">
          <div className="section-heading">
            <div>
              <div className="section-kicker">04 / Experience</div>
              <h2 id="experience-title">People problems<br />are engineering practice.</h2>
            </div>
            <p>Two roles that sharpened how I listen, investigate, and communicate clearly.</p>
          </div>
          <div className="timeline">
            {experience.map((item) => (
              <article className="timeline-row" key={item.company} data-testid={`row-experience-${item.company.toLowerCase().replaceAll(' ', '-')}`}>
                <div className="timeline-date">{item.date}</div>
                <div>
                  <h3 className="timeline-role">{item.role}</h3>
                  <div className="timeline-company">{item.company}</div>
                  <p className="timeline-description">{item.description}</p>
                </div>
                <div className="timeline-location">{item.location}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="projects" aria-labelledby="projects-title">
        <div className="section-heading">
          <div>
            <div className="section-kicker">02 / Selected work</div>
            <h2 id="projects-title">Small systems.<br />Serious fundamentals.</h2>
          </div>
          <p>Hands-on projects spanning persistent data, business rules, and the internals of collections.</p>
        </div>
        <div className="project-grid">
             <div className="project-group project-group-featured">
               <div className="project-group-label">Featured Projects <span>01 — 02</span></div>
               <div className="featured-project-grid">
                 {projects.filter((project) => project.featured).map((project) => <ProjectCard project={project} key={project.id} />)}
               </div>
             </div>
             <div className="project-group project-group-additional">
               <div className="project-group-label">Additional Projects <span>03 — 06</span></div>
               <div className="additional-project-grid">
                 {projects.filter((project) => !project.featured).map((project) => <ProjectCard project={project} key={project.id} />)}
               </div>
             </div>
        </div>
      </section>

       <section className="education-band" id="education" aria-labelledby="education-title">
        <div className="section">
          <div className="section-heading">
            <div>
              <div className="section-kicker">05 / Learning record</div>
              <h2 id="education-title">Study, then<br />stress-test it.</h2>
            </div>
          </div>
          <div className="education-layout">
            <p className="education-copy">Formal learning gives the work its structure. Projects give the structure a reason to hold.</p>
            <div>
              <div className="education-list">
                {education.map((item) => (
                  <div className="education-row" key={item.degree} data-testid={`row-education-${item.years}`}>
                    <div className="education-year">{item.years}</div>
                    <div><h3>{item.degree}</h3><p>{item.school}</p></div>
                    <div className="education-score">{item.score}</div>
                  </div>
                ))}
              </div>
              <div className="certifications">
                <h3>Certifications</h3>
                <ul className="cert-list">
                  {certifications.map((certification) => <li key={certification}>{certification}</li>)}
                </ul>
              </div>
              <div className="certifications">
                <h3>Achievements</h3>
                <ul className="cert-list">
                  {achievements.map((achievement) => <li key={achievement}>{achievement}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

       <section className="resume-cta-band" id="resume" aria-labelledby="resume-cta-title">
         <div className="section resume-cta-inner">
           <div>
             <div className="section-kicker">06 / Resume</div>
             <h2 id="resume-cta-title">The full record,<br /><em>ready to read.</em></h2>
           </div>
           <div className="resume-cta-copy">
             <p>A responsive HTML resume for a quick scan, with a print-friendly layout and the original PDF available when you need it.</p>
             <div className="resume-cta-actions">
               <Link href="/resume" className="button-primary" data-testid="link-home-online-resume"><Eye size={15} /> View Online Resume</Link>
               <a href={resumePath} download="Allu_Surya_Naga_Sai_Tarun_Resume.pdf" className="button-outline" data-testid="link-home-download-resume"><Download size={15} /> Download PDF</a>
             </div>
           </div>
         </div>
       </section>

      <section className="section contact-section" id="contact" aria-labelledby="contact-title">
        <div className="contact-panel">
          <div>
            <div className="section-kicker">A clear next step</div>
            <h2 id="contact-title">Let’s talk about<br />the work.</h2>
          </div>
          <div className="contact-links">
            <a className="contact-link" href="mailto:saitarun1932@gmail.com" data-testid="link-email"><Mail size={15} /> saitarun1932@gmail.com <ArrowUpRight size={14} /></a>
            <a className="contact-link" href="tel:+919676561932" data-testid="link-phone"><Phone size={15} /> +91-9676561932 <ArrowUpRight size={14} /></a>
             <Link className="contact-link" href="/resume" data-testid="link-contact-resume"><Terminal size={15} /> View online resume <ArrowUpRight size={14} /></Link>
             <a className="contact-link" href={githubUrl} target="_blank" rel="noreferrer" data-testid="link-contact-github"><Github size={15} /> GitHub <ArrowUpRight size={14} /></a>
             <a className="contact-link" href={linkedinUrl} target="_blank" rel="noreferrer" data-testid="link-contact-linkedin"><Linkedin size={15} /> LinkedIn <ArrowUpRight size={14} /></a>
          </div>
           <ContactForm />
        </div>
      </section>

      <footer className="footer">
        <span data-testid="text-footer-name">ALLU SURYA NAGA SAI TARUN</span>
         <span><MapPin size={12} style={{ verticalAlign: 'middle', marginRight: 5 }} />Tuni, Andhra Pradesh, India · Java Software Engineer</span>
         <span className="footer-links"><a href={githubUrl} target="_blank" rel="noreferrer" data-testid="link-footer-github">GitHub</a><a href={linkedinUrl} target="_blank" rel="noreferrer" data-testid="link-footer-linkedin">LinkedIn</a></span>
      </footer>
    </main>
  );
}

function Resume() {
  useEffect(() => {
    const title = 'Resume — Sai Tarun Allu | Java Software Engineer';
    const descriptionContent = 'Online resume for Allu Surya Naga Sai Tarun, a Java Software Engineer focused on Core Java, OOP, JDBC, MySQL, backend development, and software projects.';
    const url = 'https://saitarunallu.com/resume';
    document.title = title;
    const description = document.querySelector('meta[name="description"]');
    const canonical = document.querySelector('link[rel="canonical"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    const previous = {
      description: description?.getAttribute('content') ?? '',
      canonical: canonical?.getAttribute('href') ?? '',
      ogTitle: ogTitle?.getAttribute('content') ?? '',
      ogDescription: ogDescription?.getAttribute('content') ?? '',
      ogUrl: ogUrl?.getAttribute('content') ?? '',
      twitterTitle: twitterTitle?.getAttribute('content') ?? '',
      twitterDescription: twitterDescription?.getAttribute('content') ?? '',
      twitterUrl: twitterUrl?.getAttribute('content') ?? '',
    };
    description?.setAttribute('content', descriptionContent);
    canonical?.setAttribute('href', url);
    ogTitle?.setAttribute('content', title);
    ogDescription?.setAttribute('content', descriptionContent);
    ogUrl?.setAttribute('content', url);
    twitterTitle?.setAttribute('content', title);
    twitterDescription?.setAttribute('content', descriptionContent);
    twitterUrl?.setAttribute('content', url);
    return () => {
      document.title = 'Sai Tarun Allu | Java Software Engineer';
      description?.setAttribute('content', previous.description);
      canonical?.setAttribute('href', previous.canonical);
      ogTitle?.setAttribute('content', previous.ogTitle);
      ogDescription?.setAttribute('content', previous.ogDescription);
      ogUrl?.setAttribute('content', previous.ogUrl);
      twitterTitle?.setAttribute('content', previous.twitterTitle);
      twitterDescription?.setAttribute('content', previous.twitterDescription);
      twitterUrl?.setAttribute('content', previous.twitterUrl);
    };
  }, []);

  return (
    <main className="resume-page">
      <div className="resume-toolbar">
        <Link href="/" className="resume-back" data-testid="link-resume-back"><ArrowLeft size={15} /> Portfolio</Link>
        <div className="resume-toolbar-actions">
          <button className="resume-print" onClick={() => window.print()} data-testid="button-print-resume"><Printer size={15} /> Print</button>
          <a href={resumePath} download="Allu_Surya_Naga_Sai_Tarun_Resume.pdf" className="button-primary" data-testid="link-resume-download"><Download size={15} /> Download PDF</a>
        </div>
      </div>
      <article className="resume-sheet" aria-labelledby="resume-name">
        <header className="resume-header">
          <div>
            <p className="resume-kicker">Java Software Engineer</p>
            <h1 id="resume-name">ALLU SURYA NAGA SAI TARUN</h1>
            <p className="resume-role">Core Java · OOP · JDBC · MySQL · Backend Development</p>
          </div>
          <div className="resume-contact">
            <a href="mailto:saitarun1932@gmail.com">saitarun1932@gmail.com</a>
            <a href="tel:+919676561932">+91 96765 61932</a>
            <span>Tuni, Andhra Pradesh, India</span>
            <a href={githubUrl} target="_blank" rel="noreferrer">github.com/saitarunallu</a>
            <a href={linkedinUrl} target="_blank" rel="noreferrer">linkedin.com/in/saitarunallu</a>
          </div>
        </header>
        <div className="resume-rule" />
        <section className="resume-section"><h2>Profile</h2><p>Motivated Java Developer with a Master of Computer Applications from Andhra University. Strong foundation in Core Java, JDBC, MySQL, SQL, Object-Oriented Programming, Multithreading, and backend application development. Passionate about building scalable, maintainable software using clean coding practices and continuously enhancing technical skills through hands-on project development.</p></section>
        <section className="resume-section"><h2>Technical Skills</h2><div className="resume-skill-rows">{skillGroups.map((group) => <div className="resume-skill-row" key={group.title}><strong>{group.title}</strong><span>{group.skills.join(', ')}</span></div>)}</div></section>
        <section className="resume-section"><h2>Projects</h2><div className="resume-project-list">{projects.map((project) => <div className="resume-project" key={project.id}><div><h3>{project.title}</h3><p>{project.description}</p></div><span>{project.tech.join(' · ')}</span><ul>{project.details.map((detail) => <li key={detail}>{detail}</li>)}</ul></div>)}</div></section>
        <section className="resume-section"><h2>Professional Experience</h2>{experience.map((item) => <div className="resume-experience" key={item.company}><div><h3>{item.role} <span>— {item.company}</span></h3><p>{item.date}</p></div><p>{item.description}</p></div>)}</section>
        <section className="resume-section"><h2>Education</h2>{education.map((item) => <div className="resume-education" key={item.degree}><div><h3>{item.degree}</h3><p>{item.school}</p></div><span>{item.years} · {item.score}</span></div>)}</section>
        <div className="resume-columns"><section className="resume-section"><h2>Certifications</h2><ul>{certifications.map((item) => <li key={item}>{item}</li>)}</ul></section><section className="resume-section"><h2>Achievements</h2><ul>{achievements.map((item) => <li key={item}>{item}</li>)}</ul></section></div>
      </article>
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/resume" component={Resume} />
        <Route path="/projects" component={ProjectsPage} />
        <Route path="/projects/:id" component={ProjectDetail} />
        <Route path="/:section" component={SectionPage} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;