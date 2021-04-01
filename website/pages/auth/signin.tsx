import { csrfToken,getCsrfToken, signIn } from 'next-auth/client'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useRouter } from 'next/router';
export default function SignIn({ csrfToken }) {
  const router=useRouter();
  const schema = yup.object().shape({
    userName: yup.string().required("不能為空值"),
    password: yup.string().required("不能為空值"),
  });
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = data => {
    console.log(data)
     signIn("credentials", {
                    username: data.userName,
                    password: data.password,
                    redirect: false,
                  }).then((r)=>{
                      if(r.error===null){
                        router.push('/')
                      }
                  })
  };
  console.log(errors);
  return (
    <form method='post'  onSubmit={handleSubmit(onSubmit)}>
      <input name='csrfToken' type='hidden' defaultValue={csrfToken}/>
      <input type="text" placeholder="userName" name="userName" ref={register({required: true})} />
      <p>{errors.userName?.message}</p>
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