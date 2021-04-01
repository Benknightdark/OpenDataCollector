import CustomHeader from "./custom-header";
import { useSession } from "next-auth/client";

export default function Layout({ goBack = "false", children }) {
  const [session, loading] = useSession();

  if (session) {
    console.log(session);
  }
  return (
    <>
      <CustomHeader goBack={goBack} />
      <main>{children}</main>
    </>
  );
}
