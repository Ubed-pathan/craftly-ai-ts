import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    console.log("user not found");
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    
    const name =`${user.firstName} ${user.lastName}`;;
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name, //name: name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newUser;
  } catch (error) {
    console.log(error.message);
  }
};




// import { currentUser } from "@clerk/nextjs/server";
// import { db } from "./prisma";

// export const checkUser = async () => {
//   // currentUser() can throw if the request didn’t pass Clerk middleware
//   let clerkUser = null;
//   try {
//     clerkUser = await currentUser();
//   } catch {
//     return null;
//   }
//   if (!clerkUser) return null;

//   try {
//     const existing = await db.user.findUnique({
//       where: { clerkUserId: clerkUser.id },
//     });
//     if (existing) return existing;

//     const name =
//       `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() ||
//       clerkUser.username ||
//       clerkUser.emailAddresses?.[0]?.emailAddress?.split("@")?.[0] ||
//       "User";

//     const created = await db.user.create({
//       data: {
//         clerkUserId: clerkUser.id,
//         name,
//         imageUrl: clerkUser.imageUrl ?? null,
//         email: clerkUser.emailAddresses?.[0]?.emailAddress ?? null,
//       },
//     });

//     return created;
//   } catch (err) {
//     return null;
//   }
// };