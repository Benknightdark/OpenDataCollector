import CustomHeader from "./custom-header";


export default function Layout ({goBack="false",children}) {
  return (
    <>
      <CustomHeader  goBack={goBack}/>
      <main>
        {children}
      </main>
    </>
  )
}