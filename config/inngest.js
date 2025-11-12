import { Inngest } from "inngest";
import connectDB from "./db";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "modeva" });

//inngest event and function definitions can go here

export const syncUserCreation = inngest.createFunction(

    {
        id:'sync-user-from-clerk'
    },{
        event:'clerk/user.created'
    }
, async ({ event, step }) => {
    const {id,first_name,last_name,email_addresses,image_url} = event.data;
    const userData = {
        _id:id,
        name:`${first_name} ${last_name}`,
        email:email_addresses[0].email_address,
        imageUrl:image_url

}
await connectDB();
await User.create(userData);
}
)
//injest function to update data
export const syncUserUpdation = inngest.createFunction(
    {
        id:'update-user-from-clerk'
    }
    ,{
        event:'clerk/user.updated'
    },
    async ({ event, step }) => {
    const {id,first_name,last_name,email_addresses,image_url} = event.data;
    const userData = {
        _id:id,
        name:`${first_name} ${last_name}`,
        email:email_addresses[0].email_address,
        imageUrl:image_url
    }
    await connectDB();
    await User.findByIdAndUpdate(id,userData);
}
)
//injest function to delete user data
export const syncUserDeletion = inngest.createFunction(
    {
        id:'delete-user-with-clerk' 
    }
    ,{
        event:'clerk/user.deleted'
    },
    async ({event})=>{
    const {id} = event.data;
    await connectDB();
    await User.findByIdAndDelete(id);
    }
)
