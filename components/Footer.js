// components/Footer.js

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {currentYear} Team Lost - Georgia Gwinnett College. All Rights Reserved.</p>
      </div>
    </footer>
  );
}