import  { z } from 'zod';

export const Signupinput = z.object({
  username: z.string().min(2), 
  email: z.string().email(),    
  password: z.string().min(6), 
});
export const Signinput = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})
export const Message = z.object({
    content: z.string().min(1, "Content is required"), 
})

export type Signinput = z.infer<typeof Signinput>
export type Signupinput =z.infer<typeof Signupinput>
export type Message =z.infer<typeof Message>