import "./globals.css";
			export const metadata = {
				title: "API Rick e Morty",
			};
			export default function RootLayout({ children }) {
				return (
					<html>
						<body>
              {/* <Header /> */}
              {children}
            </body>
					</html>
);
		}