import { freePlan, proPlan, subscriptionPlans } from "@/config/subscriptions";
import {
	getStripeCustomer,
	getUserWithStripeCustomer,
} from "@/data-access/stripe";

import {
	createBillingPortalSession,
	createCheckoutSession,
	stripe,
} from "@/lib/stripe";
import { absoluteUrl, formatPrice } from "@/lib/utils";

export const isPlanCanceledUseCase = async (
	isUserProPlan: boolean,
	stripeSubscriptionId: string | null,
) => {
	if (isUserProPlan && stripeSubscriptionId) {
		const stripePlan =
			await stripe.subscriptions.retrieve(stripeSubscriptionId);
		return stripePlan.cancel_at_period_end;
	}

	return false;
};

export const isUserProUseCase = (
	stripePriceId: string | null,
	stripeCurrentPeriodEnd: Date | null,
) =>
	!!stripePriceId &&
	(stripeCurrentPeriodEnd?.getTime() ?? 0) + 86_400_000 > Date.now();

export const getUserPlanUseCase = async (userId: string) => {
	const stripeCustomer = await getStripeCustomer(userId);

	if (!stripeCustomer) {
		throw new Error("Stripe customer not found");
	}

	const isPro = isUserProUseCase(
		stripeCustomer.stripePriceId,
		stripeCustomer.stripeCurrentPeriodEnd,
	);

	const plan = isPro ? proPlan : freePlan;

	const isCanceled = await isPlanCanceledUseCase(
		isPro,
		stripeCustomer.stripeSubscriptionId,
	);

	return {
		...plan,
		...stripeCustomer,
		isPro,
		isCanceled,
	};
};

export const manageSubscriptionUseCase = async ({
	userId,
	stripePriceId,
	stripeCustomerId,
	isPro,
}: {
	userId: string;
	stripePriceId: string;
	stripeCustomerId: string | null;
	stripeSubscriptionId: string | null;
	isPro: boolean;
}) => {
	const billingUrl = absoluteUrl("/dashboard/billing");

	const user = await getUserWithStripeCustomer(userId);

	if (!user) {
		throw new Error("User not found.");
	}

	// If the user is already subscribed to a plan, we redirect them to the Stripe billing portal
	if (isPro && stripeCustomerId) {
		return createBillingPortalSession(stripeCustomerId, billingUrl);
	}

	// If the user is not subscribed to a plan, we create a Stripe Checkout session
	return createCheckoutSession(stripePriceId, billingUrl, user.id, user.email);
};

export const getStripePlansUseCase = async () => {
	try {
		const proPrice = await stripe.prices.retrieve(proPlan.stripePriceId);

		return subscriptionPlans.map((plan) => {
			return {
				...plan,
				price:
					plan.stripePriceId === proPlan.stripePriceId
						? formatPrice((proPrice.unit_amount ?? 0) / 100, {
								currency: proPrice.currency,
							})
						: formatPrice(0 / 100, { currency: proPrice.currency }),
			};
		});
	} catch (err) {
		console.error(err); // TODO: handle error
		return [];
	}
};
