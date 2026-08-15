import "./globals.css";

export const metadata = {
  title: "OBSIDIAN — Imperial Security Network",
  description: "A classified Imperial command portal for the post-Order-66 hunt. TS '26 Creative Prelims.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
