import CustomHeader from "./custom-header";

export default function Layout({ goBack = "false", children }) {

  return (
    <div>
      <CustomHeader goBack={goBack} />
      <main>{children}</main>
    </div>
  );
}
