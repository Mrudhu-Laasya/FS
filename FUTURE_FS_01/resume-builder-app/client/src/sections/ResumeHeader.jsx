import "../index.css";

export default function ResumeHeader() {
  return (
    <>
      <div className="resume-header-text">
        <h1>Mrudhu Laasya Bhogaraju</h1>
        <p className="subtitle">
          Software Engineer <span>|</span> Full Stack Developer <span>|</span>{" "}
          AI/ML Enthusiast
        </p>

        <div className="resume-contact">
          <span className="contact-button">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            Hyderabad, India
          </span>

          <a href="tel:+919999999999" className="contact-button">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.6 2.8 4 5.4c-.7.7-.8 1.8-.3 2.7 2.4 4.7 6.2 8.5 10.9 10.9.9.5 2 .4 2.7-.3l2.6-2.6c.5-.5.5-1.3.1-1.8l-2.5-3c-.4-.5-1.1-.6-1.7-.3l-2.2 1.1c-1.7-.9-3.1-2.3-4-4l1.1-2.2c.3-.6.2-1.3-.3-1.7l-3-2.5c-.5-.4-1.3-.4-1.8.1z" />
            </svg>
            +91 999999999
          </a>

          <a
            href="mailto:mrudhulaasya.bhogaraju@gmail.com"
            className="contact-button"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m4 7 8 6 8-6" />
            </svg>
            mrudhulaasya.bhogaraju@gmail.com
          </a>

          <a
            href="https://www.linkedin.com/in/bhogarajumrudhulaasya"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-button"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <path d="M8 10v6M8 7.5v.01M12 16v-6M12 13c0-1.7 1-3 2.7-3 1.6 0 2.3 1.1 2.3 3v3" />
            </svg>
            linkedin.com/in/bhogarajumrudhulaasya
          </a>

          <a
            href="https://github.com/Mrudhu-Laasya"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-button"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 19c-4 .9-4-2-5-2m10 4v-3.9c0-1.1.1-1.4-.5-2C15.1 16.7 18 16.2 18 12c0-1.2-.4-2.2-1-3 .1-.3.5-1.5-.1-3 0 0-1-.3-3.1 1.2a10.8 10.8 0 0 0-5.6 0C6.1 5.7 5.1 6 5.1 6c-.6 1.5-.2 2.7-.1 3-.6.8-1 1.8-1 3 0 4.2 2.9 4.7 4.5 5.1-.5.5-.5 1-.5 2V21" />
            </svg>
            github.com/Mrudhu-Laasya
          </a>
        </div>
      </div>
    </>
  );
}
