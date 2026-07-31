"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/validations/authSchema";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

import Link from "next/link";

import {
Card,
CardContent,
CardHeader,
CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

export default function RegisterForm(){

const router=useRouter();

const {register:registerUser}=useAuth();

const{

register,

handleSubmit,

formState:{errors,isSubmitting}

}=useForm({

resolver:zodResolver(registerSchema)

});

const onSubmit=async(data)=>{

const res=await registerUser(data);

if(res.success){

router.push("/dashboard");

}

}

return(

<Card className="w-full max-w-md">

<CardHeader>

<CardTitle className="text-center text-2xl">

Create Account

</CardTitle>

</CardHeader>

<CardContent>

<form
onSubmit={handleSubmit(onSubmit)}
className="space-y-5"
>

<div>

<Label>Name</Label>

<Input
{...register("name")}
/>

<p className="text-red-500 text-sm">

{errors.name?.message}

</p>

</div>

<div>

<Label>Email</Label>

<Input
type="email"
{...register("email")}
/>

<p className="text-red-500 text-sm">

{errors.email?.message}

</p>

</div>

<div>

<Label>Password</Label>

<Input
type="password"
{...register("password")}
/>

<p className="text-red-500 text-sm">

{errors.password?.message}

</p>

</div>

<Button
className="w-full"
disabled={isSubmitting}
>

{isSubmitting?"Loading...":"Register"}

</Button>

<p className="text-center text-sm">

Already have an account?

<Link
href="/login"
className="text-blue-600 ml-2"
>

Login

</Link>

</p>

</form>

</CardContent>

</Card>

)

}