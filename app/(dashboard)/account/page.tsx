import { prismadb } from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs/server";
import React from "react";
import { generateFromEmail } from "unique-username-generator";
import AccountContainer from "./components/AccountContainer";

async function AccountPage() {
  const fetchAccount = async (userId: string) => {
    // Attempt to find the existing account
    let account = await prismadb.account.findUnique({ where: { userId } });

    if (!account) {
  //    try {
        // Ensure the user is fetched
        const user = await currentUser();
        if (!user) throw new Error("User not found");

        const baseEmail = user.emailAddresses[0].emailAddress;

        // Attempt to create the account
        account = await prismadb.account.create({
          data: {
            userId,
            email: baseEmail,
            username: generateFromEmail(baseEmail, 3),
          },
        });
      // } catch (error) {
      //   // Handle unique constraint errors gracefully
      //   if (
      //     error instanceof prisma.PrismaClientKnownRequestError &&
      //     error.code === "P2002"
      //   ) {
      //     // Fetch the account again in case of race condition
      //     account = await prismadb.account.findUnique({ where: { userId } });
      //   } else {
      //     throw error;
      //   }
      // }
    }

    return account;
  };

  const fetchSubscription = (userId: string) => {
    return prismadb.subscription.findUnique({
      where: { userId },
    });
  };

  // Await the auth result to access `userId`
  const authResult = await auth();
  const userId = authResult?.userId;

  if (!userId) throw new Error("User not found");

  const [account, subscription] = await Promise.all([
    fetchAccount(userId),
    fetchSubscription(userId),
  ]);

  return <AccountContainer account={account} subscription={subscription} />;
}

export default AccountPage;
