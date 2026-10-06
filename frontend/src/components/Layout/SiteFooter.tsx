const FACEBOOK_URL = "https://www.facebook.com/share/19UTzp4dbq/?mibextid=wwXIfr";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <span className="copyright">© {new Date().getFullYear()} Phạm Nguyễn Hoàng Phúc. All rights reserved.</span>
      <a
        className="social-link"
        href={FACEBOOK_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.87h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
        </svg>
        Facebook
      </a>
    </footer>
  );
}
