import { PropsWithChildren } from "react";
import Image from "next/image";

export default function Header({ children }: PropsWithChildren<{}>) {
    return (
        <nav className="navbar navbar-light bg-light px-5">
            <a className="navbar-brand" href="/">
                <Image
                    src="/logo.svg"
                    width="30"
                    height="30"
                    className="d-inline-block align-top mx-2"
                    alt="SIA Logo"
                />
                Software Implementation Assistant
            </a>
            <div>{children}</div>
        </nav>
    );
}
