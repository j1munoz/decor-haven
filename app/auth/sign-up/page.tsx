import { SignUpForm } from "@/components/sign-up-form";
import Return from "@/components/return";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <Return />
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
}
