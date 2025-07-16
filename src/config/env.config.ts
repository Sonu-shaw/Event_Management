import dotenv from "dotenv";
import {z} from "zod";


dotenv.config();


const envSchema = z.object({
    PORT: z.string().default("3000"),
    DATABASE_URL: z.string().url().optional().or(z.literal("")),
});

const parsedEnv = envSchema.safeParse(process.env);


if(!parsedEnv.success){
    console.error("Invalid environment variables: ",parsedEnv.error.format());
    process.exit(1);
}


export const env = parsedEnv.data;