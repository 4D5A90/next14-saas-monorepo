import { GoogleIcon } from "@/components/google-icon";
import { TextSeparator } from "@/components/text-separator";
import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Fragment } from "react";

export const OAuthButtons = () => {
  return (
    <Fragment>
      <div className="flex flex-col gap-2">
        {!!env.DISCORD_CLIENT_ID && (
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login/discord">
              <DiscordLogoIcon className="mr-2 h-5 w-5" />
              Log in with Discord
            </Link>
          </Button>
        )}
        {!!env.GITHUB_CLIENT_ID && (
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login/github">
              <GitHubLogoIcon className="mr-2 h-5 w-5" />
              Log in with Github
            </Link>
          </Button>
        )}
        {!!env.GOOGLE_CLIENT_ID && (
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login/google">
              <GoogleIcon className="mr-2 h-5 w-5" />
              Log in with Google
            </Link>
          </Button>
        )}
      </div>
      <TextSeparator />
    </Fragment>
  );
};
