import { env } from "@/env";
import Stripe from "stripe";

export const stripe = new Stripe(env.STRIPE_API_KEY, {
	apiVersion: "2023-10-16",
	typescript: true,
});

export const createBillingPortalSession = async (
	stripeCustomerId: string,
	billingUrl: string,
) => {
	const stripeSession = await stripe.billingPortal.sessions.create({
		customer: stripeCustomerId,
		return_url: billingUrl,
	});

	return stripeSession.url;
};

export const createCheckoutSession = async (
	stripePriceId: string,
	billingUrl: string,
	userId: string,
	customerEmail: string,
) => {
	const stripeSession = await stripe.checkout.sessions.create({
		success_url: billingUrl,
		cancel_url: billingUrl,
		payment_method_types: ["card"],
		mode: "subscription",
		billing_address_collection: "auto",
		customer_email: customerEmail,
		line_items: [
			{
				price: stripePriceId,
				quantity: 1,
			},
		],
		metadata: {
			userId: userId,
		},
	});

	return stripeSession.url;
};
