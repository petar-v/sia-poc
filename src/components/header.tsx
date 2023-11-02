import { PropsWithChildren } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header({ children }: PropsWithChildren<{}>) {
    return (
        <nav className="navbar navbar-light bg-light px-5">
            <Link className="navbar-brand" href="/">
                <Image
                    src="/logo.svg"
                    width="30"
                    height="30"
                    className="d-inline-block align-top mx-2"
                    alt="SIA Logo"
                />
                Software Implementation Assistant
            </Link>
            <div>{children}</div>
        </nav>
    );
}
