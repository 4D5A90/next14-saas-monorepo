import { db } from "@/server/db";

export const getStripeCustomer = async (userId: string) => {
	return db.query.users.findFirst({
		where: (table, { eq }) => eq(table.id, userId),
		columns: {
			stripePriceId: true,
			stripeCurrentPeriodEnd: true,
			stripeSubscriptionId: true,
			stripeCustomerId: true,
		},
	});
};

export const getUserWithStripeCustomer = async (userId: string) => {
	return db.query.users.findFirst({
		where: (table, { eq }) => eq(table.id, userId),
		columns: {
			id: true,
			email: true,
			username: true,
			stripePriceId: true,
			stripeCurrentPeriodEnd: true,
			stripeSubscriptionId: true,
			stripeCustomerId: true,
		},
	});
};
