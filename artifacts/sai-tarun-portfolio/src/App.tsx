import { useEffect, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowUpRight, ChevronDown, ChevronUp, Download, Eye, Mail, MapPin, Menu, Phone, Terminal, X } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const resumePath = '/Allu_Surya_Tarun_Resume.pdf';

const navigation = [
  { id: 'about', label: '01 / About' },
  { id: 'skills', label: '02 / Skills' },
  { id: 'experience', label: '03 / Experience' },
  { id: 'projects', label: '04 / Projects' },
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
    title: 'Database',
    skills: ['MySQL', 'SQL', 'PreparedStatement', 'CRUD Operations', 'Transactions'],
  },
  {
    title: 'Frontend & Tools',
    skills: ['HTML5', 'CSS3', 'Bootstrap', 'Responsive Web Design', 'Flexbox', 'Git', 'IntelliJ IDEA', 'Eclipse', 'VS Code'],
  },
  {
    title: 'Engineering Practice',
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
      'Reusable DAO classes, input validation, and exception handling.',
    ],
    featured: true,
  },
  {
    id: 'student-management',
    number: '02',
    title: 'Student Management System',
    description: 'A CRUD application for registration, search, update, and deletion of student records.',
    tech: ['Java', 'JDBC', 'MySQL'],
    details: ['Persistent storage with JDBC.', 'Modular programming and validation for record management.'],
  },
  {
    id: 'library-management',
    number: '03',
    title: 'Library Management System',
    description: 'Book and member management with issue, return, search, and fine calculation features.',
    tech: ['Java', 'JDBC', 'MySQL'],
    details: ['MySQL-backed book and member records.', 'Object-oriented design for maintainability.'],
  },
  {
    id: 'employee-management',
    number: '04',
    title: 'Employee Management System',
    description: 'A layered employee management application with CRUD operations and department workflows.',
    tech: ['Java', 'JDBC', 'MySQL'],
    details: ['Employee search, department management, salary updates, and validation.', 'Layered architecture for persistent data management.'],
  },
  {
    id: 'expense-tracker',
    number: '05',
    title: 'Expense Tracker',
    description: 'An in-memory expense tracker that turns daily entries into monthly and category-wise reports.',
    tech: ['Java', 'Collections', 'Streams', 'Lambdas'],
    details: ['Java Streams and Lambda Expressions for filtering and processing.', 'Collections Framework for efficient in-memory data management.'],
  },
  {
    id: 'custom-collections',
    number: '06',
    title: 'Custom Java Collections Framework',
    description: 'Custom implementations exploring the mechanics behind familiar data structures.',
    tech: ['Core Java'],
    details: ['Custom ArrayList, LinkedList, HashMap, Stack, and Queue.', 'Hashing, collision handling, linked nodes, and dynamic resizing tested with modular classes.'],
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
          <span className="wordmark-text">Sai Tarun / Java Engineer</span>
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
              onClick={closeMenu}
              key={item.id}
              data-testid={`link-nav-${item.id}`}
            >
              {item.label}
            </a>
          ))}
          <a href={resumePath} target="_blank" rel="noreferrer" className="nav-resume" data-testid="link-nav-resume">
            Resume PDF
          </a>
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
        <span className="code-line cursor-line">&gt; <span className="code-string">ready_for_review</span><span className="cursor" /></span>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: typeof projects[number] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article className={`project-card ${project.featured ? 'featured' : ''}`} data-testid={`card-project-${project.id}`}>
      <span className="project-index">{project.number} / PROJECT</span>
      <h3>{project.title}</h3>
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
        {expanded ? 'Hide details' : 'Read build notes'}
      </button>
      {expanded && (
        <div className="project-details">
          <ul>
            {project.details.map((detail) => <li key={detail}>{detail}</li>)}
          </ul>
        </div>
      )}
    </article>
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
          <div className="eyebrow reveal">Java Software Engineer · Tuni, Andhra Pradesh</div>
          <h1 id="hero-title" className="reveal reveal-delay-1">Make it <em>work.</em><br />Make it clear.</h1>
          <p className="hero-lede reveal reveal-delay-2">I’m Allu Surya Naga Sai Tarun. A Java developer building a strong foundation in backend application development, databases, and clean, maintainable software.</p>
          <div className="hero-actions reveal reveal-delay-2">
            <a href="#projects" className="button-primary" data-testid="link-hero-projects">Explore projects <ArrowUpRight size={15} /></a>
            <a href={resumePath} target="_blank" rel="noreferrer" className="button-outline" data-testid="link-hero-resume"><Eye size={15} /> View resume</a>
            <a href={resumePath} download="Allu_Surya_Naga_Sai_Tarun_Resume.pdf" className="button-outline" data-testid="link-download-resume"><Download size={15} /> Download PDF</a>
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
            <div className="section-kicker">02 / Technical toolkit</div>
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
              <div className="section-kicker">03 / Experience</div>
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
            <div className="section-kicker">04 / Selected work</div>
            <h2 id="projects-title">Small systems.<br />Serious fundamentals.</h2>
          </div>
          <p>Hands-on projects spanning persistent data, business rules, and the internals of collections.</p>
        </div>
        <div className="project-grid">
          {projects.map((project) => <ProjectCard project={project} key={project.id} />)}
        </div>
      </section>

      <section className="education-band" aria-labelledby="education-title">
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

      <section className="section contact-section" id="contact" aria-labelledby="contact-title">
        <div className="contact-panel">
          <div>
            <div className="section-kicker">A clear next step</div>
            <h2 id="contact-title">Let’s talk about<br />the work.</h2>
          </div>
          <div className="contact-links">
            <a className="contact-link" href="mailto:saitarun1932@gmail.com" data-testid="link-email"><Mail size={15} /> saitarun1932@gmail.com <ArrowUpRight size={14} /></a>
            <a className="contact-link" href="tel:+919676561932" data-testid="link-phone"><Phone size={15} /> +91-9676561932 <ArrowUpRight size={14} /></a>
            <a className="contact-link" href={resumePath} target="_blank" rel="noreferrer" data-testid="link-contact-resume"><Terminal size={15} /> Read the resume <ArrowUpRight size={14} /></a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <span data-testid="text-footer-name">ALLU SURYA NAGA SAI TARUN</span>
        <span><MapPin size={12} style={{ verticalAlign: 'middle', marginRight: 5 }} />Tuni, Andhra Pradesh, India · Java Software Engineer</span>
      </footer>
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
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