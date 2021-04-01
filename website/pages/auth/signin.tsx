import { csrfToken,getCsrfToken, signIn } from 'next-auth/client'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
export default function SignIn({ csrfToken }) {
  const schema = yup.object().shape({
    account: yup.string().required("不能為空值"),
    password: yup.string().required("不能為空值"),
  });
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = data => {
     signIn("credentials", {
                    username: "jsmith",
                    password: "1234",
                    redirect: false,
                  }).then((r)=>{
                      console.log(r)
                  })
  };
  console.log(errors);
  return (
    <form method='post'  onSubmit={handleSubmit(onSubmit)}>
      <input name='csrfToken' type='hidden' defaultValue={csrfToken}/>
      <input type="text" placeholder="account" name="account" ref={register({required: true})} />
      <p>{errors.account?.message}</p>
      <input type="text" placeholder="password" name="password" ref={register({required: true})} />
      <p>{errors.password?.message}</p>
      <input type="submit" />
      {/* <button type='submit'>Sign in</button> */}
    </form>
  )
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context)
    }
  }
}